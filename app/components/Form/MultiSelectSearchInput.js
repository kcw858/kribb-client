/* eslint-disable react/prop-types */
import React, { useState } from "react";
import SelectSearch from "react-select-search";
import "../../styles/react-search-select.css";

/**
 *
 * @param {{id: string, label: string, value: string[], onChange: any, multiple?: boolean, disabled?: boolean, valueList: Array<import("react-select-search").SelectSearchOption>}} params
 * @returns
 */
export default function MultiSelectSearchInput({ id, label, value, valueList, onChange, disabled = false }) {
	let [visible, setVisible] = useState(false);
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
			<div className="row col-sm-10">
				<div className="col-10" onClick={() => setVisible(true)}>
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
						printOptions={visible ? "always" : "never"}
						search={true}
						multiple={true}
						value={value}
						id={id}
						onChange={onChange}
					/>
				</div>
				<div className="col-2">
					<button
						type="button"
						className="btn btn-success btn-block"
						onClick={() => {
							setVisible(!visible);
						}}
					>
						{visible ? "선택완료" : "선택"}
					</button>
				</div>
			</div>
		</div>
	);
}
