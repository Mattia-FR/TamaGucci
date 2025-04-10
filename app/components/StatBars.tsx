import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import * as Progress from "react-native-progress";
import { useState } from "react";

interface StatData {
	label: string;
	value: number;
	key: string;
}

interface StatBarsProps {
	happiness: number;
	hunger: number;
	cleanliness: number;
	energy: number;
	getStatColor: (value: number) => string;
}

interface StatBarProps {
	label: string;
	value: number;
	color: string;
}

interface StatsRowProps {
	stats: StatData[];
	getStatColor: (value: number) => string;
}

interface StatDetailsModalProps {
	visible: boolean;
	stats: StatData[];
	onClose: () => void;
}

export default function StatBars({
	happiness,
	hunger,
	cleanliness,
	energy,
	getStatColor,
}: StatBarsProps) {
	const [modalVisible, setModalVisible] = useState(false);

	// Regrouper les statistiques en tableau pour faciliter l'itération
	const stats: StatData[] = [
		{ label: "Humeur", value: happiness, key: "happiness" },
		{ label: "Satiété", value: hunger, key: "hunger" },
		{ label: "Propreté", value: cleanliness, key: "cleanliness" },
		{ label: "Énergie", value: energy, key: "energy" },
	];

	// Séparer les statistiques en deux rangées
	const firstRowStats = stats.slice(0, 2);
	const secondRowStats = stats.slice(2, 4);

	return (
		<>
			<TouchableOpacity
				style={styles.statsContainer}
				onPress={() => setModalVisible(true)}
				activeOpacity={0.7}
			>
				{/* Première rangée */}
				<StatsRow stats={firstRowStats} getStatColor={getStatColor} />

				{/* Deuxième rangée */}
				<StatsRow stats={secondRowStats} getStatColor={getStatColor} />
			</TouchableOpacity>

			{/* Modal pour afficher les valeurs détaillées */}
			<StatDetailsModal
				visible={modalVisible}
				stats={stats}
				onClose={() => setModalVisible(false)}
			/>
		</>
	);
}

// Composant pour une rangée de statistiques
function StatsRow({ stats, getStatColor }: StatsRowProps): JSX.Element {
	return (
		<View style={styles.statsRow}>
			{stats.map((stat) => (
				<StatBar
					key={stat.key}
					label={stat.label}
					value={stat.value}
					color={getStatColor(stat.value)}
				/>
			))}
		</View>
	);
}

// Composant pour afficher une barre de statistique
function StatBar({ label, value, color }: StatBarProps): JSX.Element {
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

// Composant Modal détaillé
function StatDetailsModal({
	visible,
	stats,
	onClose,
}: StatDetailsModalProps): JSX.Element {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Statistiques détaillées</Text>

					{stats.map((stat) => (
						<View key={stat.key} style={styles.statDetail}>
							<Text style={styles.statLabel}>{stat.label}:</Text>
							<Text style={styles.statValue}>{stat.value}%</Text>
						</View>
					))}

					<TouchableOpacity style={styles.closeButton} onPress={onClose}>
						<Text style={styles.closeButtonText}>Fermer</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	statsContainer: {
		width: "80%",
		paddingBottom: 10,
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#a94b4b",
		borderRadius: 15,
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
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: "60%",
		backgroundColor: "#f8f8f8",
		padding: 20,
		borderRadius: 15,
		elevation: 5,
		borderWidth: 2,
		borderColor: "#a94b4b",
	},
	modalTitle: {
		fontFamily: "TitleFont",
		fontSize: 22,
		color: "#2e3a59",
		marginBottom: 20,
		textAlign: "center",
	},
	statDetail: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
		paddingHorizontal: 10,
	},
	statValue: {
		fontFamily: "TextFont",
		fontSize: 18,
		color: "#2e3a59",
		fontWeight: "bold",
	},
	closeButton: {
		marginTop: 20,
		padding: 10,
		backgroundColor: "#a94b4b",
		borderRadius: 10,
		alignSelf: "center",
	},
	closeButtonText: {
		fontFamily: "TextFont",
		fontSize: 16,
		color: "white",
	},
});
