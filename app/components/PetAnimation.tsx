import React from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

interface PetAnimationProps {
	isSick?: boolean;
}

export default function PetAnimation({ isSick = false }: PetAnimationProps) {
	return (
		<View style={styles.container}>
			<LottieView
				source={require("../../assets/animations/Pet01.json")}
				autoPlay
				loop
				style={styles.animation}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: 300,
		alignItems: "center",
		justifyContent: "center",
	},
	animation: {
		width: 200,
		height: 200,
	},
});
