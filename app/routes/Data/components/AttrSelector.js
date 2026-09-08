import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { default as ReactSelect } from "react-select";
import { useTranslation } from 'react-i18next';

export default function AttrSelector({ ...props }) {
	const { t } = useTranslation();

	if (props.allowSelectAll) {
		return (
			<ReactSelect
				{...props}
				options={[props.allOption=allOption(t), ...props.valueList]}
				onChange={selected => {
					if (
						selected !== null &&
						selected.length > 0 &&
						selected[selected.length - 1].value === props.allOption.value
					) {
						return props.onChange(props.valueList);
					}
					return props.onChange(selected);
				}}
			/>
		);
	}

	return (
		<ReactSelect {...props} />
	);
}

const allOption = (t) => {
	let option = { 
		label: t("selectAll"),
		value: "*"
	};

	return option
};

AttrSelector.propTypes = {
	value: PropTypes.array,
	valueList: PropTypes.array,
	onChange: PropTypes.func,
	allowSelectAll: PropTypes.bool,
	allOption: PropTypes.func,
};

/**
 *
 * @param {Array<import("../../../store/local/DataStore").data>} data
 * @returns
 */
export function getAttrOptionList(data) {
	if (_.isEmpty(data)) {
		return [];
	}

	let optionList = [];
	for (let key in data[0]) {
		if (_.isArray(data[0][key])) {
			let label = key;
			switch (String(key).toLowerCase()) {
				case "nh3":
					label = "NH3";
					break;
				case "h2s":
					label = "H2S";
					break;
				case "odor":
					label = "Odor";
					break;
				case "voc":
					label = "VOC";
					break;
			}

			optionList.push({ label, value: key });
		}
	}

	return optionList;
}
