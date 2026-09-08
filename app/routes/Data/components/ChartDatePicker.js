import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DatePicker from "react-datepicker";
import { AddonInput } from "../../Forms/DatePicker/components";
import MediaQuery from "react-responsive";

//export const minFromDate = moment("20210601", "YYYYMMDD").format("YYYY-MM-DD 00:00:00");
//2022-10-19 달력 시작 날짜를 현재 날짜로
export const minFromDate = moment().format("YYYY-MM-DD 00:00:00");
export const maxToDate = moment().format("YYYY-MM-DD 23:59:59");

export default function ChartDatePicker({ fromDate, toDate, onChange, disabled }) {
	return (
		<div className="row">
			<MediaQuery minWidth={446}>
				<div className="col-6 customDatePickerWidth">
					{/* 달력 */}
					<DatePicker
						readOnly={disabled}
						disabled={disabled}
						customInput={<AddonInput disabled={disabled} />}
						selected={new Date(moment(fromDate).format())}
						dateFormat="yyyy-MM-dd"
						selectsStart
						// startDate={new Date(minFromDate)}
						// endDate={new Date(toDate)}
						onChange={(d) => {
							let start = moment(new Date(d.toString()));
							let end = moment(toDate);

							if (end.isAfter(start)) {
								let fromDate = start.format("YYYY-MM-DD 00:00:00");
								let toDate = end.format("YYYY-MM-DD 23:59:59");
								onChange(fromDate, toDate);
							} else {
								let fromDate = start.format("YYYY-MM-DD 00:00:00");
								let toDate = start.format("YYYY-MM-DD 23:59:59");
								onChange(fromDate, toDate);
							}
						}}
					/>
				</div>
				<div className="col-6 customDatePickerWidth pl-0">
					<DatePicker
						readOnly={disabled}
						disabled={disabled}
						customInput={<AddonInput disabled={disabled} />}
						selected={new Date(moment(toDate).format())}
						dateFormat="yyyy-MM-dd"
						selectsEnd
						// startDate={new Date(fromDate)}
						// endDate={new Date(maxToDate)}
						onChange={(d) => {
							let start = moment(fromDate);
							let end = moment(new Date(d.toString()));

							if (start.isBefore(end)) {
								let fromDate = start.format("YYYY-MM-DD 00:00:00");
								let toDate = end.format("YYYY-MM-DD 23:59:59");
								onChange(fromDate, toDate);
							} else {
								let fromDate = end.format("YYYY-MM-DD 00:00:00");
								let toDate = end.format("YYYY-MM-DD 23:59:59");
								onChange(fromDate, toDate);
							}
						}}
					/>
				</div>
			</MediaQuery>
			<MediaQuery maxWidth={445}>
				<div className="col-9 customDatePickerWidth mt-2 mb-1 pr-0">
					{/* 달력 */}
					<DatePicker
						readOnly={disabled}
						disabled={disabled}
						customInput={<AddonInput disabled={disabled} />}
						selected={new Date(moment(fromDate).format())}
						dateFormat="yyyy-MM-dd"
						selectsStart
						// startDate={new Date(minFromDate)}
						// endDate={new Date(toDate)}
						onChange={(d) => {
							let start = moment(new Date(d.toString()));
							let end = moment(toDate);

							if (end.isAfter(start)) {
								let fromDate = start.format("YYYY-MM-DD 00:00:00");
								let toDate = end.format("YYYY-MM-DD 23:59:59");
								onChange(fromDate, toDate);
							} else {
								let fromDate = start.format("YYYY-MM-DD 00:00:00");
								let toDate = start.format("YYYY-MM-DD 23:59:59");
								onChange(fromDate, toDate);
							}
						}}
					/>
				</div>
				<span className="col-3 pt-3 pr-4 pl-0" style={{ color: "#718096", textAlign: "end" }}>
					부터
				</span>
				<div className="col-9 customDatePickerWidth mt-1 pr-0">
					<DatePicker
						readOnly={disabled}
						disabled={disabled}
						customInput={<AddonInput disabled={disabled} />}
						selected={new Date(moment(toDate).format())}
						dateFormat="yyyy-MM-dd"
						selectsEnd
						// startDate={new Date(fromDate)}
						// endDate={new Date(maxToDate)}
						onChange={(d) => {
							let start = moment(fromDate);
							let end = moment(new Date(d.toString()));

							if (start.isBefore(end)) {
								let fromDate = start.format("YYYY-MM-DD 00:00:00");
								let toDate = end.format("YYYY-MM-DD 23:59:59");
								onChange(fromDate, toDate);
							} else {
								let fromDate = end.format("YYYY-MM-DD 00:00:00");
								let toDate = end.format("YYYY-MM-DD 23:59:59");
								onChange(fromDate, toDate);
							}
						}}
					/>
				</div>
				<span className="col-3 pt-3 pr-4 pl-0" style={{ color: "#718096", textAlign: "end" }}>
					까지
				</span>
			</MediaQuery>
		</div>
	);
}

ChartDatePicker.propTypes = {
	disabled: PropTypes.bool,
	fromDate: PropTypes.string,
	toDate: PropTypes.string,
	onChange: PropTypes.func,
};
