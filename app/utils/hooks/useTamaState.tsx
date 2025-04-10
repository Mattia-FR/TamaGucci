import { useReducer, useEffect, useCallback, useRef } from "react";
import { useSnackbar } from "../contexts/SnackbarContext";
import * as Notifications from "expo-notifications";
import { ActionType, type TamaStats, type HealthState } from "../core/types";
import { DECAY_CONFIG, ABUSE_DETECTION, CRITICAL_LEVELS } from "../core/config";
import { tamaReducer, getInitialState } from "../core/tamReducer";

interface TamaActions {
	feed: () => void;
	play: () => void;
	clean: () => void;
	rest: () => void;
}

interface TamaHookReturn {
	stats: TamaStats;
	healthState: HealthState;
	actions: TamaActions;
	getStatColor: (value: number) => string;
}

export default function useTamaState(): TamaHookReturn {
	const { showSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(tamaReducer, null, getInitialState);

	// Use refs for timers to avoid memory leaks
	const timersRef = useRef<NodeJS.Timeout[]>([]);

	// Helper to show notifications and snackbars
	const showStatWarning = useCallback(
		(message: string): void => {
			showSnackbar(message);

			void Notifications.scheduleNotificationAsync({
				content: {
					title: "Tama en détresse !",
					body: message,
				},
				trigger: null,
			});
		},
		[showSnackbar],
	);

	// Set up decay timers for each stat
	useEffect(() => {
		// Clear any existing timers
		for (const timer of timersRef.current) {
			clearInterval(timer);
		}
		timersRef.current = [];

		// Create new timers
		for (const [stat, { interval, amount }] of Object.entries(DECAY_CONFIG)) {
			const timer = setInterval(() => {
				dispatch({
					type: "DECAY_STAT",
					payload: {
						statName: stat as keyof TamaStats,
						amount,
					},
				});
			}, interval);

			timersRef.current.push(timer);
		}

		// Health check timer
		const healthCheckInterval = setInterval(() => {
			dispatch({ type: "UPDATE_HEALTH" });
		}, 5000); // Check every 5 seconds

		timersRef.current.push(healthCheckInterval);

		// Cleanup all timers on unmount
		return () => {
			for (const timer of timersRef.current) {
				clearInterval(timer);
			}
			timersRef.current = [];
		};
	}, []);

	// Monitor health changes
	useEffect(() => {
		const { isSick } = state.health;
		const { hunger, energy, cleanliness } = state.stats;

		// If just became sick
		if (state.health.sickCounter >= CRITICAL_LEVELS.SICK_THRESHOLD && !isSick) {
			showStatWarning("Ton Tama est tombé malade !");
		}

		// If just recovered
		if (
			isSick &&
			hunger > CRITICAL_LEVELS.RECOVERY_THRESHOLD &&
			energy > CRITICAL_LEVELS.RECOVERY_THRESHOLD &&
			cleanliness > CRITICAL_LEVELS.RECOVERY_THRESHOLD
		) {
			showSnackbar("Bonne nouvelle ! Tama est guéri 🎉");
		}
	}, [state.health, state.stats, showSnackbar, showStatWarning]);

	// Monitor critical stats
	useEffect(() => {
		const { hunger, energy, cleanliness } = state.stats;

		if (hunger <= CRITICAL_LEVELS.HUNGER) {
			showStatWarning("Ton Tama est affamé !");
		}
		if (energy <= CRITICAL_LEVELS.ENERGY) {
			showStatWarning("Ton Tama est épuisé !");
		}
		if (cleanliness <= CRITICAL_LEVELS.CLEANLINESS) {
			showStatWarning("Ton Tama est cracra !");
		}
	}, [state.stats, showStatWarning]);

	// Set up automatic unblocking of actions
	useEffect(() => {
		const unblockTimers: { [key: string]: NodeJS.Timeout } = {};

		for (const [action, isBlocked] of Object.entries(state.blockedActions)) {
			// Clear existing timer if any
			if (unblockTimers[action]) {
				clearTimeout(unblockTimers[action]);
				delete unblockTimers[action];
			}

			// Set new timer if blocked
			if (isBlocked) {
				unblockTimers[action] = setTimeout(() => {
					dispatch({
						type: "UNBLOCK_ACTION",
						payload: { action: action as ActionType },
					});
					delete unblockTimers[action];
				}, ABUSE_DETECTION.blockDuration);
			}
		}

		return () => {
			// Clean up all unblock timers
			for (const timer of Object.values(unblockTimers)) {
				clearTimeout(timer);
			}
		};
	}, [state.blockedActions]);

	// Helper function to perform actions
	const performAction = useCallback(
		(actionType: ActionType): void => {
			if (state.blockedActions[actionType]) {
				showSnackbar(
					`Tu as trop utilisé "${actionType}" récemment. Attends un peu.`,
				);
				return;
			}

			// Special messages for certain conditions
			if (
				actionType === ActionType.PLAY &&
				state.stats.hunger < 20 &&
				state.stats.energy < 20
			) {
				showSnackbar("Tama est trop fatigué et affamé pour jouer.");
			}

			if (actionType === ActionType.CLEAN && state.stats.cleanliness < 10) {
				showSnackbar(
					"Tama refuse de faire quoi que ce soit tant qu'il n'est pas propre !",
				);
			}

			if (actionType === ActionType.REST && state.stats.cleanliness < 20) {
				showSnackbar("C'est dégoûtant ici, Tama n'arrive pas à bien dormir.");
			}

			dispatch({
				type: "PERFORM_ACTION",
				payload: {
					type: actionType,
					timestamp: Date.now(),
				},
			});
		},
		[state.blockedActions, state.stats, showSnackbar],
	);

	// Create action handlers
	const actions: TamaActions = {
		feed: () => performAction(ActionType.FEED),
		play: () => performAction(ActionType.PLAY),
		clean: () => performAction(ActionType.CLEAN),
		rest: () => performAction(ActionType.REST),
	};

	// Utility function to get stat color
	const getStatColor = useCallback((value: number): string => {
		if (value <= 20) return "#bde2f0";
		if (value <= 80) return "#e6aeae";
		return "#e88484";
	}, []);

	return {
		stats: state.stats,
		healthState: state.health,
		actions,
		getStatColor,
	};
}
