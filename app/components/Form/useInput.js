import { useCallback, useState } from "react";

/**
 *
 * @param {string} initialValue
 * @returns
 */
export default function useInput(initialValue) {
	let [value, setValue] = useState(String(initialValue || ""));

	const onChange = useCallback((e) => {
		setValue(e.currentTarget.value);
	}, []);

	return { value, setValue, onChange };
}
