import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSnackbar } from "../utils/contexts/SnackbarContext";

interface StatAlertProps {
	hunger: number;
	energy: number;
	cleanliness: number;
	happiness: number;
}

// Cooldown unique pour toutes les notifications
const NOTIFICATION_COOLDOWN = 2 * 60 * 60 * 1000; // 2 heures

// Type pour les statuts
type StatType = "hunger" | "energy" | "cleanliness" | "happiness";

export default function StatAlert({
	hunger,
	energy,
	cleanliness,
	happiness,
}: StatAlertProps) {
	const { showSnackbar } = useSnackbar();

	// Référence pour suivre si une vérification est déjà en cours
	const isCheckingRef = useRef(false);

	// Référence pour suivre le dernier rendu des valeurs
	const lastValuesRef = useRef({ hunger, energy, cleanliness, happiness });

	useEffect(() => {
		// Vérifier si les valeurs ont vraiment changé pour éviter les rendus inutiles
		const valuesChanged =
			lastValuesRef.current.hunger !== hunger ||
			lastValuesRef.current.energy !== energy ||
			lastValuesRef.current.cleanliness !== cleanliness ||
			lastValuesRef.current.happiness !== happiness;

		// Mettre à jour la référence
		lastValuesRef.current = { hunger, energy, cleanliness, happiness };

		// Si les valeurs n'ont pas changé, ne rien faire
		if (!valuesChanged) return;

		const checkStats = async () => {
			// Si une vérification est déjà en cours, ne pas en commencer une autre
			if (isCheckingRef.current) return;

			isCheckingRef.current = true;

			try {
				// Pour chaque stat, vérifier si elle est basse et si on peut envoyer une notification
				await checkStat(
					"hunger",
					hunger,
					"🍽️ Ton Tama a faim !",
					"Pense à le nourrir vite !",
					"Ton Tama a très faim !",
				);

				await checkStat(
					"energy",
					energy,
					"😴 Ton Tama est fatigué",
					"Il a besoin de dormir !",
					"Ton Tama est épuisé !",
				);

				await checkStat(
					"cleanliness",
					cleanliness,
					"🧼 Ton Tama est sale !",
					"Un bon bain s'impose !",
					"Ton Tama est crado !",
				);

				await checkStat(
					"happiness",
					happiness,
					"😢 Ton Tama est triste",
					"Joue avec lui pour le rendre heureux !",
					"Ton Tama est déprimé 😢",
				);
			} finally {
				isCheckingRef.current = false;
			}
		};

		const checkStat = async (
			type: StatType,
			value: number,
			notifTitle: string,
			notifBody: string,
			snackbarMsg: string,
		) => {
			// Si la valeur est basse
			if (value < 10) {
				// Vérifier si on peut envoyer une notification
				const canSend = await canSendNotification(type);

				if (canSend) {
					// Afficher le snackbar
					showSnackbar(snackbarMsg);

					// Envoyer la notification
					await sendNotification(type, notifTitle, notifBody);
				}
			}
			// Si la valeur est remontée suffisamment, réinitialiser le cooldown
			else if (value >= 20) {
				await AsyncStorage.removeItem(`lastNotificationTime_${type}`);
			}
		};

		const canSendNotification = async (type: StatType): Promise<boolean> => {
			try {
				const lastTimeStr = await AsyncStorage.getItem(
					`lastNotificationTime_${type}`,
				);
				if (!lastTimeStr) return true;

				const lastTime = Number(lastTimeStr);
				const now = Date.now();

				// Vérifier si le cooldown est passé
				return now - lastTime > NOTIFICATION_COOLDOWN;
			} catch (error) {
				console.error("Error checking notification status:", error);
				return false;
			}
		};

		const sendNotification = async (
			type: StatType,
			title: string,
			body: string,
		): Promise<void> => {
			try {
				// Générer un identifiant unique pour cette notification
				const identifier = `tama_${type}_alert`;

				// Annuler toute notification existante avec cet identifiant
				await Notifications.cancelScheduledNotificationAsync(identifier);

				// Programmer la notification pour qu'elle soit envoyée immédiatement
				await Notifications.scheduleNotificationAsync({
					content: {
						title,
						body,
					},
					trigger: null, // null = envoyer immédiatement
					identifier, // identifiant unique pour cette notification
				});

				// Enregistrer le timestamp
				await AsyncStorage.setItem(
					`lastNotificationTime_${type}`,
					String(Date.now()),
				);

				console.log(
					`Notification ${type} envoyée à ${new Date().toLocaleTimeString()}`,
				);
			} catch (error) {
				console.error("Error sending notification:", error);
			}
		};

		checkStats();
	}, [hunger, energy, cleanliness, happiness, showSnackbar]);

	return null;
}
