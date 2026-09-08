/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	Brush,
	ReferenceLine,
} from "recharts";
import { HeaderMain } from "../components/HeaderMain";
import ChartDatePicker, { maxToDate, minFromDate } from "./components/ChartDatePicker";
import { CSVLink } from "react-csv";
import moment from "moment";
import DataStore from "../../store/local/DataStore";
import _ from "lodash";
import AttrSelector, { getAttrOptionList } from "./components/AttrSelector";
import randomColor from "randomcolor";
import MonitorStore from "../../store/global/MonitorStore";
import DeviceSelector from "./components/DeviceSelector";
import DeviceMultiSelector from "./components/DeviceMultiSelector";
import TimeSelector from "./components/TimeSelector";
import CalSelector from "./components/CalSelector";
import ChartTypeSelector from "./components/ChartTypeSelector";
import DataListTable from "./components/DataListTable";
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import { useTranslation } from "react-i18next";
import MediaQuery from "react-responsive";

const Option = (props) => {
	return (
		<div>
			<components.Option {...props}>
				<input type="checkbox" checked={props.isSelected} onChange={() => null} /> <label>{props.label}</label>
			</components.Option>
		</div>
	);
};

const MultiValue = (props) => (
	<components.MultiValue {...props}>
		<span>{props.data.label}</span>
	</components.MultiValue>
);

const animatedComponents = makeAnimated();

export default function DataAdvanced() {
	const { t } = useTranslation();
	const deviceList = [];
	for (let monitorInfo of MonitorStore.monitorInfoList) {
		deviceList.push({ label: monitorInfo.name, value: monitorInfo.id });
	}

	const dataStore = new DataStore();

	const [attrOptionList, setAttrOptionList] = useState([
		{ label: "NH3", value: "nH3" },
		{ label: "H2S", value: "h2S" },
		{ label: "INDOLES", value: "odor" },
		{ label: "ACID", value: "voc" },
	]);

	const [attrList, setAttrList] = useState([
		{ label: "NH3", value: "nH3" },
		{ label: "H2S", value: "h2S" },
		{ label: "INDOLES", value: "odor" },
		{ label: "ACID", value: "voc" },
	]);

	const handleAttrChange = (selected) => {
		setAttrList(selected);
	};

	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [deviceNameList, setDeviceNameList] = useState([]);
	const [deviceSelectedList, setDeviceSelectedList] = useState([]);
	const [params, setParams] = useState({
		deviceid: [],
		sect: "rt",
		arith: "sum",
		fromDate: minFromDate,
		toDate: maxToDate,
		limit: 1000,
	});
	const handleDeviceListChange = (selected) => {
		let deviceIdList = [];
		for (let record of selected) {
			deviceIdList.push(record.value);
		}

		setParams({ ...params, deviceid: deviceIdList });
		setDeviceSelectedList(selected);

		if (_.isEmpty(deviceIdList)) {
			setData([]);
			setTableData([]);
			setDeviceNameList([]);
			setDeviceSelectedList([]);
		}
	};

	const [chartType, setChartType] = useState("line");
	const [showTable, setShowTable] = useState(false);
	const [circle, setCircle] = useState(false);
	const [dataResponse, setDataResponse] = useState("");
	const [responseColor, setResponseColor] = useState("");
	const [bgColor, setBgColor] = useState("");
	// useEffect(() => {
	// 	if (_.isEmpty(params.deviceid)) {
	// 		return;
	// 	}

	// 	dataStore.getDataList(params).then(({ data }) => {
	// 		if (_.isEmpty(attrOptionList)) {
	// 			let attrOptionList = getAttrOptionList(data);
	// 			setAttrOptionList(attrOptionList);

	// 			let attrList = [];
	// 			for (let record of attrOptionList) {
	// 				attrList.push(record);
	// 			}

	// 			setAttrList(attrList);
	// 		}

	// 		let deviceNameList = [];
	// 		let chartData = {};
	// 		let tableData = {};
	// 		for (let deviceData of data) {
	// 			let info = _.find(MonitorStore.monitorInfoList, ["id", deviceData["deviceid"]]);
	// 			deviceNameList.push(info.name);
	// 			for (let attrKey in deviceData) {
	// 				if (_.isArray(deviceData[attrKey])) {
	// 					for (let index in deviceData[attrKey]) {
	// 						let rawData = deviceData[attrKey][index];
	// 						chartData[rawData.x] = chartData[rawData.x] || { date: rawData.x };
	// 						chartData[rawData.x][`${info.name}:${attrKey}`] = rawData.y;

	// 						tableData[rawData.x] = tableData[rawData.x] || { id: deviceData["deviceid"], name: info.name, date: rawData.x };
	// 						tableData[rawData.x][attrKey] = rawData.y;
	// 					}
	// 				}
	// 			}
	// 		}

	// 		for (let monitorInfo of MonitorStore.monitorInfoList) {
	// 			deviceList.push({ label: monitorInfo.name, value: monitorInfo.id });
	// 		}

	// 		setDeviceNameList(deviceNameList);
	// 		setData(_.values(chartData));
	// 		setTableData(_.values(tableData));
	// 	});
	// }, [params, deviceSelectedList]);

	const getData = async () => {
		if (_.isEmpty(params.deviceid)) {
			return;
		}
		dataStore.getDataList(params).then(({ data }) => {
			if (_.isEmpty(attrOptionList)) {
				let attrOptionList = getAttrOptionList(data);
				setAttrOptionList(attrOptionList);

				let attrList = [];
				for (let record of attrOptionList) {
					attrList.push(record);
				}

				setAttrList(attrList);
			}

			let deviceNameList = [];
			let chartData = {};
			let tableData = {};
			//h2s의 데이터가 넘어오지않으면 데이터가 없는걸로 판단
			data[0].h2S.length === 0
				? (setDataResponse("데이터가 없거나 불러올 수 없습니다."), setResponseColor("red"), setBgColor(""), setCircle(false))
				: (setDataResponse(""), setBgColor("#44a3ec"), setCircle(false));
			for (let deviceData of data) {
				let info = _.find(MonitorStore.monitorInfoList, ["id", deviceData["deviceid"]]);
				deviceNameList.push(info.name);
				for (let attrKey in deviceData) {
					if (_.isArray(deviceData[attrKey])) {
						for (let index in deviceData[attrKey]) {
							let rawData = deviceData[attrKey][index];
							chartData[rawData.x] = chartData[rawData.x] || { date: rawData.x };
							chartData[rawData.x][`${info.name}:${attrKey}`] = rawData.y;

							tableData[rawData.x] = tableData[rawData.x] || { id: deviceData["deviceid"], name: info.name, date: rawData.x };
							tableData[rawData.x][attrKey] = rawData.y;
						}
					}
				}
			}

			for (let monitorInfo of MonitorStore.monitorInfoList) {
				deviceList.push({ label: monitorInfo.name, value: monitorInfo.id });
			}

			setDeviceNameList(deviceNameList);
			setData(_.values(chartData));
			setTableData(_.values(tableData));
		});
	};

	const search = () => {
		getData();
		setResponseColor("");
		setDataResponse("데이터를 불러오는 중입니다 ");
		setCircle(true);
		setBgColor("#44a3ec");
	};
	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("advancedTitle")} />
			</div>

			<div className="row">
				<div className="col">
					<div className="card mb-2">
						<MediaQuery minWidth={446}>
							<div className="card-body m-2">
								<div className="row">
									{/* <div className="col-6">
									<DeviceMultiSelector
										value={deviceSelectedList}
										valueList={deviceList}
										allowSelectAll={true}
										isMulti
										placeholder={t("selectDevices")}
										closeMenuOnSelect={false}
										hideSelectedOptions={false}
										components={{ Option, MultiValue, animatedComponents }}
										onChange={handleDeviceListChange}
										// onChange={(deviceid) => setParams((prev) => ({ ...prev, deviceid }))}
									/>
								</div>
								<div className="col-3">
									<ChartTypeSelector value={chartType} onChange={(chartType) => setChartType(chartType)} />
								</div> */}
									<div className="col-12">
										<DeviceSelector
											value={params.deviceid}
											onChange={(deviceid) => setParams((prev) => ({ ...prev, deviceid: [deviceid] }))}
										/>
									</div>
									{/* <div className="col-3">
									<button
										type="button"
										className={`btn ${showTable ? "btn-primary" : "btn-primary"} btn-block`}
										onClick={() => setShowTable((prev) => !prev)}
									>
										{showTable ? t("closeTable") : t("openTable")}
									</button>
								</div> */}
								</div>
							</div>
						</MediaQuery>
						<MediaQuery maxWidth={445}>
							<div className="card-body card-body2">
								<div className="row">
									<div className="col-12">
										<DeviceSelector
											value={params.deviceid}
											onChange={(deviceid) => setParams((prev) => ({ ...prev, deviceid: [deviceid] }))}
										/>
									</div>
								</div>
							</div>
						</MediaQuery>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<div className="card">
						<MediaQuery minWidth={446}>
							<div className="card-body">
								<div className="d-flex flex-wrap align-content-center d-flex justify-content-between">
									<div className="p-2 flex-fill">
										<AttrSelector
											valueList={attrOptionList}
											value={attrList}
											allowSelectAll={true}
											isMulti
											placeholder={t("selectData")}
											closeMenuOnSelect={false}
											hideSelectedOptions={false}
											components={{ Option, MultiValue, animatedComponents }}
											onChange={handleAttrChange}
										/>
									</div>

									<div className="p-2" style={{ minWidth: 130 }}>
										<CalSelector value={params.arith} onChange={(arith) => setParams((prev) => ({ ...prev, arith }))} />
									</div>

									<div className="p-2" style={{ minWidth: 130 }}>
										<TimeSelector value={params.sect} onChange={(sect) => setParams((prev) => ({ ...prev, sect }))} />
									</div>

									<div className="p-2">
										<ChartDatePicker
											fromDate={params.fromDate}
											toDate={params.toDate}
											onChange={(fromDate, toDate) => setParams((prev) => ({ ...prev, fromDate, toDate }))}
										/>
									</div>

									<div className="p-2">
										<CSVLink
											className="btn btn-small btn-secondary"
											filename={`data-${moment().format("YYYYMMDD_HH")}.csv`}
											data={data}
										>
											CSV {t("save")}
										</CSVLink>
										<button
											className="btn btn-small btn-secondary ml-2"
											onClick={search}
											style={{ backgroundColor: bgColor, border: "none" }}
										>
											{t("Lookup")}
										</button>
									</div>
								</div>
							</div>
						</MediaQuery>
						<MediaQuery maxWidth={445}>
							<div className="card-body card-body2">
								<div className="d-flex flex-wrap align-content-center d-flex justify-content-between">
									<div className="pb-2 flex-fill">
										<AttrSelector
											valueList={attrOptionList}
											value={attrList}
											allowSelectAll={true}
											isMulti
											placeholder={t("selectData")}
											closeMenuOnSelect={false}
											hideSelectedOptions={false}
											components={{ Option, MultiValue, animatedComponents }}
											onChange={handleAttrChange}
										/>
									</div>

									<table style={{ width: "100%" }}>
										<tr>
											<td>
												<div className="py-2" style={{ width: "100%" }}>
													<CalSelector value={params.arith} onChange={(arith) => setParams((prev) => ({ ...prev, arith }))} />
												</div>
											</td>
											<td>
												<div className="py-2" style={{ width: "100%" }}>
													<TimeSelector value={params.sect} onChange={(sect) => setParams((prev) => ({ ...prev, sect }))} />
												</div>
											</td>
										</tr>
									</table>

									<div className="pb-2">
										<ChartDatePicker
											fromDate={params.fromDate}
											toDate={params.toDate}
											onChange={(fromDate, toDate) => setParams((prev) => ({ ...prev, fromDate, toDate }))}
										/>
									</div>

									<div className="pt-2">
										<CSVLink
											className="btn btn-small btn-secondary"
											filename={`data-${moment().format("YYYYMMDD_HH")}.csv`}
											data={data}
										>
											CSV {t("save")}
										</CSVLink>
										<button
											className="btn btn-small btn-secondary ml-2"
											onClick={search}
											style={{ backgroundColor: bgColor, border: "none" }}
										>
											{t("Lookup")}
										</button>
									</div>
								</div>
							</div>
						</MediaQuery>
					</div>
				</div>
			</div>

			<br />

			<div className="row">
				<div className="col">
					<div className="card">
						<div className="card-body">
							<div className="row">
								<div className="col">
									<div className='d-inline-block'>
										<span style={{ color: responseColor}}>{dataResponse}</span>
									</div> 
									<div className='d-inline-block' style={{animation:"spin 0.5s linear infinite",visibility: circle ? "visible" : "hidden"}}>
										<i className="fa fa-fw fa-circle-o-notch"></i>
									</div>
									{chartType == "line" && (
										<DataLineChart
											data={data}
											deviceNameList={deviceNameList}
											attrOptionList={attrOptionList}
											attrList={attrList}
										/>
									)}
									{chartType == "area" && (
										<DataAreaChart
											data={data}
											deviceNameList={deviceNameList}
											attrOptionList={attrOptionList}
											attrList={attrList}
										/>
									)}
									{chartType == "bar" && (
										<DataBarChart
											data={data}
											deviceNameList={deviceNameList}
											attrOptionList={attrOptionList}
											attrList={attrList}
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<br />

			{/* {showTable && (
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-body">
								<div className="row">
									<div className="col">
										<DataListTable data={tableData} attrOptionList={attrOptionList} attrList={attrList} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)} */}
		</div>
	);
}

/**
 *
 * @param {{data:Array<any>, deviceNameList: Array<any>, attrOptionList: Array<any>, attrList: Array<any>}} props
 */
function DataLineChart({ data, deviceNameList, attrOptionList, attrList }) {
	return (
		<ResponsiveContainer width="100%" height={400}>
			<LineChart
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: -20,
					bottom: 5,
				}}
			>
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Legend height={15} />
				<ReferenceLine y={0} stroke="#000" />
				<Brush dataKey="name" height={15} stroke="#8884d8" />
				<CartesianGrid stroke="none" strokeDasharray="5 5" />
				{deviceNameList.map((deviceName) =>
					attrOptionList.map(
						(record) =>
							_.findIndex(attrList, ["value", record.value]) !== -1 && (
								<>
									{console.log(_.findIndex(attrList, ["value", record.value]))}
									<Line
										key={`${deviceName}:${record.value}`}
										name={`${deviceName}:${record.label}`}
										type="monotone"
										dataKey={`${deviceName}:${record.value}`}
										//stroke={randomColor({ seed: record.value })}
										stroke={
											record.label === "NH3"
												? "black"
												: record.label === "H2S"
												? "red"
												: record.label === "INDOLES"
												? "blue"
												: "green"
										}
										fill={randomColor({ seed: deviceName })}
										//그래프 색상 랜덤컬러
										dot={{ stroke: "red", strokeWidth: 0, r: 0, strokeDasharray: "" }}
									/>
								</>
							)
					)
				)}
			</LineChart>
		</ResponsiveContainer>
	);
}

/**
 *
 * @param {{data:Array<any>, deviceNameList: Array<any>, attrOptionList: Array<any>, attrList: Array<any>}} props
 */
function DataAreaChart({ data, deviceNameList, attrOptionList, attrList }) {
	return (
		<ResponsiveContainer width="100%" height={400}>
			<AreaChart
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: -20,
					bottom: 5,
				}}
			>
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Legend height={15} />
				<ReferenceLine y={0} stroke="#000" />
				<Brush dataKey="name" height={15} stroke="#8884d8" />
				<CartesianGrid stroke="none" strokeDasharray="5 5" />
				{deviceNameList.map((deviceName) =>
					attrOptionList.map(
						(record) =>
							attrList.indexOf(record.value) !== -1 && (
								<Area
									key={`${deviceName}:${record.value}`}
									name={`${deviceName}:${record.label}`}
									type="monotone"
									dataKey={`${deviceName}:${record.value}`}
									stroke={randomColor({ seed: deviceName })}
									fill={randomColor({ seed: deviceName })}
								/>
							)
					)
				)}
			</AreaChart>
		</ResponsiveContainer>
	);
}

/**
 *
 * @param {{data:Array<any>, deviceNameList: Array<any>, attrOptionList: Array<any>, attrList: Array<any>}} props
 */
function DataBarChart({ data, deviceNameList, attrOptionList, attrList }) {
	return (
		<ResponsiveContainer width="100%" height={400}>
			<BarChart
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: -20,
					bottom: 5,
				}}
			>
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Legend height={15} />
				<ReferenceLine y={0} stroke="#000" />
				<Brush dataKey="name" height={15} stroke="#8884d8" />
				<CartesianGrid stroke="none" strokeDasharray="5 5" />
				{deviceNameList.map((deviceName) =>
					attrOptionList.map(
						(record) =>
							attrList.indexOf(record.value) !== -1 && (
								<Bar
									key={`${deviceName}:${record.value}`}
									name={`${deviceName}:${record.label}`}
									type="monotone"
									dataKey={`${deviceName}:${record.value}`}
									stroke={randomColor({ seed: deviceName })}
									fill={randomColor({ seed: deviceName })}
								/>
							)
					)
				)}
			</BarChart>
		</ResponsiveContainer>
	);
}
