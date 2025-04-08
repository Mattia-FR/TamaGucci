import React from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

export default function PetAnimation() {
	return (
		<View style={styles.container}>
			<LottieView
				source={require("../../assets/animations/Pet01.json")} // Vérifie le chemin
				autoPlay
				loop
				style={styles.animation} // Donne un style plus large pour être visible
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%", // Utilise 100% de la largeur de l'écran
		height: 300, // Assure-toi que la hauteur est suffisante
		alignItems: "center",
		justifyContent: "center",
	},
	animation: {
		width: 200, // Ajuste la taille de l'animation
		height: 200,
	},
});
