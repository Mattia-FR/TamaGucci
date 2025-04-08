import { TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface RestTamaProps {
	onRest: () => void;
}

export default function RestTama({ onRest }: RestTamaProps) {
	return (
		<TouchableOpacity onPress={onRest} style={styles.iconButton}>
			<FontAwesome name="bed" size={32} color="#2e3a59" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	iconButton: {
		margin: 5,
		padding: 10,
		borderWidth: 2, // Taille de la bordure
		borderColor: "#2e3a59", // Couleur de la bordure
		borderRadius: 15, // Rayon de la bordure pour les coins arrondis
		backgroundColor: "#f0f0f0",
		minWidth: 65,
		minHeight: 65,
		alignItems: "center", // Centre l'icône verticalement
		justifyContent: "center", // Centre l'icône horizontalement
		elevation: 10, // Crée une ombre
	},
});
