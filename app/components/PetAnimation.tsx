import React from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet, type ViewStyle } from "react-native";

interface PetAnimationProps {
	isSick?: boolean;
	style?: ViewStyle;
}

export default function PetAnimation({
	isSick = false,
	style,
}: PetAnimationProps) {
	return (
		<View style={style}>
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
	animation: {
		width: 200,
		height: 200,
	},
});
