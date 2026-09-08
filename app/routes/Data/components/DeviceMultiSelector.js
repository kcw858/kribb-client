import React from "react";
import PropTypes from "prop-types";
import { default as ReactSelect } from "react-select";
import _ from "lodash";
import { useTranslation } from 'react-i18next';

export default function DeviceMultiSelector({ ...props }) {
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

DeviceMultiSelector.propTypes = {
	value: PropTypes.array,
	valueList: PropTypes.array,
	onChange: PropTypes.func,
	allowSelectAll: PropTypes.bool,
	allOption: PropTypes.func,
};
