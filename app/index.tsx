import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import * as Font from "expo-font";
import Toast from "react-native-toast-message";
import * as Progress from "react-native-progress"; // Importation du composant Progress

import FeedTama from "./components/FeedTama";
import PlayWithTama from "./components/PlayWithTama";
import CleanTama from "./components/CleanTama";
import RestTama from "./components/RestTama";
import StatAlert from "./components/StatAlert";
import PetAnimation from "./components/PetAnimation";

// Config des notifications (obligatoire pour Android)
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export default function IndexScreen() {
	const [happiness, setHappiness] = useState(50);
	const [hunger, setHunger] = useState(50);
	const [cleanliness, setCleanliness] = useState(50);
	const [energy, setEnergy] = useState(50);
	const [age, setAge] = useState(0);
	const [fontsLoaded, setFontsLoaded] = useState(false);

	// Utilisation de useCallback pour mémoriser la fonction loadFonts
	const loadFonts = useCallback(async () => {
		try {
			await Font.loadAsync({
				TitleFont: require("../assets/fonts/Pacifico-Regular.ttf"),
				TextFont: require("../assets/fonts/Itim-Regular.ttf"),
			});
			setFontsLoaded(true);
		} catch (error) {
			console.error("Erreur de chargement des polices : ", error);
		}
	}, []); // Pas de dépendance car cette fonction ne dépend de rien d'autre

	// Chargement des polices et gestion de l'état des notifications
	useEffect(() => {
		loadFonts();
		const requestPermissions = async () => {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== "granted") {
				alert("Permission pour les notifications refusée !");
			}
		};
		requestPermissions();

		// Intervalle de mise à jour des stats du Tamagotchi
		const interval = setInterval(() => {
			setHunger((prev) => Math.min(prev + 5, 100));
			setCleanliness((prev) => Math.max(prev - 5, 0));
			setEnergy((prev) => Math.max(prev - 5, 0));
			setAge((prev) => prev + 1);
		}, 100000);

		return () => clearInterval(interval);
	}, [loadFonts]); // Ce useEffect est exécuté une seule fois (chargement initial)

	// Gestion des alertes Toast et Notifications quand une stat devient critique
	useEffect(() => {
		if (hunger <= 10) {
			showStatWarning("Ton Tama est affamé !");
		}
		if (energy <= 10) {
			showStatWarning("Ton Tama est épuisé !");
		}
		if (cleanliness <= 10) {
			showStatWarning("Ton Tama est cracra !");
		}
	}, [hunger, energy, cleanliness]);

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

	const feed = () => setHunger((prev) => Math.min(prev + 10, 100));
	const play = () => setHappiness((prev) => Math.min(prev + 10, 100));
	const clean = () => setCleanliness((prev) => Math.min(prev + 10, 100));
	const rest = () => setEnergy((prev) => Math.min(prev + 20, 100));
	const getStatColor = (value: number) => {
		if (value <= 20) return "#f0f0f0";
		if (value <= 80) return "#e6aeae";
		return "#e88484";
	};

	// Si les polices ne sont pas chargées, n'affiche pas le contenu de la page
	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.textTitle}>Tama-chan</Text>
			<Text style={styles.textText}>Âge: {age}</Text>

			{/* Affichage des jauges pour chaque stat */}
			<View style={styles.statsContainer}>
				<View style={styles.statsRow}>
					<View style={styles.statColumn}>
						<Text style={styles.statLabel}>Humeur</Text>
						<Progress.Bar
							progress={happiness / 100}
							width={100}
							height={15}
							color={getStatColor(happiness)} // Couleur dynamique
							unfilledColor="#bde2f0"
							borderRadius={8}
						/>
					</View>
					<View style={styles.statColumn}>
						<Text style={styles.statLabel}>Satiété</Text>
						<Progress.Bar
							progress={hunger / 100}
							width={100}
							height={15}
							color={getStatColor(hunger)} // Couleur dynamique
							unfilledColor="#bde2f0"
							borderRadius={8}
						/>
					</View>
				</View>

				<View style={styles.statsRow}>
					<View style={styles.statColumn}>
						<Text style={styles.statLabel}>Propreté</Text>
						<Progress.Bar
							progress={cleanliness / 100}
							width={100}
							height={15}
							color={getStatColor(cleanliness)} // Couleur dynamique
							unfilledColor="#bde2f0"
							borderRadius={8}
						/>
					</View>
					<View style={styles.statColumn}>
						<Text style={styles.statLabel}>Énergie</Text>
						<Progress.Bar
							progress={energy / 100}
							width={100}
							height={15}
							color={getStatColor(energy)} // Couleur dynamique
							unfilledColor="#bde2f0"
							borderRadius={8}
						/>
					</View>
				</View>
			</View>

			{/* Affichage de l'animation du Tama */}
			<PetAnimation />

			{/* Alertes si stats critiques (Toast + Notification) */}
			<StatAlert hunger={hunger} energy={energy} cleanliness={cleanliness} />

			<View style={styles.iconContainer}>
				<PlayWithTama onPlay={play} />
				<FeedTama onFeed={feed} />
				<CleanTama onClean={clean} />
				<RestTama onRest={rest} />
			</View>

			{/* Afficheur global pour les toasts */}
			<Toast />
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
	statsContainer: {
		width: "80%",
		marginVertical: 20,
		alignItems: "center",
	},
	statsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
		marginBottom: 20, // Espacement entre les lignes
	},
	statColumn: {
		alignItems: "center",
		width: "45%", // Chaque colonne occupe environ la moitié de l'écran
	},
	statLabel: {
		fontFamily: "TextFont",
		fontSize: 16,
		color: "#a94b4b",
		marginBottom: 5,
	},
	iconContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
	},
});
