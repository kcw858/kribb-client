import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import CustomTable from "../../../../components/CustomTable";
import AccountStore from "../../../../store/global/AccountStore";
import CustomTinyAreaChart from "./CustomTinyAreaChart";
import { useTranslation } from "react-i18next";
import colors from "./../../../../colors";
import { distDir } from "../../../../../config";
import moment from "moment";
import MonitorStore from "../../../../store/global/MonitorStore";

// eslint-disable-next-line react/prop-types
export default function DeviceListTable({ data }) {
	//현재 시간을 가져온다.
	const nowTime = moment(moment().format("YYYY-MM-DD HH:mm:ss"));

	const [visible, setVisible] = useState(true);

	const { t } = useTranslation();
	const act = visible;
	const visibleChange = () => {
		setVisible(!visible);
	};
	let history = useHistory();
	useEffect(() => {}, [data]);

	return (
		<CustomTable
			columns={columns(t, visibleChange, act, nowTime)}
			data={visible ? data : []}
			paginationSize={10}
			onClickRow={(e, row) => {
				e.preventDefault();
				if (AccountStore.role == "super" || AccountStore.role == "admin") {
					history.push(`/dashboards/device/info/${row.id}`);
				}
			}}
			onClickAdd={(e) => {
				e.preventDefault();
				if (AccountStore.role == "super" || AccountStore.role == "admin") {
					history.push("/dashboards/device/add");
				}
			}}
			//1시간동안 데이터가 갱신되지 않으면 회색처리
			onLine={(row) => {
				const style = {};
				if (moment.duration(nowTime.diff(row.sensingDt)).asMinutes() > 60) {
					style.backgroundColor = "#f6f7fb";
					style.color = "#cbd5e0";
				} else {
					style.color = "#4a5568";
				}
				return style;
			}}
			style={{ backgroundColor: "#edf2f7" }}
		/>
	);
}

export const columns = (t, visibleChange, act, nowTime) => [
	//센서고장여부 표시
	{
		dataField: "id",
		text: "센서이상",
		align: "center",
		headerAlign: "center",
		hidden: true,
		sort: true,
		formatter: function format(cell, row) {
			//받아온 특정 센서 리스트의 값이 전부 0이면 고장으로 표시
			return (
				<>
					{row.nh3List.map((e) => Number(e)).filter((element) => 0 === element).length === 10 ? (
						<span>NH3고장</span>
					) : row.h2sList.map((e) => Number(e)).filter((element) => 0 === element).length === 10 ? (
						<span>H2S고장</span>
					) : row.vocList.map((e) => Number(e)).filter((element) => 0 === element).length === 10 ? (
						<span>VOC고장</span>
					) : row.co2List.map((e) => Number(e)).filter((element) => 0 === element).length === 10 ? (
						<span>CO2고장</span>
					) : row.indolList.map((e) => Number(e)).filter((element) => 0 === element).length === 10 ? (
						<span>INDOL고장</span>
					) : (
						<span></span>
					)}
				</>
			);
		},
	},
	//작동여부 표시 (마지막 불러온 데이터시간이 60분이 넘었을경우)
	{
		dataField: "sensingDt",
		text: "작동여부",
		align: "center",
		headerAlign: "center",
		hidden: true,
		sort: true,
		formatter: function format(cell) {
			if (moment.duration(nowTime.diff(cell)).asMinutes() < 60) {
				return (
					<>
						Online <i className="fa fa-fw fa-check-circle text-success"></i>
					</>
				);
			} else {
				return (
					<>
						Offline <i className="fa fa-fw fa-exclamation-circle text-danger"></i>
					</>
				);
			}
		},
	},
	{
		dataField: "status",
		text: t("status"),
		align: "center",
		hidden: true,
		headerAlign: "center",
		sort: true,
		style: { width: "8%" },
		headerStyle: { width: "8%" },
		formatter: function format(cell) {
			if (cell == "on") {
				return (
					<>
						Online <i className="fa fa-fw fa-check-circle text-success"></i>
					</>
				);
			} else {
				return (
					<>
						Offline <i className="fa fa-fw fa-exclamation-circle text-danger"></i>
					</>
				);
			}
		},
	},
	{
		dataField: "levelColor",
		text: t("levelColor"),
		align: "center",
		headerAlign: "center",
		sort: true,
		hidden: true,
		style: { width: "2%" },
		headerStyle: { width: "2%" },
		formatter: function format(cell) {
			return <i className={`fa fa -fw fa-circle`} style={{ color: cell }}></i>;
		},
	},
	{
		dataField: "depart",
		text: t("proprietor"),
		align: "center",
		headerAlign: "center",
		sort: true,
		style: { width: "10%" },
		headerStyle: { width: "10%" },
	},
	{
		dataField: "addr",
		text: t("emplacement"),
		align: "center",
		headerAlign: "center",
		sort: true,
		style: { width: "15%" },
		headerStyle: { width: "15%" },
	},
	{
		dataField: "name",
		text: t("deviceName"),
		align: "center",
		headerAlign: "center",
		sort: true,
		style: { width: "15%" },
		headerStyle: { width: "15%" },
	},
	{
		dataField: "nh3List",
		text: "NH3",
		align: "center",
		headerAlign: "center",
		sort: true,
		style: { minWidth: "150px" },
		headerStyle: { width: "150px" },
		formatter: function format(cell, row) {
			if (cell[0] == "-1") {
				return <></>;
			} else {
				return (
					<>
						{/* NH3: 0~10: level-0   11~20: level-1   21~30: level-2   31이상: level-3 */}
						{/* 데이터 받은 시간이 1시간이 지나지 않았으면 색상을 준다 */}
						<span
							style={{
								color:
									moment.duration(nowTime.diff(row.sensingDt)).asMinutes() > 60
										? ""
										: cell[0] <= 10
										? "rgb(11,207,11)"
										: cell[0] <= 20
										? "rgb(255,192,0)"
										: cell[0] <= 30
										? "rgb(255,124,42)"
										: "rgb(255,0,0)",
								fontWeight: "700",
							}}
						>
							{cell[0]}
						</span>
						{/* <CustomTinyAreaChart strokeColor={colors["purple"]} fillColor={colors["purple-02"]} data={cell} /> */}
						<CustomTinyAreaChart
							data={cell}
							fillColor={
								cell[0] <= 10 ? [11, 207, 11] : cell[0] <= 20 ? [255, 192, 0] : cell[0] <= 30 ? [255, 124, 42] : [255, 0, 0]
							}
							times={moment.duration(nowTime.diff(row.sensingDt)).asMinutes()}
						/>
					</>
				);
			}
		},
	},
	{
		dataField: "h2sList",
		text: "H2S",
		align: "center",
		headerAlign: "center",
		sort: true,
		style: { minWidth: "150px" },
		headerStyle: { width: "150px" },
		formatter: function format(cell, row) {
			if (cell[0] == "-1") {
				return <></>;
			} else {
				return (
					<>
						{/* N2S: 0~0.2: level-0   0.2~0.5: level-1   0.5~1: level-2   1이상: level-3 */}
						<span
							style={{
								color:
									moment.duration(nowTime.diff(row.sensingDt)).asMinutes() > 60
										? ""
										: cell[0] <= 0.2
										? "rgb(11,207,11)"
										: cell[0] <= 0.5
										? "rgb(255,192,0)"
										: cell[0] <= 1
										? "rgb(255,124,42)"
										: "rgb(255,0,0)",
								fontWeight: "700",
							}}
						>
							{cell[0]}
						</span>
						{/* <CustomTinyAreaChart strokeColor={colors["purple"]} fillColor={colors["purple-02"]} data={cell} /> */}
						<CustomTinyAreaChart
							data={cell}
							fillColor={
								cell[0] <= 0.2 ? [11, 207, 11] : cell[0] <= 0.5 ? [255, 192, 0] : cell[0] <= 1 ? [255, 124, 42] : [255, 0, 0]
							}
							times={moment.duration(nowTime.diff(row.sensingDt)).asMinutes()}
						/>
					</>
				);
			}
		},
	},
	{
		dataField: "co2List",
		text: "CO2",
		align: "center",
		headerAlign: "center",
		sort: true,
		style: { minWidth: "150px" },
		headerStyle: { width: "150px" },
		formatter: function format(cell, row) {
			if (cell[0] == "-1") {
				return <></>;
			} else {
				return (
					<>
						{/* CO2: 0~10: level-0   11~20: level-1   21~30: level-2   31이상: level-3 */}
						<span
							style={{
								color:
									moment.duration(nowTime.diff(row.sensingDt)).asMinutes() > 60
										? ""
										: cell[0] <= 10
										? "rgb(11,207,11)"
										: cell[0] <= 20
										? "rgb(255,192,0)"
										: cell[0] <= 30
										? "rgb(255,124,42)"
										: "rgb(255,0,0)",
								fontWeight: "700",
							}}
						>
							{cell[0]}
						</span>
						{/* <CustomTinyAreaChart strokeColor={colors["purple"]} fillColor={colors["purple-02"]} data={cell} /> */}
						<CustomTinyAreaChart
							data={cell}
							fillColor={
								cell[0] <= 10 ? [11, 207, 11] : cell[0] <= 20 ? [255, 192, 0] : cell[0] <= 30 ? [255, 124, 42] : [255, 0, 0]
							}
							times={moment.duration(nowTime.diff(row.sensingDt)).asMinutes()}
						/>
					</>
				);
			}
		},
	},
	{
		dataField: "vocList",
		text: "ACID",
		align: "center",
		headerAlign: "center",
		sort: true,
		style: { minWidth: "150px" },
		headerStyle: { width: "150px" },
		formatter: function format(cell, row) {
			if (cell[0] == "-1") {
				return <></>;
			} else {
				return (
					<>
						{/* ACID: 0~0.2: level-0   0.2~0.5: level-1   0.5~1: level-2   1이상: level-3 */}
						<span
							style={{
								color:
									moment.duration(nowTime.diff(row.sensingDt)).asMinutes() > 60
										? ""
										: cell[0] <= 0.2
										? "rgb(11,207,11)"
										: cell[0] <= 0.5
										? "rgb(255,192,0)"
										: cell[0] <= 1
										? "rgb(255,124,42)"
										: "rgb(255,0,0)",
								fontWeight: "700",
							}}
						>
							{cell[0]}
						</span>
						{/* <CustomTinyAreaChart strokeColor={colors["purple"]} fillColor={colors["purple-02"]} data={cell} /> */}
						<CustomTinyAreaChart
							data={cell}
							fillColor={
								cell[0] <= 0.2 ? [11, 207, 11] : cell[0] <= 0.5 ? [255, 192, 0] : cell[0] <= 1 ? [255, 124, 42] : [255, 0, 0]
							}
							times={moment.duration(nowTime.diff(row.sensingDt)).asMinutes()}
						/>
					</>
				);
			}
		},
	},
	{
		dataField: "odorList",
		text: "INDOLES",
		align: "center",
		headerAlign: "center",
		sort: true,
		style: { minWidth: "150px" },
		headerStyle: { width: "150px" },
		formatter: function format(cell, row) {
			if (cell[0] == "-1") {
				return <></>;
			} else {
				return (
					<>
						{/* INDOLES: 0~1: level-0   2~5: level-1   6~10: level-2   10이상: level-3 */}
						<span
							style={{
								color:
									moment.duration(nowTime.diff(row.sensingDt)).asMinutes() > 60
										? ""
										: cell[0] <= 1
										? "rgb(11,207,11)"
										: cell[0] <= 5
										? "rgb(255,192,0)"
										: cell[0] <= 10
										? "rgb(255,124,42)"
										: "rgb(255,0,0)",
								fontWeight: "700",
							}}
						>
							{cell[0]}
						</span>
						{/* <CustomTinyAreaChart strokeColor={colors["purple"]} fillColor={colors["purple-02"]} data={cell} /> */}
						<CustomTinyAreaChart
							data={cell}
							fillColor={
								cell[0] <= 1
									? "rgb(11,207,11)"
									: cell[0] <= 5
									? "rgb(255,192,0)"
									: cell[0] <= 10
									? "rgb(255,124,42)"
									: "rgb(255,0,0)"
							}
							times={moment.duration(nowTime.diff(row.sensingDt)).asMinutes()}
						/>
					</>
				);
			}
		},
	},
	{
		dataField: "ListButton",
		//장비목록 숨김버튼
		text: (
			<button onClick={visibleChange} style={{ border: "none", backgroundColor: "#edf2f7", color: "#718096" }}>
				{act ? <i className="fa fa-fw fa-chevron-down" /> : <i className="fa fa-fw fa-chevron-up" />}
			</button>
		),
		align: "right",
		headerAlign: "right",
		style: { width: "2%" },
		headerStyle: { width: "2%" },
		sort: false,
	},
	// {
	// 	dataField: "odorList",
	// 	text: "Odor",
	// 	align: "center",
	// 	headerAlign: "center",
	// 	sort: true,
	// 	style: {
	// 		minWidth: "150px",
	// 	},
	// 	formatter: function format(cell, row) {
	// 		return (
	// 			<>
	// 				{cell[0]}
	// 				{/* <CustomTinyAreaChart strokeColor={colors["success"]} fillColor={colors["success-02"]} data={cell} /> */}
	// 				<CustomTinyAreaChart data={cell} />
	// 			</>
	// 		);
	// 	},
	// },
];
