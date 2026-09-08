import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import _ from "lodash";
import { useTranslation } from 'react-i18next';

export default function TimeSelector({ value, onChange }) {
	const { t } = useTranslation();

	const valueList = [
		{ label: t("realtime"), value: "rt" },
		{ label: "1" + t("minite"), value: "1m" },
		{ label: "5" + t("minite"), value: "5m" },
		{ label: "10" + t("minite"), value: "10m" },
		{ label: "1" + t("hour"), value: "1h" },
		{ label: "1" + t("day"), value: "1d" },
		{ label: "1" + t("week"), value: "1w" },
		{ label: "1" + t("month"), value: "1M" },
	];

	return (
		<Select
			value={_.find(valueList, ["value", value])}
			placeholder={t("hour")}
			options={valueList}
			className="basic-multi-select"
			classNamePrefix="select"
			onChange={(option) => onChange(option.value)}
		/>
	);
}

TimeSelector.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
};
