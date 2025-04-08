import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function Layout() {
	return (
		<>
			<Stack>
				<Stack.Screen name="index" options={{ title: "TamaGucci" }} />
				<Stack.Screen name="about" options={{ title: "À propos" }} />
			</Stack>
			<Toast />
		</>
	);
}
