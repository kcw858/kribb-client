import { useCallback, useState } from "react";

/**
 *
 * @param {string[]} initialValue
 * @returns
 */
export default function useSelectSearchInput(initialValue = []) {
	let [value, setValue] = useState(initialValue);

	const onChange = useCallback((value) => {
		setValue(value);
	}, []);

	return { value, setValue, onChange };
}
