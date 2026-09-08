import React from "react";
import PropTypes from "prop-types";
import { Input, InputGroup, Button, InputGroupAddon } from "..";

export class CustomSearch extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		onSearch: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			value: "",
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.value !== this.state.value) {
			this.props.onSearch(this.state.value);
		}
	}

	render() {
		return (
			<InputGroup className={this.props.className}>
				<InputGroupAddon addonType="prepend">
					<div style={{ backgroundColor: "#e2e8f0", width: "40px", borderRadius: "0.25rem 0 0 0.25rem" }}>
						<i className="fa fa-search fa-fw" style={{ margin: "11px", color: "#4A5568" }}></i>
					</div>
				</InputGroupAddon>
				<Input
					onChange={(e) => {
						this.setState({ value: e.target.value });
					}}
					value={this.state.value}
					className="bg-white"
					placeholder="Type to search..."
				/>
				{this.state.value && (
					<InputGroupAddon addonType="append">
						<Button
							outline
							onClick={() => {
								this.setState({ value: "" });
							}}
						>
							<i className="fa fa-fw fa-times"></i>
						</Button>
					</InputGroupAddon>
				)}
			</InputGroup>
		);
	}
}
