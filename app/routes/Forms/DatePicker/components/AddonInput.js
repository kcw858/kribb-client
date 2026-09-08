import React from "react";
import PropTypes from "prop-types";

import { InputGroup, InputGroupAddon, Input } from "./../../../../components";

// eslint-disable-next-line react/display-name
const AddonInputFR = React.forwardRef((props, ref) => (
	<InputGroup className={props.className}>
		<InputGroupAddon addonType="prepend">
			<div style={{ backgroundColor: "#e2e8f0", width: "40px", borderRadius: "5px 0 0 5px" }}>
				<i className="fa fa-calendar-o" style={{ marginLeft: "14px", marginTop: "11px", color: "#4A5568" }}></i>
			</div>
		</InputGroupAddon>
		<Input
			style={{ backgroundColor: props.disabled ? "#E7E9EB" : "#FFFFFF" }}
			onClick={props.onClick}
			onChange={props.onChange}
			value={props.value}
			disabled={props.disabled}
			ref={ref}
		/>
	</InputGroup>
));
AddonInputFR.propTypes = {
	onClick: PropTypes.func,
	onChange: PropTypes.func,
	value: PropTypes.string,
	className: PropTypes.string,
};

export { AddonInputFR as AddonInput };
