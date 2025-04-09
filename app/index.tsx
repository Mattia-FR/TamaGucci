import { View, Text, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

import FeedTama from "./components/FeedTama";
import PlayWithTama from "./components/PlayWithTama";
import CleanTama from "./components/CleanTama";
import RestTama from "./components/RestTama";
import StatAlert from "./components/StatAlert";
import PetAnimation from "./components/PetAnimation";
import StatBars from "./components/StatBars";

import useTamaState from "./utils/useTamaState";
import useFonts from "./utils/useFonts";
import useNotifications from "./utils/useNotifications";
import useTamaAge from "./utils/useTamaAge";

import { useState } from "react";
import { Button } from "react-native";

export default function IndexScreen() {
	// Initialiser les notifications
	useNotifications();

	// Charger les polices
	const { fontsLoaded } = useFonts();

	// Gérer l'âge de Tama
	const age = useTamaAge();

	// Gérer l'état du Tama
	const { stats, healthState, actions, getStatColor } = useTamaState();

	const [visible, setVisible] = useState(false);
	const showSnackbar = () => setVisible(true);
	const hideSnackbar = () => setVisible(false);

	// Si les polices ne sont pas chargées, affiche un écran de chargement
	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<View style={styles.container}>
			<View style={styles.nameAge}>
				<Text style={styles.textTitle}>Tama-chan</Text>
				<Text style={styles.textText}>Âge: {age}</Text>
			</View>

			<StatBars
				happiness={stats.happiness}
				hunger={stats.hunger}
				cleanliness={stats.cleanliness}
				energy={stats.energy}
				getStatColor={getStatColor}
			/>

			<StatAlert
				hunger={stats.hunger}
				energy={stats.energy}
				cleanliness={stats.cleanliness}
				happiness={stats.happiness}
			/>

			<View style={styles.iconContainer}>
				<PlayWithTama onPlay={actions.play} />
				<FeedTama onFeed={actions.feed} />
				<CleanTama onClean={actions.clean} />
				<RestTama onRest={actions.rest} />
			</View>

			<PetAnimation isSick={healthState.isSick} style={styles.petAnim} />

			<Button title="Show Snackbar" onPress={showSnackbar} />
			<Snackbar
				visible={visible}
				onDismiss={hideSnackbar}
				action={{
					label: "Fermer",
					onPress: hideSnackbar,
				}}
			>
				C'est un message Snackbar !
			</Snackbar>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#bde2f0",
	},
	nameAge: {
		width: "80%",
		marginVertical: 20,
		paddingBottom: 10,
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#2e3a59",
		borderRadius: 15,
		backgroundColor: "#bde2f0",
		elevation: 10,
	},
	textTitle: {
		fontFamily: "TitleFont",
		fontSize: 32,
		color: "#2e3a59",
	},
	textText: {
		fontFamily: "TextFont",
		fontSize: 20,
		color: "#2e3a59",
	},
	iconContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "80%",
		marginTop: 20,
	},
	petAnim: {
		margin: 20,
	},
});
