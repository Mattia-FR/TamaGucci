// hooks/useTamagotchiState.ts
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

const STAT_DECREASE_INTERVAL = 100000; // 100 secondes
const STAT_DECREASE_AMOUNT = 5;
const MIN_STAT_VALUE = 0;
const MAX_STAT_VALUE = 100;

// Niveaux critiques des statistiques
const CRITICAL_LEVELS = {
	HUNGER: 10,
	ENERGY: 10,
	CLEANLINESS: 5,
	SICK_THRESHOLD: 3,
	RECOVERY_THRESHOLD: 30,
};

export interface TamagotchiStats {
	happiness: number;
	hunger: number;
	cleanliness: number;
	energy: number;
	age: number;
}

export interface HealthState {
	isSick: boolean;
	sickCounter: number;
}

export default function useTamagotchiState() {
	// Regroupement des stats dans un seul objet d'état
	const [stats, setStats] = useState<TamagotchiStats>({
		happiness: 50,
		hunger: 50,
		cleanliness: 50,
		energy: 50,
		age: 0,
	});

	// État de santé
	const [healthState, setHealthState] = useState<HealthState>({
		isSick: false,
		sickCounter: 0,
	});

	// Mettre à jour une stat spécifique avec limites
	const updateStat = (
		statName: keyof Omit<TamagotchiStats, "age">,
		change: number,
	) => {
		setStats((prevStats) => ({
			...prevStats,
			[statName]: Math.max(
				MIN_STAT_VALUE,
				Math.min(prevStats[statName] + change, MAX_STAT_VALUE),
			),
		}));
	};

	// Décrémenter les stats avec le temps
	useEffect(() => {
		const interval = setInterval(() => {
			setStats((prevStats) => ({
				happiness: Math.max(
					prevStats.happiness - STAT_DECREASE_AMOUNT,
					MIN_STAT_VALUE,
				),
				hunger: Math.max(
					prevStats.hunger - STAT_DECREASE_AMOUNT,
					MIN_STAT_VALUE,
				),
				cleanliness: Math.max(
					prevStats.cleanliness - STAT_DECREASE_AMOUNT,
					MIN_STAT_VALUE,
				),
				energy: Math.max(
					prevStats.energy - STAT_DECREASE_AMOUNT,
					MIN_STAT_VALUE,
				),
				age: prevStats.age + 1,
			}));
		}, STAT_DECREASE_INTERVAL);

		return () => clearInterval(interval);
	}, []);

	// Gérer la maladie
	useEffect(() => {
		const { hunger, energy, cleanliness } = stats;

		if (
			hunger <= CRITICAL_LEVELS.HUNGER ||
			energy <= CRITICAL_LEVELS.ENERGY ||
			cleanliness <= CRITICAL_LEVELS.CLEANLINESS
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

		// Tomber malade
		if (
			healthState.sickCounter >= CRITICAL_LEVELS.SICK_THRESHOLD &&
			!healthState.isSick
		) {
			setHealthState((prev) => ({
				...prev,
				isSick: true,
			}));
			showStatWarning("Ton Tama est tombé malade !");
		}

		// Guérison
		if (
			healthState.isSick &&
			hunger > CRITICAL_LEVELS.RECOVERY_THRESHOLD &&
			energy > CRITICAL_LEVELS.RECOVERY_THRESHOLD &&
			cleanliness > CRITICAL_LEVELS.RECOVERY_THRESHOLD
		) {
			setHealthState({
				isSick: false,
				sickCounter: 0,
			});
			Toast.show({
				type: "success",
				text1: "Bonne nouvelle !",
				text2: "Ton Tama est guéri 🎉",
				position: "bottom",
			});
		}
	}, [stats, healthState.sickCounter, healthState.isSick]);

	// Alertes pour les stats critiques
	useEffect(() => {
		const { hunger, energy, cleanliness } = stats;

		if (hunger <= CRITICAL_LEVELS.HUNGER) {
			showStatWarning("Ton Tama est affamé !");
		}
		if (energy <= CRITICAL_LEVELS.ENERGY) {
			showStatWarning("Ton Tama est épuisé !");
		}
		if (cleanliness <= CRITICAL_LEVELS.CLEANLINESS) {
			showStatWarning("Ton Tama est cracra !");
		}
	}, [stats]); // Utilisation de stats comme dépendance complète

	const showStatWarning = (message: string) => {
		Toast.show({
			type: "error",
			text1: "Alerte !",
			text2: message,
			position: "bottom",
		});

		Notifications.scheduleNotificationAsync({
			content: {
				title: "Tamagotchi en détresse !",
				body: message,
			},
			trigger: null,
		});
	};

	// Actions sur le Tamagotchi
	const actions = {
		feed: () => {
			// Si Tama est malade, on lui donne moins de nourriture
			updateStat("hunger", healthState.isSick ? 5 : 10);

			// Effet de la faim excessive sur le bonheur
			if (stats.hunger > 90) {
				updateStat("happiness", -5);
			}
		},

		play: () => {
			// Si la faim ou l'énergie sont trop faibles, Tama ne peut pas jouer
			if (stats.hunger < 20 && stats.energy < 20) {
				updateStat("happiness", -5);
				Toast.show({
					type: "error",
					text1: "Pas maintenant...",
					text2: "Tama est trop fatigué et affamé pour jouer.",
					position: "bottom",
				});
			} else {
				// Normalement, jouer augmente le bonheur
				updateStat("happiness", healthState.isSick ? 5 : 10);
			}

			// Effet de la propreté sur le jeu
			if (stats.cleanliness < 20) {
				updateStat("happiness", -5);
			}
		},

		clean: () => {
			// Si Tama est malade, on nettoie moins bien
			updateStat("cleanliness", healthState.isSick ? 5 : 10);

			// Quand Tama est vraiment sale, tout devient moins efficace
			if (stats.cleanliness < 10) {
				Toast.show({
					type: "error",
					text1: "Trop sale...",
					text2:
						"Tama refuse de faire quoi que ce soit tant qu'il n'est pas propre !",
					position: "bottom",
				});
			}
		},

		rest: () => {
			// Si Tama est sale, il dort moins bien
			if (stats.cleanliness < 20) {
				updateStat("energy", 10);
				Toast.show({
					type: "error",
					text1: "Beurk...",
					text2: "C'est dégoûtant ici, Tama n'arrive pas à bien dormir.",
					position: "bottom",
				});
			} else {
				// Si Tama est propre, il récupère bien son énergie
				updateStat("energy", healthState.isSick ? 10 : 20);
			}
		},
	};

	// Fonction utilitaire pour les couleurs des jauges
	const getStatColor = (value: number): string => {
		if (value <= 20) return "#f0f0f0";
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
