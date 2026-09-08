import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import _ from "lodash";
import { useTranslation } from 'react-i18next';

export default function ChartTypeSelector({ value, onChange }) {
	const { t } = useTranslation();

	const valueList = [
		{ label: t("lineChart"), value: "line" },
		{ label: t("areaChart"), value: "area" },
		{ label: t("barChart"), value: "bar" },
	];

	return (
		<Select
			value={_.find(valueList, ["value", value])}
			placeholder={t("chartsTitle")}
			options={valueList}
			className="basic-multi-select"
			classNamePrefix="select"
			onChange={(option) => onChange(option.value)}
		/>
	);
}

ChartTypeSelector.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
};
