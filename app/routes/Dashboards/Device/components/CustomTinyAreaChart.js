import React from "react";
import PropTypes, { any } from "prop-types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "../../../../components/recharts";

import colors from "./../../../../colors";
import RadialChart from "./Radialchart";
import ReactApexChart from "react-apexcharts";
import MonitorStore from "../../../../store/global/MonitorStore";
import MediaQuery from "react-responsive";
import { propTypes } from "@elsdoerfer/react-arrow";

export default function CustomTinyAreaChart({ strokeColor, fillColor, data, title, showData, productInfo, times }) {
	let chartData = [];
	// for (let record of data) {
	// 	chartData.push({ pv: record });
	// }

	const date = MonitorStore.monitorInfoList.filter((e) => e.id === productInfo).map((e) => e.sensingDtList);
	for (let i = 0; i < data.length; i++) {
		chartData.push({ pv: data[i] < 0 ? 0 : data[i], date: date[0] ? (date[0][i] = date[0][i].replace("T", " ")) : "" });
	}

	const state = {
		series: [showData],
		options: {
			title: {
				text: "현재현황",
				align: "center",
				offsetY: matchMedia("screen and (max-width: 280px)").matches
					? 30
					: matchMedia("screen and (max-width: 370px)").matches
					? 36
					: 42,
				style: {
					color: "#718096",
					fontWeight: 600,
					fontSize: "14px",
				},
			},
			states: {
				normal: {
					filter: {
						type: "none",
						value: 0,
					},
				},
				hover: {
					filter: {
						type: "darken",
						value: 1,
					},
				},
				active: {
					allowMultipleDataPointsSelection: false,
					filter: {
						type: "darken",
						value: 1,
					},
				},
			},
			chart: {
				type: "radialBar",
				sparkline: {
					enabled: true,
				},
				offsetY: -14,
			},
			plotOptions: {
				radialBar: {
					startAngle: -90,
					endAngle: 92,
					track: {
						background: "#e2e8f0",
						strokeWidth: "97%",
						margin: 5, // margin is in pixels
						// dropShadow: {
						// 	enabled: true,
						// 	top: 2,
						// 	left: 0,
						// 	color: "#999",
						// 	opacity: 1,
						// 	blur: 2,
						// },
					},
					dataLabels: {
						name: {
							show: true,
						},
						value: {
							formatter: function (val) {
								return val;
							},
							offsetY: -34,
						},
					},
				},
			},
			grid: {
				padding: {
					top: 0,
				},
			},
			labels: title === "ACID" ? ["mA"] : title === "INDOLES" ? ["mA"] : ["ppm"],
		},
	};

	return (
		<>
			{title ? (
				<>
					<div id="chart" className="pb-1" style={{ width: "100%", padding: "0 15px" }}>
						<div
							style={{
								left: 30,
								top: 12,
								position: "absolute",
								zIndex: 100,
								fontWeight: 500,
								fontSize: "17px",
								color: "#4A5568",
							}}
						>
							{title}
						</div>
						<MediaQuery minWidth={1601}>
							<div style={{ height: "3px" }}></div>
							<ReactApexChart options={state.options} series={state.series} type="radialBar" height={415} />
						</MediaQuery>
						<MediaQuery minWidth={769} maxWidth={1600}>
							<div style={{ height: "10px" }}></div>
							<ReactApexChart options={state.options} series={state.series} type="radialBar" height={400} />
						</MediaQuery>
						<MediaQuery minWidth={371} maxWidth={768}>
							<div style={{ height: "18px" }}></div>
							<ReactApexChart options={state.options} series={state.series} type="radialBar" height={380} />
						</MediaQuery>
						<MediaQuery minWidth={281} maxWidth={370}>
							<div style={{ height: "18px" }}></div>
							<ReactApexChart options={state.options} series={state.series} type="radialBar" height={330} />
						</MediaQuery>
						<MediaQuery maxWidth={280}>
							<div style={{ height: "35px" }}></div>
							<ReactApexChart options={state.options} series={state.series} type="radialBar" height={270} />
						</MediaQuery>
					</div>
					<div className="text-center fw-600" style={{ margin: "10px 0", fontSize: "14px", color: "#718096" }}>
						최근현황
					</div>
					<div className="pb-2" style={{ width: "100%", padding: "0 12px" }}>
						<ResponsiveContainer height={130}>
							<AreaChart data={chartData}>
								<XAxis hide dataKey="date" />
								<YAxis hide />
								<Tooltip />
								{/* <Area dataKey="pv" stroke={strokeColor} fill={fillColor} /> */}
								<Area dataKey="pv" stroke="#6aade0" fill="rgba(106,173,224,0.3)" />
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</>
			) : (
				<>
					<ResponsiveContainer height={50}>
						<AreaChart data={chartData}>
							{/* <Area dataKey="pv" stroke={strokeColor} fill={fillColor} /> */}
							<Area
								dataKey="pv"
								stroke={times < 60 ? `rgb(${fillColor[0]},${fillColor[1]},${fillColor[2]})` : "#cbd5e0"}
								fill={times < 60 ? `rgba(${fillColor[0]},${fillColor[1]},${fillColor[2]},0.25)` : "rgba(203,213,224,0.25)"}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</>
			)}
		</>
	);
}

CustomTinyAreaChart.propTypes = {
	strokeColor: PropTypes.string,
	fillColor: any,
	data: PropTypes.array,
};

CustomTinyAreaChart.defaultProps = {
	strokeColor: colors["primary"],
	fillColor: colors["primary-04"],
};
