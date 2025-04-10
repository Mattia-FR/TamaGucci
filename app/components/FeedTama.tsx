import ActionButton from "./ActionButton";

interface FeedTamaProps {
	onFeed: () => void;
}

export default function FeedTama({ onFeed }: FeedTamaProps) {
	return (
		<ActionButton
			onPress={onFeed}
			iconFamily="MaterialCommunityIcons"
			iconName="food-fork-drink"
			padding={3}
		/>
	);
}
