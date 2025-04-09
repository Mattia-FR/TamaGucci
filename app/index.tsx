// IndexScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import FeedTama from "./components/FeedTama";
import PlayWithTama from "./components/PlayWithTama";
import CleanTama from "./components/CleanTama";
import RestTama from "./components/RestTama";
import StatAlert from "./components/StatAlert";
import PetAnimation from "./components/PetAnimation";
import StatBars from "./components/StatBars";
import { toastConfig } from "./utils/toastConfig";

import useTamagotchiState from "./utils/useTamaState";
import useFonts from "./utils/useFonts";
import useNotifications from "./utils/useNotifications";

export default function IndexScreen() {
	// Initialiser les notifications
	useNotifications();

	// Charger les polices
	const { fontsLoaded } = useFonts();

	// Gérer l'état du Tamagotchi
	const { stats, healthState, actions, getStatColor } = useTamagotchiState();

	// Si les polices ne sont pas chargées, affiche un écran de chargement
	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.textTitle}>Tama-chan</Text>
			<Text style={styles.textText}>Âge: {stats.age}</Text>

			{/* Affichage des jauges pour chaque stat */}
			<StatBars
				happiness={stats.happiness}
				hunger={stats.hunger}
				cleanliness={stats.cleanliness}
				energy={stats.energy}
				getStatColor={getStatColor}
			/>

			{/* Affichage de l'animation du Tama */}
			<PetAnimation isSick={healthState.isSick} />

			{/* Alertes si stats critiques (Toast + Notification) */}
			<StatAlert
				hunger={stats.hunger}
				energy={stats.energy}
				cleanliness={stats.cleanliness}
			/>

			<View style={styles.iconContainer}>
				<PlayWithTama onPlay={actions.play} />
				<FeedTama onFeed={actions.feed} />
				<CleanTama onClean={actions.clean} />
				<RestTama onRest={actions.rest} />
			</View>

			{/* Afficheur global pour les toasts */}
			<Toast config={toastConfig} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#bde2f0",
	},
	textTitle: {
		fontFamily: "TitleFont",
		fontSize: 42,
		color: "#2e3a59",
	},
	textText: {
		fontFamily: "TextFont",
		fontSize: 20,
		color: "#2e3a59",
	},
	iconContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
	},
});
