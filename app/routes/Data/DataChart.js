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
import _, { set } from "lodash";
import AttrSelector, { getAttrOptionList } from "./components/AttrSelector";
import randomColor from "randomcolor";
import MonitorStore from "../../store/global/MonitorStore";
import DeviceSelector from "./components/DeviceSelector";
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import { useTranslation } from "react-i18next";
import { object } from "prop-types";
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

export default function DataChart() {
	const { t } = useTranslation();
	const dataStore = new DataStore();

	const [attrOptionList, setAttrOptionList] = useState([]);

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
	let initDeviceId = MonitorStore.monitorInfoList[0]?.id ? [] : [];
	if (window["mode"] == "tablet") {
		initDeviceId = window["deviceid"] ? [] : [];
	}

	const [params, setParams] = useState({
		deviceid: initDeviceId,
		sect: "rt",
		arith: "avg",
		fromDate: minFromDate,
		toDate: maxToDate,
		limit: 1000,
	});

	const [circle, setCircle] = useState(false);
	const [dataResponse, setDataResponse] = useState("");
	const [responseColor, setResponseColor] = useState("");
	const [bgColor, setBgColor] = useState("");
	const getData = async () => {
		if (_.isEmpty(params.deviceid)) {
			return;
		}
		let response = await dataStore.getDataList(params);
		let data = response.data;
		if (_.isEmpty(attrOptionList)) {
			// let attrOptionList = getAttrOptionList(data);
			// setAttrOptionList([attrOptionList]);
			setAttrOptionList([
				{ label: "NH3", value: "nH3" },
				{ label: "H2S", value: "h2S" },
				{ label: "INDOLES", value: "odor" },
				{ label: "ACID", value: "voc" },
			]);
			setAttrList(attrList);
		}
		let chartData = {};
		//h2s의 데이터가 넘어오지않으면 데이터가 없는걸로 판단
		data[0].h2S.length === 0
			? (setDataResponse("데이터가 없거나 불러올 수 없습니다."), setResponseColor("red"), setBgColor(""), setCircle(false))
			: (setDataResponse(""), setBgColor("#44a3ec"), setCircle(false));
		for (let deviceData of data) {
			for (let attrKey in deviceData) {
				if (_.isArray(deviceData[attrKey])) {
					for (let index in deviceData[attrKey]) {
						let rawData = deviceData[attrKey][index];
						chartData[rawData.x] = chartData[rawData.x] || { date: rawData.x };
						chartData[rawData.x][attrKey] = Number(rawData.y === "-1" ? "-" : rawData.y);
					}
				}
			}
		}
		setData(_.values(chartData));
	};

	// let intervalId;
	// useEffect(() => {
	// 	getData();

	// 	// clearInterval(intervalId);
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
	// }, [params, attrOptionList]);

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
				<HeaderMain title={t("chartsTitle")} />
			</div>

			{window["mode"] != "tablet" && (
				<div className="row">
					<div className="col">
						<div className="card mb-2">
							<MediaQuery minWidth={446}>
								<div className="card-body m-2">
									<DeviceSelector
										value={params.deviceid}
										onChange={(deviceid) => setParams((prev) => ({ ...prev, deviceid: [deviceid] }))}
									/>
								</div>
							</MediaQuery>
							<MediaQuery maxWidth={445}>
								<div className="card-body card-body2">
									<DeviceSelector
										value={params.deviceid}
										onChange={(deviceid) => setParams((prev) => ({ ...prev, deviceid: [deviceid] }))}
									/>
								</div>
							</MediaQuery>
						</div>
					</div>
				</div>
			)}

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

									{window["mode"] == "desktop" && (
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
									)}
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

									{window["mode"] == "desktop" && (
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
									)}
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
											<ReferenceLine y={0} />
											<Brush dataKey="name" height={15} stroke="#8884d8" />
											<CartesianGrid stroke="none" strokeDasharray="5 5" />
											{attrOptionList.map(
												(record) =>
													_.findIndex(attrList, ["value", record.value]) !== -1 && (
														// data.find(e =>(e.voc !== -1))
														<Line
															key={record.value}
															name={record.label}
															type="monotone"
															dataKey={record.value}
															// stroke={randomColor({ seed: record.value })}
															//NH3:검정 H2S:빨강 Odor:파랑 voc:녹색
															stroke={
																record.label === "NH3"
																	? "black"
																	: record.label === "H2S"
																	? "red"
																	: record.label === "INDOLES"
																	? "blue"
																	: "green"
															}
															dot={{ stroke: "red", strokeWidth: 0, r: 0, strokeDasharray: "" }}
														/>
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
