/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import PropTypes from "prop-types";

import { Button, ButtonGroup, InputGroup } from "..";
import { CustomSearch } from "./CustomSearch";
import { CustomPaginationPanel } from "./CustomPaginationPanel";
import { CustomSizePerPageButton } from "./CustomSizePerPageButton";
import DatePicker from "react-datepicker";
import moment from "moment";
import { AddonInput } from "../../routes/Forms/DatePicker/components";
import { useTranslation } from "react-i18next";
import MediaQuery from "react-responsive";

const sortCaret = (order) => {
	if (!order) return <i className="fa fa-fw fa-sort text-muted"></i>;
	if (order) return <i className={`fa fa-fw text-muted fa-sort-${order}`}></i>;
};

/**
 * @param {{updateData: updateData, keyField: string, columns: Array<any>, data: Array<any>, page: number, sizePerPage: number, totalSize: number, onClickRow: any, onClickAdd: any, datepicker: boolean}} parmas
 * @returns
 */
export default function CustomRemoteTable({
	keyField,
	columns,
	data,
	page,
	sizePerPage,
	totalSize,
	updateData,
	onClickRow,
	onClickAdd,
	datepicker = false,
}) {
	data = data || [];
	page = page || 1;
	sizePerPage = sizePerPage || 10;
	totalSize = totalSize || 0;
	onClickRow = onClickRow || (() => {});

	const { t } = useTranslation();

	const fromDate = moment("20210601", "YYYYMMDD").format("YYYY-MM-DD 00:00:00");
	const toDate = moment().format("YYYY-MM-DD 23:59:59");
	const calPeriod = useCallback((start, end) => {
		start = moment(start);
		end = moment(end);

		if (start.isSame(moment(fromDate)) && end.isSame(moment(toDate))) {
			return -1;
		}

		let diff = end.diff(start, "day");
		if (moment().format("YYYYMMDD") != end.format("YYYYMMDD") || diff > 2) {
			return -2;
		} else {
			return diff;
		}
	}, []);

	const selectPeriod = useCallback((e) => {
		let period = Number(e.currentTarget.value);

		if (period == 0) {
			setDate({ fromDate, toDate, period });
			return;
		}

		if (period == 1) {
			let fromDate = moment().subtract(1, "day").format("YYYY-MM-DD 00:00:00");
			let toDate = moment().format("YYYY-MM-DD 23:59:59");
			setDate({ fromDate, toDate, period });
			return;
		}

		if (period == 2) {
			let fromDate = moment().subtract(7, "day").format("YYYY-MM-DD 00:00:00");
			let toDate = moment().format("YYYY-MM-DD 23:59:59");
			setDate({ fromDate, toDate, period });
			return;
		}

		if (period == 3) {
			let fromDate = moment().subtract(1, "month").format("YYYY-MM-DD 00:00:00");
			let toDate = moment().format("YYYY-MM-DD 23:59:59");
			setDate({ fromDate, toDate, period });
			return;
		}
	}, []);

	let [date, setDate] = useState({
		period: 0,
		fromDate,
		toDate,
	});

	let params = useRef({
		page,
		sizePerPage,
		sortField: "",
		sortOrder: "",
		search: "",
		fromDate: date.fromDate,
		toDate: date.toDate,
	});

	useEffect(() => {
		updateData(params.current);
	}, []);

	useEffect(() => {
		let { fromDate, toDate } = params.current;
		if (fromDate == date.fromDate && toDate == date.toDate) {
			return;
		}

		params.current.fromDate = date.fromDate;
		params.current.toDate = date.toDate;
		updateData(params.current);
	}, [date]);

	for (let record of columns) {
		if (record.sort) {
			record.sortCaret = sortCaret;
		}
	}

	return (
		<div className="row justify-content-center">
			<div className="col">
				<ToolkitProvider keyField={keyField || "id"} data={data} columns={columns} search exportCSV>
					{(props) => (
						<React.Fragment>
							<MediaQuery minWidth={576}>
								<div className={`d-flex ${window["mode"] == "desktop" ? "justify-content-end" : ""} align-items-center mb-2`}>
									<div className={`d-flex ${window["mode"] == "desktop" ? "" : "flex-wrap"} ml-auto`}>
										{datepicker && (
											<>
												{/* <select className="custom-select bg-white mr-2" value={date.period} onChange={selectPeriod}>
												<option value={0}>{t("allAlerts")}</option>
												<option value={1}>{t("last1Day")}</option>
												<option value={2}>{t("last1Week")}</option>
												<option value={3}>{t("last1Month")}</option>
											</select> */}
												{/* <option value={-1} disabled={true}>
													사용자 지정
												</option> */}
												<InputGroup className="mr-2" size="sm">
													<DatePicker
														customInput={<AddonInput />}
														selected={new Date(moment(date.fromDate).toDate())}
														dateFormat="yyyy-MM-dd"
														selectsStart
														startDate={new Date(moment(fromDate).toDate())}
														endDate={new Date(moment(date.toDate).toDate())}
														onChange={(d) => {
															let start = moment(d.toString());
															let end = moment(date.toDate);

															if (end.isAfter(start)) {
																let fromDate = start.format("YYYY-MM-DD 00:00:00");
																let toDate = end.format("YYYY-MM-DD 23:59:59");
																let period = calPeriod(fromDate, toDate);
																setDate({ fromDate, toDate, period });
															} else {
																let fromDate = start.format("YYYY-MM-DD 00:00:00");
																let toDate = start.format("YYYY-MM-DD 23:59:59");
																let period = calPeriod(fromDate, toDate);
																setDate({ fromDate, toDate, period });
															}
														}}
													/>
												</InputGroup>
												<InputGroup className="mr-2" size="sm">
													<DatePicker
														customInput={<AddonInput />}
														selected={new Date(moment(date.toDate).toDate())}
														dateFormat="yyyy-MM-dd"
														selectsEnd
														startDate={new Date(moment(date.fromDate).toDate())}
														endDate={new Date(moment(toDate).toDate())}
														onChange={(d) => {
															let start = moment(date.fromDate);
															let end = moment(d.toString());

															if (start.isBefore(end)) {
																let fromDate = start.format("YYYY-MM-DD 00:00:00");
																let toDate = end.format("YYYY-MM-DD 23:59:59");
																let period = calPeriod(fromDate, toDate);
																setDate({ fromDate, toDate, period });
															} else {
																let fromDate = end.format("YYYY-MM-DD 00:00:00");
																let toDate = end.format("YYYY-MM-DD 23:59:59");
																let period = calPeriod(fromDate, toDate);
																setDate({ fromDate, toDate, period });
															}
														}}
													/>
												</InputGroup>
											</>
										)}
										<CustomSearch className="mr-2" {...props.searchProps} />
										{window["mode"] == "desktop" && (
											<ButtonGroup>
												{onClickAdd ? (
													<Button size="sm" outline onClick={onClickAdd}>
														<i className="fa fa-fw fa-plus" style={{ color: "#4a5568" }}></i>
														&nbsp;{t("add")}
													</Button>
												) : (
													""
												)}
												<Button
													size="sm"
													outline={true}
													onClick={() => {
														props.csvProps.onExport();
													}}
													className="btn-cancel"
												>
													CSV {t("save")}
												</Button>
											</ButtonGroup>
										)}
									</div>
								</div>
							</MediaQuery>
							{/** 여기부터 모바일버전 날짜 검색 두줄 */}
							<MediaQuery maxWidth={575}>
								{datepicker && (
									<div className="row px-0 mb-2">
										<InputGroup className="col d-flex justify-content-start">
											<DatePicker
												customInput={<AddonInput />}
												selected={new Date(moment(date.fromDate).toDate())}
												dateFormat="yyyy-MM-dd"
												selectsStart
												startDate={new Date(moment(fromDate).toDate())}
												endDate={new Date(moment(date.toDate).toDate())}
												onChange={(d) => {
													let start = moment(d.toString());
													let end = moment(date.toDate);

													if (end.isAfter(start)) {
														let fromDate = start.format("YYYY-MM-DD 00:00:00");
														let toDate = end.format("YYYY-MM-DD 23:59:59");
														let period = calPeriod(fromDate, toDate);
														setDate({ fromDate, toDate, period });
													} else {
														let fromDate = start.format("YYYY-MM-DD 00:00:00");
														let toDate = start.format("YYYY-MM-DD 23:59:59");
														let period = calPeriod(fromDate, toDate);
														setDate({ fromDate, toDate, period });
													}
												}}
											/>
										</InputGroup>
										<InputGroup className="col d-flex justify-content-end">
											<DatePicker
												customInput={<AddonInput />}
												selected={new Date(moment(date.toDate).toDate())}
												dateFormat="yyyy-MM-dd"
												selectsEnd
												startDate={new Date(moment(date.fromDate).toDate())}
												endDate={new Date(moment(toDate).toDate())}
												onChange={(d) => {
													let start = moment(date.fromDate);
													let end = moment(d.toString());

													if (start.isBefore(end)) {
														let fromDate = start.format("YYYY-MM-DD 00:00:00");
														let toDate = end.format("YYYY-MM-DD 23:59:59");
														let period = calPeriod(fromDate, toDate);
														setDate({ fromDate, toDate, period });
													} else {
														let fromDate = end.format("YYYY-MM-DD 00:00:00");
														let toDate = end.format("YYYY-MM-DD 23:59:59");
														let period = calPeriod(fromDate, toDate);
														setDate({ fromDate, toDate, period });
													}
												}}
											/>
										</InputGroup>
									</div>
								)}
								<div className="row mb-3">
									<div className="col-8 d-flex justify-content-start">
										<CustomSearch className="mr-2" {...props.searchProps} />
									</div>
									<div className="col-4 d-flex justify-content-end pl-0">
										{window["mode"] == "desktop" && (
											<ButtonGroup style={{ width: "100%" }}>
												{onClickAdd ? (
													<Button size="sm" outline onClick={onClickAdd}>
														<i className="fa fa-fw fa-plus" style={{ color: "#4a5568" }}></i>
														&nbsp;{t("add")}
													</Button>
												) : (
													""
												)}
												<Button
													size="sm"
													outline={true}
													onClick={() => {
														props.csvProps.onExport();
													}}
													className="btn btn-cancel"
												>
													CSV {t("save")}
												</Button>
											</ButtonGroup>
										)}
									</div>
								</div>
							</MediaQuery>

							<BootstrapTable
								// classes="table-responsive-lg"
								hover
								remote
								onTableChange={(type, { page, sizePerPage, sortField, sortOrder }) => {
									params.current = {
										...params.current,
										page,
										sizePerPage,
										sortField: String(sortField || ""),
										sortOrder: String(sortOrder || ""),
										search: String(props.searchProps.searchText || ""),
									};

									updateData(params.current);
								}}
								rowEvents={{
									onClick: onClickRow,
								}}
								pagination={paginationFactory({
									paginationSize: Number(sizePerPage),
									page: page,
									totalSize: totalSize,
									showTotal: true,
									pageListRenderer: (props) => <CustomPaginationPanel {...props} size="sm" className="ml-md-auto" />,
									// @ts-ignore
									sizePerPageRenderer: (props) => <CustomSizePerPageButton {...props} />,
									paginationTotalRenderer: (from, to, size) => (
										<span className="small dashboardText">
											{/* Showing {from} to {to} of {size} Results */}
											{t("total")} {size} {t("num")}
										</span>
									),
								})}
								bordered={false}
								{...props.baseProps}
							/>
						</React.Fragment>
					)}
				</ToolkitProvider>
			</div>
		</div>
	);
}

CustomRemoteTable.propTypes = {
	keyField: PropTypes.string,
	columns: PropTypes.array,
	data: PropTypes.array,
	page: PropTypes.number,
	sizePerPage: PropTypes.number,
	totalSize: PropTypes.number,
	updateData: PropTypes.func,
	onClickAdd: PropTypes.func,
	onClickRow: PropTypes.func,
	datepicker: PropTypes.bool,
};

/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback updateData
 * @param {CustomRemoteTableParams} params
 */

/**
 * 	@typedef {object} CustomRemoteTableParams
 *  @prop {number} page
 *  @prop {number} sizePerPage
 *  @prop {string} sortField
 *  @prop {string} sortOrder
 *  @prop {string} search
 *  @prop {string} fromDate
 *  @prop {string} toDate
 */
