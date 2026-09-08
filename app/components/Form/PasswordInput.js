import React from "react";
import PropTypes from "prop-types";

export default function PasswordInput({ id, label, value, onChange, disabled = false }) {
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
			<label htmlFor={id} className="col-sm-2 col-form-label">
				{label}
			</label>
			<div className="col-sm-10">
				<input
					value={value}
					onChange={onChange}
					type="password"
					className="form-control  bg-white"
					id={id}
					style={{ border: "1px solid #e2e8f0", color: "#4a5568" }}
				/>
			</div>
		</div>
	);
}

PasswordInput.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
};
