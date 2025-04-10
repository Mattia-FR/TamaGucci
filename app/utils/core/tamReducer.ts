import {
	ActionType,
	type TamaState,
	type TamaStats,
	type StateAction,
	type ActionPayload,
	type ActionHistory,
	type ActionTimestamps,
} from "./types";
import {
	LIMITS,
	CRITICAL_LEVELS,
	ACTION_COOLDOWNS,
	ABUSE_DETECTION,
} from "./config";

export const getInitialState = (): TamaState => ({
	stats: {
		happiness: 50,
		hunger: 50,
		cleanliness: 50,
		energy: 50,
	},
	health: {
		isSick: false,
		sickCounter: 0,
	},
	lastActions: {},
	actionHistory: {
		[ActionType.FEED]: [],
		[ActionType.PLAY]: [],
		[ActionType.CLEAN]: [],
		[ActionType.REST]: [],
	},
	blockedActions: {
		[ActionType.FEED]: false,
		[ActionType.PLAY]: false,
		[ActionType.CLEAN]: false,
		[ActionType.REST]: false,
	},
});

const updateStat = (
	stats: TamaStats,
	statName: keyof TamaStats,
	change: number,
): TamaStats => ({
	...stats,
	[statName]: Math.max(
		LIMITS.MIN_STAT_VALUE,
		Math.min(stats[statName] + change, LIMITS.MAX_STAT_VALUE),
	),
});

const isActionBlocked = (
	action: ActionType,
	actionHistory: ActionHistory,
): boolean => {
	const timestamps = actionHistory[action];
	const now = Date.now();
	const recentUses = timestamps.filter((t) => now - t < ABUSE_DETECTION.window);

	return recentUses.length >= ABUSE_DETECTION.threshold;
};

const getEffectiveness = (
	action: ActionType,
	lastActions: ActionTimestamps,
): number => {
	const now = Date.now();
	const lastTime = lastActions[action] || 0;
	const cooldown = ACTION_COOLDOWNS[action];

	const isSpammed = now - lastTime < cooldown;
	return isSpammed ? 0.5 : 1;
};

const performAction = (state: TamaState, payload: ActionPayload): TamaState => {
	const { type: action, timestamp } = payload;

	// Check if action is blocked
	if (state.blockedActions[action]) {
		return state;
	}

	// Check for abuse and block if necessary
	if (isActionBlocked(action, state.actionHistory)) {
		return {
			...state,
			blockedActions: {
				...state.blockedActions,
				[action]: true,
			},
		};
	}

	// Record action for history
	const newActionHistory = {
		...state.actionHistory,
		[action]: [...state.actionHistory[action], timestamp].filter(
			(t) => timestamp - t < ABUSE_DETECTION.window,
		),
	};

	const newLastActions = {
		...state.lastActions,
		[action]: timestamp,
	};

	// Calculate effect based on action type
	const efficiency = getEffectiveness(action, state.lastActions);
	let newStats = { ...state.stats };
	const isSick = state.health.isSick;

	switch (action) {
		case ActionType.FEED: {
			const base = isSick ? 5 : 10;
			newStats = updateStat(newStats, "hunger", base * efficiency);
			if (newStats.hunger > 90) {
				newStats = updateStat(newStats, "happiness", -5);
			}
			break;
		}

		case ActionType.PLAY: {
			if (newStats.hunger < 20 && newStats.energy < 20) {
				newStats = updateStat(newStats, "happiness", -5);
				// Notification effect handled separately
				return {
					...state,
					stats: newStats,
					lastActions: newLastActions,
					actionHistory: newActionHistory,
				};
			}

			const base = isSick ? 5 : 10;
			newStats = updateStat(newStats, "happiness", base * efficiency);

			if (newStats.cleanliness < 20) {
				newStats = updateStat(newStats, "happiness", -5);
			}
			break;
		}

		case ActionType.CLEAN: {
			const base = isSick ? 5 : 10;
			newStats = updateStat(newStats, "cleanliness", base * efficiency);
			break;
		}

		case ActionType.REST: {
			if (newStats.cleanliness < 20) {
				newStats = updateStat(newStats, "energy", 10 * efficiency);
				// Notification effect handled separately
			} else {
				const base = isSick ? 10 : 20;
				newStats = updateStat(newStats, "energy", base * efficiency);
			}
			break;
		}
	}

	return {
		...state,
		stats: newStats,
		lastActions: newLastActions,
		actionHistory: newActionHistory,
	};
};

const updateHealth = (state: TamaState): TamaState => {
	const { hunger, energy, cleanliness } = state.stats;
	let { isSick, sickCounter } = state.health;

	// Check if stats are at critical levels
	if (
		hunger <= CRITICAL_LEVELS.HUNGER ||
		energy <= CRITICAL_LEVELS.ENERGY ||
		cleanliness <= CRITICAL_LEVELS.CLEANLINESS
	) {
		sickCounter += 1;
	} else {
		sickCounter = 0;
	}

	// Check if should become sick
	if (sickCounter >= CRITICAL_LEVELS.SICK_THRESHOLD && !isSick) {
		isSick = true;
		// Notification effect handled separately
	}

	// Check if should recover
	if (
		isSick &&
		hunger > CRITICAL_LEVELS.RECOVERY_THRESHOLD &&
		energy > CRITICAL_LEVELS.RECOVERY_THRESHOLD &&
		cleanliness > CRITICAL_LEVELS.RECOVERY_THRESHOLD
	) {
		isSick = false;
		sickCounter = 0;
		// Notification effect handled separately
	}

	return {
		...state,
		health: {
			isSick,
			sickCounter,
		},
	};
};

export const tamaReducer = (
	state: TamaState,
	action: StateAction,
): TamaState => {
	switch (action.type) {
		case "PERFORM_ACTION":
			return performAction(state, action.payload);

		case "DECAY_STAT":
			return {
				...state,
				stats: updateStat(
					state.stats,
					action.payload.statName,
					-action.payload.amount,
				),
			};

		case "UPDATE_HEALTH":
			return updateHealth(state);

		case "UNBLOCK_ACTION":
			return {
				...state,
				blockedActions: {
					...state.blockedActions,
					[action.payload.action]: false,
				},
			};

		default:
			// This helps with TypeScript's exhaustiveness checking
			return state;
	}
};
