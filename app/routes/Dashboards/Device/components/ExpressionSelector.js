/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { SelectInput, TextInput, useInput } from "../../../../components/Form";

const expressionList = ["A * x + B", "A * exp(B * x )", "A * LN( x ) + B", "A * pow(10, B) * x + C", "A * pow( x , B) + C"];
const regexExpressionList = [
	/(\d+) \* x \+ (\d+)/,
	/(\d+) \* exp\((\d+) \* x \)/,
	/(\d+) \* LN\( x \) \+ (\d+)/,
	/(\d+) \* pow\(10, (\d+)\) \* x \+ (\d+)/,
	/(\d+) \* pow\( x , (\d+)\) \+ (\d+)/,
];

export default function ExpressionSelector({ label, expressionValueInput }) {
	let expressionValue = expressionValueInput.value || "";
	let expressionType = "";
	let valueA = "";
	let valueB = "";
	let valueC = "";

	for (let index in regexExpressionList) {
		let result = expressionValue.match(regexExpressionList[index]);
		if (result) {
			expressionType = expressionList[index];
			valueA = result[1] || "";
			valueB = result[2] || "";
			valueC = result[3] || "";
		}
	}

	const expressionTypeInput = useInput(expressionType);
	const valueAInput = useInput(valueA);
	const valueBInput = useInput(valueB);
	const valueCInput = useInput(valueC);

	useEffect(() => {
		let expressionType = expressionTypeInput.value || "";
		let expressionValue = expressionType;

		if (expressionType.indexOf("A") !== -1) {
			expressionValue = expressionValue.replace("A", valueAInput.value || "0");
		}

		if (expressionType.indexOf("B") !== -1) {
			expressionValue = expressionValue.replace("B", valueBInput.value || "0");
		}

		if (expressionType.indexOf("C") !== -1) {
			expressionValue = expressionValue.replace("C", valueCInput.value || "0");
		}

		expressionValueInput.setValue(expressionValue);
	}, [valueAInput.value, valueBInput.value, valueCInput.value]);

	return (
		<>
			<SelectInput label={label} id={`${label}Input`} valueList={expressionList} {...expressionTypeInput} />
			{expressionTypeInput.value.indexOf("A") !== -1 && <TextInput label={`${label} 보정식 A`} id={`${label}valueAInput`} {...valueAInput} />}
			{expressionTypeInput.value.indexOf("B") !== -1 && <TextInput label={`${label} 보정식 B`} id={`${label}valueBInput`} {...valueBInput} />}
			{expressionTypeInput.value.indexOf("C") !== -1 && <TextInput label={`${label} 보정식 C`} id={`${label}valueCInput`} {...valueCInput} />}
		</>
	);
}
