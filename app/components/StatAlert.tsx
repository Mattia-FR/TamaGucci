import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useSnackbar } from "../utils/SnackbarContext"; // <-- adapte le chemin selon ton arborescence

interface StatAlertProps {
	hunger: number;
	energy: number;
	cleanliness: number;
	happiness: number;
}

export default function StatAlert({
	hunger,
	energy,
	cleanliness,
	happiness,
}: StatAlertProps) {
	const { showSnackbar } = useSnackbar(); // <-- hook perso pour afficher le snackbar

	const hasAlerted = useRef({
		hunger: false,
		energy: false,
		cleanliness: false,
		happiness: false,
	});

	useEffect(() => {
		// === HUNGER ===
		if (hunger < 10 && !hasAlerted.current.hunger) {
			showSnackbar("Ton Tama a très faim !");
			Notifications.scheduleNotificationAsync({
				content: {
					title: "Ton Tama a faim !",
					body: "Pense à le nourrir vite 🍽️",
				},
				trigger: null,
			});
			hasAlerted.current.hunger = true;
		} else if (hunger < 20 && !hasAlerted.current.hunger) {
			showSnackbar("Ton Tama commence à avoir faim...");
			hasAlerted.current.hunger = true;
		} else if (hunger >= 20) {
			hasAlerted.current.hunger = false;
		}

		// === ENERGY ===
		if (energy < 10 && !hasAlerted.current.energy) {
			showSnackbar("Ton Tama est épuisé !");
			Notifications.scheduleNotificationAsync({
				content: {
					title: "Ton Tama est fatigué 😴",
					body: "Il a besoin de repos !",
				},
				trigger: null,
			});
			hasAlerted.current.energy = true;
		} else if (energy < 20 && !hasAlerted.current.energy) {
			showSnackbar("Ton Tama commence à fatiguer...");
			hasAlerted.current.energy = true;
		} else if (energy >= 20) {
			hasAlerted.current.energy = false;
		}

		// === CLEANLINESS ===
		if (cleanliness < 10 && !hasAlerted.current.cleanliness) {
			showSnackbar("Ton Tama est crado !");
			Notifications.scheduleNotificationAsync({
				content: {
					title: "Ton Tama est sale ! 🧼",
					body: "Il faut le nettoyer rapidement !",
				},
				trigger: null,
			});
			hasAlerted.current.cleanliness = true;
		} else if (cleanliness < 20 && !hasAlerted.current.cleanliness) {
			showSnackbar("Ton Tama commence à se salir...");
			hasAlerted.current.cleanliness = true;
		} else if (cleanliness >= 20) {
			hasAlerted.current.cleanliness = false;
		}

		// === HAPPINESS ===
		if (happiness < 10 && !hasAlerted.current.happiness) {
			showSnackbar("Ton Tama est déprimé 😢");
			Notifications.scheduleNotificationAsync({
				content: {
					title: "Ton Tama est triste 😢",
					body: "Joue avec lui pour le rendre heureux !",
				},
				trigger: null,
			});
			hasAlerted.current.happiness = true;
		} else if (happiness < 20 && !hasAlerted.current.happiness) {
			showSnackbar("Ton Tama n'est pas très joyeux...");
			hasAlerted.current.happiness = true;
		} else if (happiness >= 20) {
			hasAlerted.current.happiness = false;
		}
	}, [hunger, energy, cleanliness, happiness, showSnackbar]);

	return null;
}
