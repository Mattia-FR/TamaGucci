import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "../utils/SnackbarContext";

type ActionName = "feed" | "play" | "clean" | "rest";

const MIN_STAT_VALUE = 0;
const MAX_STAT_VALUE = 100;

const criticalLevels = {
	HUNGER: 10,
	ENERGY: 10,
	CLEANLINESS: 5,
	SICK_THRESHOLD: 3,
	RECOVERY_THRESHOLD: 30,
};

const DECAY_CONFIG = {
	happiness: { interval: 120000, amount: 4 },
	hunger: { interval: 90000, amount: 6 },
	cleanliness: { interval: 150000, amount: 3 },
	energy: { interval: 100000, amount: 5 },
};

const actionCooldowns: Record<ActionName, number> = {
	feed: 30000,
	play: 45000,
	clean: 60000,
	rest: 90000,
};

const abuseDetectionConfig = {
	threshold: 3, // Y fois
	window: 10000, // Z ms
	blockDuration: 15000, // X ms
};

export interface TamagotchiStats {
	happiness: number;
	hunger: number;
	cleanliness: number;
	energy: number;
}

export interface HealthState {
	isSick: boolean;
	sickCounter: number;
}

export default function useTamagotchiState() {
	const { showSnackbar } = useSnackbar();
	const [stats, setStats] = useState<TamagotchiStats>({
		happiness: 50,
		hunger: 50,
		cleanliness: 50,
		energy: 50,
	});

	const [healthState, setHealthState] = useState<HealthState>({
		isSick: false,
		sickCounter: 0,
	});

	const [lastActions, setLastActions] = useState<Record<string, number>>({});
	const [actionHistory, setActionHistory] = useState<
		Record<ActionName, number[]>
	>({
		feed: [],
		play: [],
		clean: [],
		rest: [],
	});
	const [blockedActions, setBlockedActions] = useState<
		Record<ActionName, boolean>
	>({
		feed: false,
		play: false,
		clean: false,
		rest: false,
	});

	const updateStat = useCallback(
		(statName: keyof TamagotchiStats, change: number) => {
			setStats((prevStats) => ({
				...prevStats,
				[statName]: Math.max(
					MIN_STAT_VALUE,
					Math.min(prevStats[statName] + change, MAX_STAT_VALUE),
				),
			}));
		},
		[],
	);

	// Déclin asymétrique
	useEffect(() => {
		const timers = Object.entries(DECAY_CONFIG).map(
			([stat, { interval, amount }]) => {
				return setInterval(() => {
					updateStat(stat as keyof TamagotchiStats, -amount);
				}, interval);
			},
		);
		return () => timers.forEach(clearInterval);
	}, [updateStat]);

	// Maladie
	// Premier useEffect : gestion du compteur de maladie
	useEffect(() => {
		const { hunger, energy, cleanliness } = stats;

		if (
			hunger <= criticalLevels.HUNGER ||
			energy <= criticalLevels.ENERGY ||
			cleanliness <= criticalLevels.CLEANLINESS
		) {
			setHealthState((prev) => ({
				...prev,
				sickCounter: prev.sickCounter + 1,
			}));
		} else {
			setHealthState((prev) => ({
				...prev,
				sickCounter: 0,
			}));
		}
	}, [stats]); // Ce useEffect ne dépend que de `stats`

	// Deuxième useEffect : gestion de la maladie et de la guérison
	useEffect(() => {
		// Si le Tamagotchi atteint le seuil de maladie
		if (
			healthState.sickCounter >= criticalLevels.SICK_THRESHOLD &&
			!healthState.isSick
		) {
			setHealthState((prev) => ({
				...prev,
				isSick: true,
			}));
			showStatWarning("Ton Tama est tombé malade !");
		}

		// Si le Tamagotchi guérit
		if (
			healthState.isSick &&
			stats.hunger > criticalLevels.RECOVERY_THRESHOLD &&
			stats.energy > criticalLevels.RECOVERY_THRESHOLD &&
			stats.cleanliness > criticalLevels.RECOVERY_THRESHOLD
		) {
			setHealthState({
				isSick: false,
				sickCounter: 0,
			});
			showSnackbar("Bonne nouvelle ! Tama est guéri 🎉");
		}
	}, [healthState.sickCounter, healthState.isSick, stats, showSnackbar]); // Ce useEffect dépend des deux états `healthState` et `stats`

	// Alertes
	useEffect(() => {
		const { hunger, energy, cleanliness } = stats;

		if (hunger <= criticalLevels.HUNGER) {
			showStatWarning("Ton Tama est affamé !");
		}
		if (energy <= criticalLevels.ENERGY) {
			showStatWarning("Ton Tama est épuisé !");
		}
		if (cleanliness <= criticalLevels.CLEANLINESS) {
			showStatWarning("Ton Tama est cracra !");
		}
	}, [stats]);

	const showStatWarning = (message: string) => {
		showSnackbar(message);

		Notifications.scheduleNotificationAsync({
			content: {
				title: "Tamagotchi en détresse !",
				body: message,
			},
			trigger: null,
		});
	};

	const isActionBlocked = (action: ActionName): boolean => {
		const timestamps = actionHistory[action];
		const now = Date.now();
		const recentUses = timestamps.filter(
			(t) => now - t < abuseDetectionConfig.window,
		);

		if (recentUses.length >= abuseDetectionConfig.threshold) {
			if (!blockedActions[action]) {
				setBlockedActions((prev) => ({ ...prev, [action]: true }));
				showSnackbar(
					`Tu as trop utilisé "${action}" récemment. Attends un peu.`,
				);
				setTimeout(() => {
					setBlockedActions((prev) => ({ ...prev, [action]: false }));
				}, abuseDetectionConfig.blockDuration);
			}
			return true;
		}

		return false;
	};

	const getEffectiveness = (action: ActionName): number => {
		const now = Date.now();
		const lastTime = lastActions[action] || 0;
		const cooldown = actionCooldowns[action];

		// Historique des actions
		setActionHistory((prev) => ({
			...prev,
			[action]: [...(prev[action] || []), now].filter(
				(t) => now - t < abuseDetectionConfig.window,
			),
		}));

		setLastActions((prev) => ({ ...prev, [action]: now }));

		const isSpammed = now - lastTime < cooldown;
		return isSpammed ? 0.5 : 1;
	};

	const actions = {
		feed: () => {
			if (isActionBlocked("feed")) return;
			const efficiency = getEffectiveness("feed");
			const base = healthState.isSick ? 5 : 10;
			updateStat("hunger", base * efficiency);
			if (stats.hunger > 90) updateStat("happiness", -5);
		},

		play: () => {
			if (isActionBlocked("play")) return;
			const efficiency = getEffectiveness("play");

			if (stats.hunger < 20 && stats.energy < 20) {
				updateStat("happiness", -5);
				showSnackbar("Tama est trop fatigué et affamé pour jouer.");
				return;
			}

			const base = healthState.isSick ? 5 : 10;
			updateStat("happiness", base * efficiency);

			if (stats.cleanliness < 20) updateStat("happiness", -5);
		},

		clean: () => {
			if (isActionBlocked("clean")) return;
			const efficiency = getEffectiveness("clean");
			const base = healthState.isSick ? 5 : 10;
			updateStat("cleanliness", base * efficiency);
			if (stats.cleanliness < 10) {
				showSnackbar(
					"Tama refuse de faire quoi que ce soit tant qu'il n'est pas propre !",
				);
			}
		},

		rest: () => {
			if (isActionBlocked("rest")) return;
			const efficiency = getEffectiveness("rest");
			if (stats.cleanliness < 20) {
				updateStat("energy", 10 * efficiency);
				showSnackbar("C'est dégoûtant ici, Tama n'arrive pas à bien dormir.");
			} else {
				const base = healthState.isSick ? 10 : 20;
				updateStat("energy", base * efficiency);
			}
		},
	};

	const getStatColor = (value: number): string => {
		if (value <= 20) return "#bde2f0";
		if (value <= 80) return "#e6aeae";
		return "#e88484";
	};

	return {
		stats,
		healthState,
		actions,
		getStatColor,
	};
}
