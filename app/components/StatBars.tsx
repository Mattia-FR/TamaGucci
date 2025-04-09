import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

interface StatBarsProps {
	happiness: number;
	hunger: number;
	cleanliness: number;
	energy: number;
	getStatColor: (value: number) => string;
}

export default function StatBars({
	happiness,
	hunger,
	cleanliness,
	energy,
	getStatColor,
}: StatBarsProps) {
	return (
		<View style={styles.statsContainer}>
			<View style={styles.statsRow}>
				<StatBar
					label="Humeur"
					value={happiness}
					color={getStatColor(happiness)}
				/>
				<StatBar label="Satiété" value={hunger} color={getStatColor(hunger)} />
			</View>
			<View style={styles.statsRow}>
				<StatBar
					label="Propreté"
					value={cleanliness}
					color={getStatColor(cleanliness)}
				/>
				<StatBar label="Énergie" value={energy} color={getStatColor(energy)} />
			</View>
		</View>
	);
}

interface StatBarProps {
	label: string;
	value: number;
	color: string;
}

function StatBar({ label, value, color }: StatBarProps) {
	return (
		<View style={styles.statColumn}>
			<Text style={styles.statLabel}>{label}</Text>
			<Progress.Bar
				progress={value / 100}
				width={100}
				height={15}
				color={color}
				unfilledColor="#f0f0f0"
				borderRadius={8}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	statsContainer: {
		width: "80%",
		paddingBottom: 10,
		alignItems: "center",
		borderWidth: 2, // Taille de la bordure
		borderColor: "#a94b4b", // Couleur de la bordure
		borderRadius: 15, // Rayon de la bordure pour les coins arrondis
		backgroundColor: "#f0f0f0",
		elevation: 10,
	},
	statsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
		marginBottom: 10,
		paddingTop: 10,
	},
	statColumn: {
		alignItems: "center",
		width: "45%",
	},
	statLabel: {
		fontFamily: "TextFont",
		fontSize: 16,
		color: "#a94b4b",
		marginBottom: 5,
	},
});
