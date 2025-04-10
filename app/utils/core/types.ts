export enum ActionType {
	FEED = "feed",
	PLAY = "play",
	CLEAN = "clean",
	REST = "rest",
}

export interface TamaStats {
	happiness: number;
	hunger: number;
	cleanliness: number;
	energy: number;
}

export interface HealthState {
	isSick: boolean;
	sickCounter: number;
}

export type ActionTimestamps = Record<string, number>;

export type ActionHistory = {
	[key in ActionType]: number[];
};

export type BlockedActions = {
	[key in ActionType]: boolean;
};

export interface TamaState {
	stats: TamaStats;
	health: HealthState;
	lastActions: ActionTimestamps;
	actionHistory: ActionHistory;
	blockedActions: BlockedActions;
}

export enum ActionResult {
	SUCCESS = 0,
	BLOCKED = 1,
	INEFFECTIVE = 2,
}

export type ActionPayload = {
	type: ActionType;
	timestamp: number;
};

export type DecayPayload = {
	statName: keyof TamaStats;
	amount: number;
};

export type StateAction =
	| { type: "PERFORM_ACTION"; payload: ActionPayload }
	| { type: "DECAY_STAT"; payload: DecayPayload }
	| { type: "UPDATE_HEALTH" }
	| { type: "UNBLOCK_ACTION"; payload: { action: ActionType } };
