import {
	createContext,
	useContext,
	useState,
	type ReactNode,
	useCallback,
} from "react";
import { Snackbar, Text, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

type SnackbarContextType = {
	showSnackbar: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
	showSnackbar: () => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
	const [visible, setVisible] = useState(false);
	const [message, setMessage] = useState("");
	const theme = useTheme();

	const showSnackbar = useCallback((msg: string) => {
		setMessage(msg);
		setVisible(true);
	}, []);

	const hideSnackbar = () => {
		setVisible(false);
	};

	return (
		<SnackbarContext.Provider value={{ showSnackbar }}>
			{children}
			<Snackbar
				visible={visible}
				onDismiss={hideSnackbar}
				duration={3000}
				action={{
					label: "Fermer",
					onPress: hideSnackbar,
					labelStyle: styles.actionLabel,
				}}
				style={styles.container}
				theme={{
					colors: {
						accent: theme.colors.surface, // Couleur du bouton
						surface: "#2e3a59", // Couleur de fond
					},
				}}
			>
				<Text style={styles.message}>{message}</Text>
			</Snackbar>
		</SnackbarContext.Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#2e3a59",
		borderRadius: 15,
		marginBottom: 20,
		padding: 10,
		elevation: 15,
	},
	message: {
		color: "#fff",
		fontSize: 14,
		fontFamily: "TitleFont",
	},
	actionLabel: {
		color: "#fff",
		fontSize: 14,
		fontFamily: "TextFont",
	},
});

export default SnackbarProvider;
