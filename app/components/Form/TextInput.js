import React from "react";
import PropTypes from "prop-types";

export default function TextInput({ id, label, labelWidth, value, onChange, placeholder, disabled = false }) {
	if (labelWidth === undefined || labelWidth < 2) {
		labelWidth = 2;
	} else if (labelWidth > 10) {
		labelWidth = 10;
	}

	let labelWidthRatio = "col-sm-" + labelWidth;
	let inputWidthRatio = "col-sm-" + (12 - labelWidth);

	if (disabled) {
		return (
			<div className="form-group row">
				<label className={`${labelWidthRatio} col-form-label`}>{label}</label>
				<div className={`${inputWidthRatio} d-flex align-items-center`}>{value}</div>
			</div>
		);
	}

	return (
		<div className="form-group row">
			<label htmlFor={id} className={`${labelWidthRatio} col-form-label`}>
				{label}
			</label>
			<div className={inputWidthRatio}>
				<input
					value={value}
					onChange={onChange}
					type="string"
					className="form-control bg-white"
					id={id}
					style={{ border: "1px solid #e2e8f0", color: "#4a5568" }}
					placeholder={placeholder}
				/>
			</div>
		</div>
	);
}

TextInput.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	labelWidth: PropTypes.number,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
	placeholder: PropTypes.node,
};
