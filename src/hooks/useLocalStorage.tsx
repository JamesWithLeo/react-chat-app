import { useState, useEffect } from "react";

export default function useLocalStorage(key: string, defaultValue: any) {
	const [value, setValue] = useState(() => {
		const storedValue = localStorage.getItem(key);
		return storedValue ? JSON.parse(storedValue) : defaultValue;
	});

	useEffect(() => {
		const listener = (e: StorageEvent) => {
			if (e.storageArea === localStorage && e.key === key && e.newValue) {
				setValue(JSON.parse(e.newValue));
			}
		};
		window.addEventListener("storage", listener);

		return () => {
			window.removeEventListener("storage", listener);
		};
	}, [key, defaultValue]);

	const setValueInLocalStorage = (newValue: any) => {
		setValue((currentValue: any) => {
			const result =
				typeof newValue === "function"
					? newValue(currentValue)
					: newValue;

			localStorage.setItem(key, JSON.stringify(result));

			return result;
		});
	};

	return [value, setValueInLocalStorage];
}
