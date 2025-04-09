import { useState, useEffect } from "react";

const ageIncreaseInterval = 120000;

export default function useTamaAge() {
	const [age, setAge] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setAge((prevAge) => prevAge + 1);
		}, ageIncreaseInterval);

		return () => clearInterval(interval);
	}, []);

	return age;
}
