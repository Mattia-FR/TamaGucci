import ActionButton from "./ActionButton";

interface CleanTamaProps {
	onClean: () => void;
}

export default function CleanTama({ onClean }: CleanTamaProps) {
	return (
		<ActionButton
			onPress={onClean}
			iconFamily="MaterialIcons"
			iconName="clean-hands"
		/>
	);
}
