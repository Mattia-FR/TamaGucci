// components/ActionButton.tsx
import { TouchableOpacity, StyleSheet } from "react-native";
import {
	MaterialIcons,
	MaterialCommunityIcons,
	FontAwesome,
} from "@expo/vector-icons";

// Typage en tous genres...
type MaterialIconsNames = keyof typeof MaterialIcons.glyphMap;
type MaterialCommunityIconsNames = keyof typeof MaterialCommunityIcons.glyphMap;
type FontAwesomeIconsNames = keyof typeof FontAwesome.glyphMap;

type IconFamily = "MaterialIcons" | "MaterialCommunityIcons" | "FontAwesome";

type IconNameType<T extends IconFamily> = T extends "MaterialIcons"
	? MaterialIconsNames
	: T extends "MaterialCommunityIcons"
		? MaterialCommunityIconsNames
		: T extends "FontAwesome"
			? FontAwesomeIconsNames
			: never;

interface ActionButtonProps<T extends IconFamily> {
	onPress: () => void;
	iconFamily: T;
	iconName: IconNameType<T>;
	size?: number;
	color?: string;
	padding?: number;
}

// La fonction, avec les styles en commun...
export default function ActionButton<T extends IconFamily>({
	onPress,
	iconFamily,
	iconName,
	size = 32,
	color = "#2e3a59",
	padding = 10,
}: ActionButtonProps<T>) {
	const renderIcon = () => {
		switch (iconFamily) {
			case "MaterialIcons":
				return (
					<MaterialIcons
						name={iconName as MaterialIconsNames}
						size={size}
						color={color}
					/>
				);
			case "MaterialCommunityIcons":
				return (
					<MaterialCommunityIcons
						name={iconName as MaterialCommunityIconsNames}
						size={size}
						color={color}
					/>
				);
			case "FontAwesome":
				return (
					<FontAwesome
						name={iconName as FontAwesomeIconsNames}
						size={size}
						color={color}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.iconButton, { padding }]}
		>
			{renderIcon()}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	iconButton: {
		margin: 5,
		borderWidth: 2,
		borderColor: "#2e3a59",
		borderRadius: 15,
		backgroundColor: "#f0f0f0",
		minWidth: 65,
		minHeight: 65,
		alignItems: "center",
		justifyContent: "center",
		elevation: 10,
	},
});
