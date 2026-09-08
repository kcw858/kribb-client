import { useCallback, useState } from "react";

/**
 *
 * @param {string} initialValue
 * @returns
 */
export default function useSelectSearchInput(initialValue) {
	let [value, setValue] = useState(String(initialValue || ""));

	const onChange = useCallback((value) => {
		setValue(value);
	}, []);

	return { value, setValue, onChange };
}
