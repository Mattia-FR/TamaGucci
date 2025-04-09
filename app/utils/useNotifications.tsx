import { useEffect } from "react";
import * as Notifications from "expo-notifications";

export default function useNotifications() {
	useEffect(() => {
		// Config des notifications (obligatoire pour Android)
		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: false,
			}),
		});

		const requestPermissions = async () => {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== "granted") {
				alert("Permission pour les notifications refusée !");
			}
		};

		requestPermissions();
	}, []);
}
