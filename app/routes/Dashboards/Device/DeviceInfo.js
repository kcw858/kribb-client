import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import AccountStore from "../../../store/global/AccountStore";
import MonitorStore from "../../../store/global/MonitorStore";
import DeviceStore from "../../../store/local/DeviceStore";
import { directionToDegree } from "../../../utilities";
import { HeaderMain } from "../../components/HeaderMain";
import CustomGuage from "./components/CustomGuage";
import CustomWeather from "./components/CustomWeather";
import { useTranslation } from "react-i18next";
import JtronController from "./components/JtronController";
import InsysController from "./components/InsysController";
import { LogoThemed } from "../../components/LogoThemed/LogoThemed";
import CustomTinyAreaChart from "./components/CustomTinyAreaChart";
import SensorTable from "../../Product/components/AttribsTable";
import { SwitchInput } from "../../../components/Form";
import MediaQuery from "react-responsive";

export default observer(function DeviceInfo() {
	const tdHeader = { backgroundColor: "#edf2f7", color: "#4a5568" };
	const { t } = useTranslation();
	const history = useHistory();

	/**@type [import("../../../store/local/DeviceStore").device, any] data */
	const [device, setDevice] = useState(null);

	/**@type [import("../../../store/global/MonitorStore").productInfo, any] data */
	const [productInfo, setProductInfo] = useState(null);

	/**@type {{id?: string}} */
	let { id } = useParams();
	id = decodeURIComponent(id);

	const deviceStore = new DeviceStore();
	const monitorInfo = _.find(MonitorStore.monitorInfoList, ["id", id]);

	let deleteDevice = useCallback(async () => {
		if (!confirm(t("deleteConfirmDescription"))) {
			return;
		}

		let result = await deviceStore.removeDevice(id);

		// 삭제되었으면 이전 페이지로: 삭제 알림을 받는 건 3초후임(3초마다 폴링하므로)
		if (result.status != 200) {
			return;
		}

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/dashboards/device");
		}

		alert(t("alertRemoved"));
	}, []);

	useEffect(() => {
		const action = async () => {
			let productResponse = await MonitorStore.getProductInfo(monitorInfo.productid);
			let deviceResponse = await deviceStore.getDeviceInfo(id);

			setProductInfo(productResponse.data);
			setDevice(deviceResponse.data);
		};

		monitorInfo && action();
	}, [id, monitorInfo]);

	if (!device || !productInfo) {
		return <></>;
	}

	let sensors = {};
	//  console.log(productInfo.attribs);
	//productInfo.attribs에서 장비의 값을 record에 넣는다.
	for (let record of productInfo.attribs) {
		let alias = record.alias.toLowerCase();
		//console.log(alias);
		if (["nh3", "h2s", "co2", "voc", "indol", "odor"].indexOf(alias) === -1) {
			continue;
		}

		sensors[alias] = {
			value: monitorInfo[`${alias}List`],
			name: record.name,
			min: record.min,
			max: record.max,
			threshold: record.threshold || 0,
			chemiunit: record.chemiunit || "",
		};
	}
	// 우리 장비에서는 복합악취(odor) 센서는 다루지 않음.
	// if (productInfo.company == "insys") {
	// 	delete sensors["odor"];
	// }

	const getRandom = (min, max) => Math.random() * (max - min) + min;

	return (
		<div className="container-fluid">
			{window.mode == "desktop" && (
				<div className="d-md-flex justify-content-between" style={{ margin: "0 10px" }}>
					<div className="row ml-0 title-mb">
						<HeaderMain title={t("deviceInfo")} />
					</div>
					<div>
						<CustomWeather
							temperature={Number(monitorInfo.temperature)}
							humidity={Number(monitorInfo.humidity)}
							windDegree={directionToDegree(monitorInfo.winddirect)}
							windSpeed={Number(monitorInfo.windspeed)}
						/>
					</div>
				</div>
			)}

			{/* <div className="row">
				{window.mode == "tablet" && (
					<div className="col-lg-5 col-0">
						<LogoThemed />
					</div>
				)}
				<div className={`${window.mode == "tablet" ? "" : "offset-lg-5"} col-lg-7 col-12`}>
					<CustomWeather
						temperature={Number(monitorInfo.temperature)}
						humidity={Number(monitorInfo.humidity)}
						windDegree={directionToDegree(monitorInfo.winddirect)}
						windSpeed={Number(monitorInfo.windspeed)}
					/>
				</div>
			</div> */}

			{/* 갤럭시 A-32 폭(73.6mm) 기준 한줄에 2개 카드씩 배치 */}
			<div className="row mb-2">
				{/* <div className="col-3 mb-3" style={{ minWidth: "175px", maxWidth: "175px", paddingRight: "10px", paddingLeft: "10px" }}>
					<CustomWeather
						temperature={Number(monitorInfo.temperature)}
						humidity={Number(monitorInfo.humidity)}
						windDegree={directionToDegree(monitorInfo.winddirect)}
						windSpeed={Number(monitorInfo.windspeed)}
					/>
				</div> */}

				{_.values(sensors).map((sensor) => (
					<div key={sensor.alias} className="col-lg-3 col-md-6 col-sm-12 device-card">
						{
							//넘어오는 값이 아예 없거나 -1값이면 표시하지 않는다.
							sensor.value.length === 0 || sensor.value.includes("-1") ? null : (
								<>
									{/* <CustomGuage
										title={sensor.name}
										min={Number(sensor.min)}
										max={Number(sensor.max)}
										value={sensor.value}
										threshold={Number(sensor.threshold)}
										unit={sensor.chemiunit}
								/> */}

									<div className="device-area-charts-box">
										<CustomTinyAreaChart
											title={sensor.name === "Odor" ? "INDOLES" : sensor.name === "VOC" ? "ACID" : sensor.name}
											data={sensor.value}
											showData={sensor.value[sensor.value.length - 1]}
											productInfo={device.id}
										/>
									</div>
								</>
							)
						}
					</div>
				))}
			</div>

			{/* 일반회원이 아니면 표시 */}
			{AccountStore.role != "user" && (
				<div className="row mb-4">
					<MediaQuery minWidth={768}>
						<div className="col" style={{ padding: "0px 10px" }}>
							<div className="btn-group col-12" style={{ padding: 0, height: "50px" }} role="group" aria-label="Basic example">
								<div style={{ maxWidth: "850px", width: "100%" }}>
									{productInfo.company == "jtron" && <JtronController manufacturer={productInfo.company} id={id} />}
									{productInfo.company == "insys" && <InsysController manufacturer={productInfo.company} id={id} />}
								</div>
								{window.mode == "desktop" && (
									<>
										<div className="pl-2" style={{ width: "27.5%" }}>
											<button
												type="button"
												className="btn btn-danger w-100 h-100"
												onClick={deleteDevice}
												style={{ borderRadius: "0.2rem" }}
											>
												{t("delete")}
											</button>
										</div>
										<div className="pl-2" style={{ width: "27.5%" }}>
											<Link
												to={`/dashboards/device/edit/${id}`}
												className="btn btn-cancel w-100 h-100"
												style={{ borderRadius: "0.2rem" }}
											>
												<div className="h-100 pt-2">{t("edit")}</div>
											</Link>
										</div>
									</>
								)}
							</div>
						</div>
					</MediaQuery>
					<MediaQuery maxWidth={767}>
						<div className="col" style={{ padding: "0px 10px 60px 10px" }}>
							<div
								className="btn-group device-info-btn"
								style={{ padding: 0, height: "50px" }}
								role="group"
								aria-label="Basic example"
							>
								<div>
									{productInfo.company == "jtron" && <JtronController manufacturer={productInfo.company} id={id} />}
									{productInfo.company == "insys" && <InsysController manufacturer={productInfo.company} id={id} />}
								</div>
								<div className="mt-2">
									{window.mode == "desktop" && (
										<div className="device-info-second-btn">
											<button
												type="button"
												className="btn btn-danger"
												onClick={deleteDevice}
												style={{ borderRadius: "0.2rem", width: "49%", height: "50px" }}
											>
												{t("delete")}
											</button>
											<Link
												to={`/dashboards/device/edit/${id}`}
												className="btn btn-cancel"
												style={{ borderRadius: "0.2rem", width: "49%", height: "50px" }}
											>
												<div className="pt-2">{t("edit")}</div>
											</Link>
										</div>
									)}
								</div>
							</div>
						</div>
					</MediaQuery>
				</div>
			)}

			<div className="row mb-1">
				<div className="col d-lg-none" style={{ padding: "0px 10px 0px 10px" }}>
					{/* <table className="table table-bordered bg-white"> */}
					<table className="table table-hover" style={{ borderColor: "#E2E8f0 !important" }}>
						<tbody>
							<tr>
								<td className="border-right" style={tdHeader}>
									{t("deviceName")}
								</td>
								<td className="pl-4">{device.name}</td>
							</tr>
							<tr>
								<td className="border-right" style={tdHeader}>
									{t("productName")}
								</td>
								<td className="pl-4">{monitorInfo.productName}</td>
							</tr>
							<tr>
								<td className="border-right" style={tdHeader}>
									{t("status")}
								</td>
								<td className="pl-4">
									{device.status === "on" ? (
										<div className="custom-control custom-switch">
											<input type="checkbox" className="custom-control-input" checked />
											<label className="custom-control-label" />
										</div>
									) : (
										<div className="custom-control custom-switch">
											<input type="checkbox" className="custom-control-input" />
											<label className="custom-control-label" />
										</div>
									)}
								</td>
							</tr>
							<tr>
								<td className="border-right" style={tdHeader}>
									ID
								</td>
								<td className="pl-4">{device.id}</td>
							</tr>
							<tr>
								<td className="border-right" style={tdHeader}>
									{t("proprietor")}
								</td>
								<td className="pl-4">{device.depart}</td>
							</tr>
							<tr>
								<td className="border-right" style={tdHeader}>
									{t("emplacement")}
								</td>
								<td className="pl-4">{device.addr}</td>
							</tr>
							<tr>
								<td className="border-right" style={tdHeader}>
									{t("memo")}
								</td>
								<td className="pl-4">{device.memo}</td>
							</tr>
							<tr>
								<td className="border-right" style={tdHeader}>
									Firmware Version
								</td>
								<td className="pl-4">{device.firmware}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col d-none d-lg-block" style={{ padding: "0px 10px 0px 10px" }}>
					<table className="table table-hover" style={{ borderColor: "#E2E8f0 !important" }}>
						<tbody>
							<tr>
								<td className="border-right" style={{ backgroundColor: "#edf2f7", width: "20%", color: "#718096" }}>
									{t("deviceName")}
								</td>
								<td className="pl-4 border-right" style={{ width: "30%" }}>
									{device.name}
								</td>
								<td className="border-right" style={{ backgroundColor: "#edf2f7", width: "20%", color: "#718096" }}>
									{t("productName")}
								</td>
								<td className="pl-4" style={{ width: "30%" }}>
									{monitorInfo.productName}
								</td>
							</tr>
							<tr>
								<td className="border-right" style={tdHeader}>
									{t("status")}
								</td>
								<td className="pl-4 border-right">
									{device.status === "on" ? (
										<div className="custom-control custom-switch">
											<input type="checkbox" className="custom-control-input" checked />
											<label className="custom-control-label" />
										</div>
									) : (
										<div className="custom-control custom-switch">
											<input type="checkbox" className="custom-control-input" />
											<label className="custom-control-label" />
										</div>
									)}
								</td>
								<td className="border-right" style={tdHeader}>
									ID
								</td>
								<td className="pl-4">{device.id}</td>
							</tr>
							<tr>
								<td className="border-right" style={tdHeader}>
									{t("proprietor")}
								</td>
								<td className="pl-4 border-right">{device.depart}</td>
								<td className="border-right" style={tdHeader}>
									{t("emplacement")}
								</td>
								<td className="pl-4">{device.addr}</td>
							</tr>
							<tr>
								<td className="border-right" style={tdHeader}>
									{t("memo")}
								</td>
								<td className="pl-4 border-right">{device.memo}</td>
								<td className="border-right" style={tdHeader}>
									Firmware Version
								</td>
								<td className="pl-4">{device.firmware}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
});
