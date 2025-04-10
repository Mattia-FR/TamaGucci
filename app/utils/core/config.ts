import { ActionType } from "./types";

export const LIMITS = {
	MIN_STAT_VALUE: 0,
	MAX_STAT_VALUE: 100,
} as const;

export const CRITICAL_LEVELS = {
	HUNGER: 10,
	ENERGY: 10,
	CLEANLINESS: 5,
	SICK_THRESHOLD: 3,
	RECOVERY_THRESHOLD: 30,
} as const;

export const DECAY_CONFIG = {
	happiness: { interval: 120000, amount: 4 },
	hunger: { interval: 90000, amount: 6 },
	cleanliness: { interval: 150000, amount: 3 },
	energy: { interval: 100000, amount: 5 },
} as const;

export const ACTION_COOLDOWNS: { [key in ActionType]: number } = {
	[ActionType.FEED]: 30000,
	[ActionType.PLAY]: 45000,
	[ActionType.CLEAN]: 60000,
	[ActionType.REST]: 90000,
};

export const ABUSE_DETECTION = {
	threshold: 3,
	window: 10000,
	blockDuration: 15000,
} as const;
