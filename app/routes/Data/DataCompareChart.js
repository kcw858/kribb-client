/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
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
import ChartIntervalSelector from "./components/ChartIntervalSelector";
import { CSVLink } from "react-csv";
import moment from "moment";
import DataStore from "../../store/local/DataStore";
import _ from "lodash";
import AttrSelector, { getAttrOptionList } from "./components/AttrSelector";
import randomColor from "randomcolor";
import MonitorStore from "../../store/global/MonitorStore";
import DeviceMultiSelector from "./components/DeviceMultiSelector";
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import { useTranslation } from "react-i18next";
import DeviceStore from "../../store/local/DeviceStore";
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

export default function DataCompareChart() {
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
	const [deviceNameList, setDeviceNameList] = useState([]);
	const [deviceSelectedList, setDeviceSelectedList] = useState([]);
	const [dataResponse, setDataResponse] = useState("");
	const [responseColor, setResponseColor] = useState("");
	const [bgColor, setBgColor] = useState("");
	const [circle, setCircle] = useState(false);
	const handleDeviceListChange = (selected) => {
		let deviceIdList = [];
		for (let record of selected) {
			deviceIdList.push(record.value);
		}

		setParams({ ...params, deviceid: deviceIdList });
		setDeviceSelectedList(selected);
	};

	const [params, setParams] = useState({
		deviceid: [],
		sect: "rt",
		arith: "avg",
		fromDate: minFromDate,
		toDate: maxToDate,
		limit: 1000,
	});

	const getData = async () => {
		if (_.isEmpty(params.deviceid)) {
			return;
		}

		let response = await dataStore.getDataList(params);
		let data = response.data;

		const deviceStore = new DeviceStore();
		const deviceids = [];
		let deviceName = {};

		for (let i = 0; i < data.length; i++) {
			if (data[i].h2S.length === 0) {
				//데이터를 못불러온 장비의 ID를 넣어 장비명 추출 -> 배열에 추가
				deviceName = await deviceStore.getDeviceInfo(data[i].deviceid);
				deviceids.push(deviceName.data.name);
			}
		}
		deviceids.length === 0 ? (setDataResponse(""), setBgColor("#44a3ec"), setCircle(false)) : setDataResponse(`불러오지 못한 데이터= ${deviceids}`),
			setResponseColor("red"),
			setCircle(false),
			setBgColor(`${deviceids.length <= 1 ? "#44a3ec" : ""}`);
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
		for (let deviceData of data) {
			let info = _.find(MonitorStore.monitorInfoList, ["id", deviceData["deviceid"]]);
			deviceNameList.push(info.name);
			for (let attrKey in deviceData) {
				if (_.isArray(deviceData[attrKey])) {
					for (let index in deviceData[attrKey]) {
						let rawData = deviceData[attrKey][index];
						chartData[rawData.x] = chartData[rawData.x] || { date: rawData.x };
						chartData[rawData.x][`${info.name}:${attrKey}`] = Number(rawData.y);
					}
				}
			}
		}

		setDeviceNameList(deviceNameList);
		setData(_.orderBy(_.values(chartData), ["date", "asc"]));
	};

	// // let intervalId;
	// useEffect(() => {
	// 	getData();

	// 	// let interval = 3000;
	// 	// if (params.sect == "10m") {
	// 	// 	interval = 10 * 60 * 1000;
	// 	// }

	// 	// if (params.sect == "1h") {
	// 	// 	interval = 6 * 10 * 60 * 1000;
	// 	// }

	// 	// clearInterval(intervalId);
	// 	// intervalId = setInterval(() => {
	// 	// 	getData();
	// 	// }, interval);

	// 	// return () => {
	// 	// 	clearInterval(intervalId);
	// 	// };
	// }, [params, deviceSelectedList]);

	const search = () => {
		getData();
		setResponseColor("");
		setCircle(true);
		setDataResponse("데이터를 불러오는 중입니다 ");
		setBgColor("#44a3ec");
	};

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("compareDevicesTitle")} />
			</div>

			<div className="row">
				<div className="col">
					<div className="card mb-2">
						<MediaQuery minWidth={446}>
							<div className="card-body m-2">
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
						</MediaQuery>
						<MediaQuery maxWidth={445}>
							<div className="card-body card-body2">
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

									<div className="p-2">
										<ChartIntervalSelector value={params.sect} onChange={(sect) => setParams((prev) => ({ ...prev, sect }))} />
									</div>

									<div className="p-2">
										<ChartDatePicker
											// disabled={params.sect == "rt" ? true : false}
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

									<div className="py-2 w-100">
										<ChartIntervalSelector value={params.sect} onChange={(sect) => setParams((prev) => ({ ...prev, sect }))} />
									</div>

									<div className="pb-2">
										<ChartDatePicker
											// disabled={params.sect == "rt" ? true : false}
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
										<span style={{ color: responseColor }}>{dataResponse}</span>
									</div>
									<div className='d-inline-block' style={{animation:"spin 0.5s linear infinite",visibility: circle ? "visible" : "hidden"}}>
										<i className="fa fa-fw fa-circle-o-notch"></i>
									</div>
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
																{console.log(attrOptionList)}
																<Line
																	key={`${deviceName}:${record.value}`}
																	name={`${deviceName}:${record.label}`}
																	type="monotone"
																	dataKey={`${deviceName}:${record.value}`}
																	stroke={randomColor({ seed: deviceName + record.value })}
																	//stroke={record.label === "NH3" ? "black" : (record.label === "H2S" ? "red" : (record.label === "Odor" ? "blue" : "green"))}
																	dot={{ stroke: "red", strokeWidth: 0, r: 0, strokeDasharray: "" }}
																/>
															</>
														)
												)
											)}
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
