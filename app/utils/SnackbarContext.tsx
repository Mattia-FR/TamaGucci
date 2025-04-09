import {
	createContext,
	useContext,
	useState,
	type ReactNode,
	useCallback,
} from "react";
import { Snackbar } from "react-native-paper";

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
				}}
			>
				{message}
			</Snackbar>
		</SnackbarContext.Provider>
	);
};
