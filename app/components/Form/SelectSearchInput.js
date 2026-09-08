/* eslint-disable react/prop-types */
import React from "react";
import SelectSearch from "react-select-search";
import "../../styles/react-search-select.css";

/**
 *
 * @param {{id: string, label: string, value: string, onChange: any, multiple?: boolean, disabled?: boolean, valueList: Array<import("react-select-search").SelectSearchOption>}} params
 * @returns
 */
export default function SelectSearchInput({ id, label, value, valueList, onChange, disabled = false }) {
	if (disabled) {
		return (
			<div className="form-group row">
				<label className="col-sm-2 col-form-label">{label}</label>
				<SelectSearch disabled options={valueList} value={value} id={id} onChange={onChange} />
			</div>
		);
	}

	return (
		<div className="form-group row">
			<label htmlFor={id} className="col-sm-2 col-form-label">
				{label}
			</label>
			<div className="col-sm-10">
				<SelectSearch
					options={valueList}
					filterOptions={(options) => (query) => {
						let result = [];
						for (let option of options) {
							if (option.name.indexOf(query) != -1) {
								result.push(option);
							}
						}

						return result;
					}}
					closeOnSelect={true}
					search={true}
					multiple={false}
					value={value}
					id={id}
					onChange={onChange}
				/>
			</div>
		</div>
	);
}
