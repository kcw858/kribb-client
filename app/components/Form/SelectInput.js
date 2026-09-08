import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function SelectInput({ id, label, value, valueList, onChange, disabled = false }) {
	const { t } = useTranslation();
	if (disabled) {
		return (
			<div className="form-group row">
				<label className="col-sm-2 col-form-label">{label}</label>
				<div className="col-sm-10 d-flex align-items-center">{value}</div>
			</div>
		);
	}

	return (
		<div className="form-group row">
			{label !== "" ? (
				<label htmlFor={id} className="col-sm-2 col-form-label">
					{label}
				</label>
			) : (
				<></>
			)}
			<div className={label !== "" ? "col-sm-10" : "col-sm-12"}>
				<select
					className="custom-select bg-white"
					value={value}
					onChange={onChange}
					disabled={disabled}
					style={{ border: "1px solid #e2e8f0", color: "#4a5568" }}
				>
					<option key={"none"} value={""}>
						{t("selectItem")}
					</option>
					{valueList.map((value) => (
						<option key={value} value={value}>
							{value}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}

SelectInput.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	valueList: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.arrayOf(PropTypes.string)]),
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
};
