import { View, Text, type ViewStyle, type TextStyle } from "react-native";

type ToastProps = {
	text1?: string;
	text2?: string;
};

const toastConfig = {
	error: ({ text1, text2 }: ToastProps) => {
		// Styles
		const containerStyle: ViewStyle = {
			backgroundColor: "#e88484", // Rouge clair
			padding: 16,
			borderRadius: 10,
			borderLeftWidth: 6,
			borderLeftColor: "#a94b4b", // Rouge bordeaux
			width: "90%",
			flexDirection: "row",
			alignItems: "center",
		};

		const text1Style: TextStyle = {
			fontFamily: "TextFont",
			color: "#2e3a59", // Bleu foncé
			fontSize: 16,
			fontWeight: "bold",
		};

		const text2Style: TextStyle = {
			fontFamily: "TextFont",
			color: "#2e3a59",
			fontSize: 14,
			marginLeft: 8,
		};

		// Rendu
		return (
			<View style={containerStyle}>
				{text1 && <Text style={text1Style}>{text1}</Text>}
				{text2 && <Text style={text2Style}>{text2}</Text>}
			</View>
		);
	},
};

export default toastConfig; // Ajout de l'exportation par défaut
