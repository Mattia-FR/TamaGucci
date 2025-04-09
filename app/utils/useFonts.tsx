// hooks/useFonts.ts
import { useState, useCallback, useEffect } from "react";
import * as Font from "expo-font";

export default function useFonts() {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	const loadFonts = useCallback(async () => {
		try {
			await Font.loadAsync({
				TitleFont: require("../../assets/fonts/Pacifico-Regular.ttf"),
				TextFont: require("../../assets/fonts/Itim-Regular.ttf"),
			});
			setFontsLoaded(true);
		} catch (error) {
			console.error("Erreur de chargement des polices : ", error);
		}
	}, []);

	useEffect(() => {
		loadFonts();
	}, [loadFonts]);

	return { fontsLoaded };
}
