import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SnackbarProvider } from "./utils/SnackbarContext";

export default function Layout() {
	return (
		<>
			<PaperProvider>
				<SnackbarProvider>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="index" />
						<Stack.Screen name="about" />
					</Stack>
				</SnackbarProvider>
			</PaperProvider>
		</>
	);
}
