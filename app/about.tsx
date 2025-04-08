// about.tsx
import { View, Text } from "react-native";

export default function AboutScreen() {
	return (
		<View>
			<Text>Renseignements sur le jeu :</Text>
			<Text>
				Le Tamagotchi est un animal virtuel qui nécessite des soins. Vous devez
				le nourrir, jouer avec lui, et le nettoyer régulièrement.
			</Text>
			<Text>Actions disponibles : nourrir, jouer, nettoyer, etc.</Text>
		</View>
	);
}
