import ActionButton from "./ActionButton";

interface PlayWithTamaProps {
	onPlay: () => void;
}

export default function PlayWithTama({ onPlay }: PlayWithTamaProps) {
	return (
		<ActionButton
			onPress={onPlay}
			iconFamily="FontAwesome"
			iconName="gamepad"
			padding={0}
		/>
	);
}
