import React from "react";
import PropTypes from "prop-types";

export default function SwitchInput({ id, label, value, onChange, disabled = false }) {
	if (disabled) {
		return (
			<div className="form-group row">
				<label htmlFor={id} className="col-sm-2 col-form-label">
					{label}
				</label>

				<div className="col-sm-10">
					<div className="custom-control custom-switch">
						<input
							type="checkbox"
							checked={value}
							onChange={onChange}
							disabled
							className="custom-control-input"
							id={id}
							style={{ border: "1px solid #e2e8f0", color: "#4a5568" }}
						/>
						<label className="custom-control-label" htmlFor={id}></label>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="form-group row">
				<label htmlFor={id} className="col-sm-2 col-form-label">
					{label}
				</label>

				<div className="col-sm-10">
					<div className="custom-control custom-switch">
						<input
							type="checkbox"
							checked={value}
							onChange={onChange}
							className="custom-control-input"
							id={id}
							style={{ border: "1px solid #e2e8f0", color: "#4a5568" }}
						/>
						<label className="custom-control-label" htmlFor={id}></label>
					</div>
				</div>
			</div>
		);
	}
}

SwitchInput.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.bool,
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
};
