import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import _ from "lodash";
import { useTranslation } from 'react-i18next';

export default function CalSelector({ value, onChange }) {
	const { t } = useTranslation();

	const valueList = [
		{ label: t("sum"), value: "sum" },
		{ label: t("average"), value: "avg" },
		{ label: t("middle"), value: "ctr" },
		{ label: t("min"), value: "min" },
		{ label: t("max"), value: "max" },
		// { label: t("frequency"), value: "frq" },
	];

	return (
		<Select
			value={_.find(valueList, ["value", value])}
			placeholder={t("operation")}
			options={valueList}
			className="basic-multi-select"
			classNamePrefix="select"
			onChange={(option) => onChange(option.value)}
		/>
	);
}

CalSelector.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
};
