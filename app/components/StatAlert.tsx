import { useEffect, useRef } from "react";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

interface StatAlertProps {
	hunger: number;
	energy: number;
	cleanliness: number;
}

export default function StatAlert({
	hunger,
	energy,
	cleanliness,
}: StatAlertProps) {
	const hasAlerted = useRef({
		hunger: false,
		energy: false,
		cleanliness: false,
	});

	useEffect(() => {
		if (hunger < 20 && !hasAlerted.current.hunger) {
			Toast.show({
				type: "error",
				text1: "Alerte Faim",
				text2: "Ton Tama a très faim !",
			});
			Notifications.scheduleNotificationAsync({
				content: {
					title: "Ton Tama a faim !",
					body: "Pense à le nourrir vite 🍽️",
				},
				trigger: null,
			});
			hasAlerted.current.hunger = true;
		} else if (hunger <= 80) {
			hasAlerted.current.hunger = false;
		}

		if (energy < 20 && !hasAlerted.current.energy) {
			Toast.show({
				type: "error",
				text1: "Alerte Énergie",
				text2: "Ton Tama est épuisé !",
			});
			Notifications.scheduleNotificationAsync({
				content: {
					title: "Ton Tama est fatigué 😴",
					body: "Il a besoin de repos !",
				},
				trigger: null,
			});
			hasAlerted.current.energy = true;
		} else if (energy >= 20) {
			hasAlerted.current.energy = false;
		}

		if (cleanliness < 20 && !hasAlerted.current.cleanliness) {
			Toast.show({
				type: "error",
				text1: "Alerte Propreté",
				text2: "Ton Tama est crado !",
			});
			Notifications.scheduleNotificationAsync({
				content: {
					title: "Ton Tama est sale ! 🧼",
					body: "Il faut le nettoyer rapidement !",
				},
				trigger: null,
			});
			hasAlerted.current.cleanliness = true;
		} else if (cleanliness >= 20) {
			hasAlerted.current.cleanliness = false;
		}
	}, [hunger, energy, cleanliness]);

	return null; // On n'affiche plus de texte direct ici
}
