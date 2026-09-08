/* eslint-disable react/prop-types */
import React from "react";
import { CardHeader, Table, Accordion } from "../../../../components";
import { Card } from "../../../../components/Card/Card";
import Arrow from "@elsdoerfer/react-arrow";
import { directionToDegree } from "../../../../utilities";
import { getOdorLevelColor } from "./OdorColorLegend";
import { useTranslation } from "react-i18next";
import AccountStore from "../../../../store/global/AccountStore";

/**
 *
 * @param {{record: import("../../../../store/global/MonitorStore").monitorInfo, value: number, showOverlay: boolean, isAdmin: boolean}} props
 */
export default function MarkerInfoBox({ record, value, showOverlay, isAdmin }) {
	const { t } = useTranslation();

	let windDegree = directionToDegree(record.winddirect);

	// let isVisible = showOverlay;
	// if (window["mode"] == "desktop") {
	// 	isVisible = record.level >= 3 || record.status != "on" ? true : isVisible;
	// }

	return (
		//모니터링 우측 표
		<div className={"mr-2 ml-2 mb-3"} style={{minWidth:200, maxWidth:200}}>
			<Accordion 
				className="mb-2" 
				style={{border: `1px solid ${record.levelColor}`}} 
				initialOpen={record.level<0?true:false}
			>
			{/* <Accordion className="mb-2" style={{border: `1px solid ${record.levelColor}`}}> */}
				<Accordion.Header 
					className="d-flex h6 bg-boxheader" 
				>
					<span className="text-black text-ellipsis">{record.depart}</span>
					<Accordion.Indicator className="ml-auto text-black"/>
				</Accordion.Header>
				<Accordion.Body className="pl-0 pr-0 pb-0">
					<div className={`collapse ${showOverlay ? "show" : ""}`}>
						<Card className="mb-0">
							<CardHeader 
								tag="h6" 
								className="font-black-bold" 
								style={{ color: record.levelColor, paddingLeft: "10px" }}
							>
								<div className="row">
									<div className="col-8 text-ellipsis">
									{isAdmin && !AccountStore.isLock() ? (
										<a 
											href={`javascript: window.reactHistory.push("/dashboards/device/info/${record.id}");`}
											style={{ color: record.levelColor }}>
											{record.name}
										</a>
									): record.name}
									</div>
									<div className="col-4 text-right" style={{paddingRight: "5px"}}>
										{record.status == "on" ? (
											<i className="fa fa-fw fa-check-circle-o" style={{ color: "green" }} />
										) : (
											<i className="fa fa-fw fa-exclamation-circle" style={{ color: "red" }} />
										)}
										&nbsp;
										{record.alert == "on" ? (
											<i className="fa fa-fw fa-bell" style={{ color: "red" }} />
										) : (
											<i className="fa fa-fw fa-bell-o" style={{ color: "green" }} />
										)}
									</div>
								</div>
							</CardHeader>
								
							<div className="p-1">
								<Table className="mb-0 table-borderless text-black">
									<tbody>
										{record.company != "insys" && (
											<>
												<tr>
													<td className="p-0 pl-2">{t("odor")}</td>
													<td className="p-0 pl-2">{record.odor}</td>
													<td className="border-bottom align-middle" rowSpan={3}>
														<button
															style={{ backgroundColor: record.levelColor, width: "100%" }}
															className="btn btn-sm text-light"
														>
															{value || 0}
														</button>
													</td>
												</tr>
												<tr>
													<td className="p-0 pl-2">{t("dilutionFactor")}</td>
													<td className="p-0 pl-2">{record.silution}</td>
												</tr>
												<tr>
													<td className="border-bottom p-0 pb-1 pl-2">{t("odorIntensity")}</td>
													<td className="border-bottom p-0 pb-1 pl-2">{record.solidity}</td>
												</tr>
											</>
										)}
										<tr>
											<td className="p-0 pt-1 pl-2">NH3</td>
											<td className="p-0 pt-1 pl-2">{record.nh3}</td>
											{record.company != "insys" && (
												<td className="align-middle" rowSpan={3}>
													{isAdmin && !AccountStore.isLock() && (
														<a
															href={`javascript: window.WsApi.sample("${AccountStore.userid}", "${record.id}")`}
															style={{ width: "100%" }}
															className="btn btn-sm btn-primary text-light"
														>
															{t("capture")}
														</a>
													)}
												</td>
											)}
										</tr>
										<tr>
											<td className="p-0 pl-2">H2S</td>
											<td className="p-0 pl-2">{record.h2s}</td>
										</tr>
										<tr>
											<td className="p-0 pl-2">CO2</td>
											<td className="p-0 pl-2">{record.co2}</td>
										</tr>
										<tr>
											<td className="p-0 pl-2">VOC</td>
											<td className="p-0 pl-2">{record.voc}</td>
										</tr>
										<tr>
											<td className="p-0 pl-2">Indol</td>
											<td className="p-0 pl-2">{record.indol}</td>
										</tr>
									</tbody>
								</Table>
							</div>
							<div className="container text-black mt-4">
								<div className="row">
									<div className="col-3 pl-0 pr-0 pt-1 border-top text-center">
										<Arrow
											// @ts-ignore
											angle={windDegree}
											lineWidth={1.4}
											length={20}
											color={"black"}
											style={{
												width: "25px",
												height: "25px",
											}}
										/>
									</div>
									<div className="col-3 pl-0 pr-0 pt-1 border-top border-left text-center align-middle">{record.windspeed}m/s</div>
									<div className="col-3 pl-0 pr-0 pt-1 border-top border-left text-center align-middle">{record.temperature}℃</div>
									<div className="col-3 pl-0 pr-0 pt-1 border-top border-left text-center align-middle">{record.humidity}%</div>
								</div>
							</div>
						</Card>
					</div>
				</Accordion.Body>
			</Accordion>

			{/* <i
				style={{
					color: getOdorLevelColor(record.silution),
					fontSize: "30px",
				}}
				className="fa fa-fw fa-map-marker"
			/> */}

			{/* {isVisible && ( */}
				{/* <div
					className="accordion"
					style={{
						// zIndex: 100,
						// position: "absolute",
						// bottom: 40,
						// right: -80,
						// width: "100px",
						border: `1px solid ${record.levelColor}`,
					}}
				>
					<CardHeader className="d-flex h6 text-white bg-secondary justify-content-between" style={{backgroundColor: `${record.levelColor}`}}>
						<span>{record.depart}</span>
						<i className="fa fa-fw fa-plus" style={{paddingTop: 2}}></i>
					</CardHeader>
					<div className={`collapse ${showOverlay ? "show" : ""}`}>
						<Card className="mb-0">
							<CardHeader tag="h6" className="font-weight-bold" style={{ color: record.levelColor }}>
								<div className="row">
									<div className="col-6">
									{isAdmin && !AccountStore.isLock() ? (
										<a 
											href={`javascript: window.reactHistory.push("/dashboards/device/info/${record.id}");`}
											style={{ color: record.levelColor }}>
											{record.name}
										</a>
									): record.name}
									</div>
									<div className="col-6 text-right">
										{record.status == "on" ? (
											<i className="fa fa-fw fa-check-circle-o" style={{ color: "green" }} />
										) : (
											<i className="fa fa-fw fa-exclamation-circle" style={{ color: "red" }} />
										)}
										&nbsp;
										{record.alert == "on" ? (
											<i className="fa fa-fw fa-bell" style={{ color: "red" }} />
										) : (
											<i className="fa fa-fw fa-bell-o" style={{ color: "green" }} />
										)}
									</div>
								</div>
							</CardHeader>
								
							<div className="p-1">
								<Table className="mb-0 table-borderless">
									<tbody>
										{record.company != "insys" && (
											<>
												<tr>
													<td className="p-0 pl-2">{t("odor")}</td>
													<td className="p-0 pl-2">{record.odor}</td>
													<td className="border-bottom align-middle" rowSpan={3}>
														<button
															style={{ backgroundColor: record.levelColor, width: "100%" }}
															className="btn btn-sm text-light"
														>
															{value || 0}
														</button>
													</td>
												</tr>
												<tr>
													<td className="p-0 pl-2">{t("dilutionFactor")}</td>
													<td className="p-0 pl-2">{record.silution}</td>
												</tr>
												<tr>
													<td className="border-bottom p-0 pb-1 pl-2">{t("odorIntensity")}</td>
													<td className="border-bottom p-0 pb-1 pl-2">{record.solidity}</td>
												</tr>
											</>
										)}
										<tr>
											<td className="p-0 pt-1 pl-2">NH3</td>
											<td className="p-0 pt-1 pl-2">{record.nh3}</td>
											{record.company != "insys" && (
												<td className="align-middle" rowSpan={3}>
													{isAdmin && !AccountStore.isLock() && (
														<a
															href={`javascript: window.WsApi.sample("${AccountStore.userid}", "${record.id}")`}
															style={{ width: "100%" }}
															className="btn btn-sm btn-primary text-light"
														>
															{t("capture")}
														</a>
													)}
												</td>
											)}
										</tr>
										<tr>
											<td className="p-0 pl-2">H2S</td>
											<td className="p-0 pl-2">{record.h2s}</td>
										</tr>
										<tr>
											<td className="p-0 pl-2">CO2</td>
											<td className="p-0 pl-2">{record.co2}</td>
										</tr>
										<tr>
											<td className="p-0 pl-2">VOC</td>
											<td className="p-0 pl-2">{record.voc}</td>
										</tr>
										<tr>
											<td className="p-0 pl-2">Indol</td>
											<td className="p-0 pl-2">{record.indol}</td>
										</tr>
									</tbody>
								</Table>
							</div>
							<div className="container">
								<div className="row">
									<div className="col-3 p-0 pt-1 pb-1 border text-center">
										<Arrow
											// @ts-ignore
											angle={windDegree}
											lineWidth={1.4}
											length={20}
											style={{
												width: "25px",
												height: "25px",
											}}
										/>
									</div>
									<div className="col-3 p-0 pt-1 pb-1 border text-center align-middle">{record.windspeed}m/s</div>
									<div className="col-3 p-0 pt-1 pb-1 border text-center align-middle">{record.temperature}℃</div>
									<div className="col-3 p-0 pt-1 pb-1 border text-center align-middle">{record.humidity}%</div>
								</div>
							</div>
						</Card>
					</div>
				</div> */}
			{/* )} */}
		</div>
	);
}
