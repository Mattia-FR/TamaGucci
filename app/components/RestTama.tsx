import ActionButton from "./ActionButton";

interface RestTamaProps {
	onRest: () => void;
}

export default function RestTama({ onRest }: RestTamaProps) {
	return (
		<ActionButton onPress={onRest} iconFamily="FontAwesome" iconName="bed" />
	);
}
