import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import MonitorStore from "../../../store/global/MonitorStore";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
function DeviceSelector({ value, onChange }) {
	const { t } = useTranslation();

	const valueList = [];
	for (let monitorInfo of MonitorStore.monitorInfoList) {
		valueList.push({ label: monitorInfo.name, value: monitorInfo.id });
	}

	return (
		<Select
			value={_.find(valueList, ["value", value[0]])}
			placeholder={t("selectDevices")}
			options={valueList}
			className="basic-multi-select"
			classNamePrefix="select"
			onChange={(option) => onChange(option.value)}
		/>
	);
}

DeviceSelector.propTypes = {
	value: PropTypes.array,
	onChange: PropTypes.func,
};

export default observer(DeviceSelector);
