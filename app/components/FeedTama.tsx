import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Importer le LinearGradient

interface FeedTamaProps {
	onFeed: () => void;
}

export default function FeedTama({ onFeed }: FeedTamaProps) {
	return (
		<TouchableOpacity onPress={onFeed} style={styles.iconButton}>
			<MaterialCommunityIcons
				name="food-fork-drink"
				size={32}
				color="#2e3a59"
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	iconButton: {
		margin: 5,
		padding: 3,
		borderWidth: 2,
		borderColor: "#2e3a59",
		borderRadius: 15,
		backgroundColor: "#f0f0f0",
		minWidth: 65,
		minHeight: 65,
		alignItems: "center",
		justifyContent: "center",
		elevation: 10, // Ombre externe pour Android
	},
});
