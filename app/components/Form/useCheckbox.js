import { useCallback, useState } from "react";

/**
 *
 * @param {boolean|undefined} initialValue
 * @returns
 */
export default function useCheckbox(initialValue = true) {
	let [value, setValue] = useState(initialValue);

	const onChange = useCallback((e) => {
		setValue(e.currentTarget.checked);
	}, []);

	return { value, setValue, onChange };
}
