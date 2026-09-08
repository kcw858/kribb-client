import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Col, Row, Card, CardBody, UncontrolledTooltip, Progress, CardTitle, Table, Badge, Accordion } from "../../../components";
import MonitorStore from "../../../store/global/MonitorStore";
import AlertStore from "../../../store/global/AlertStore";
import { TinyBarChart } from "../../Graphs/ReCharts/components/TinyBarChart";
import DeviceListTable from "./components/DeviceListTable";
import { useTranslation } from "react-i18next";
import MapView from "../Monitor/MapView";
import { transform } from "lodash";
import OrdorColorLegend from "../Monitor/components/OdorColorLegend";
import { PieChartWithPaddingAngleHalf } from "../../../routes/Graphs/ReCharts/components/PieChartWithPaddingAngleHalf";
import moment from "moment";
import MediaQuery from "react-responsive";
import "../../../styles/components/dashboards/dashboards.css";
import DeviceCardTable from "./components/DeviceCardTable";
import MarkerInfoBox from "../Monitor/components/MarkerInfoBox";
import _ from "lodash";
import AccountStore from "../../../store/global/AccountStore";
import { Link } from "react-router-dom";

export default observer(function DeviceList() {
	//현재 시간을 가져온다
	const nowTime = moment(moment().format("YYYY-MM-DD HH:mm:ss"));

	//60분 전에 데이터가 올라오지않았으면 가동되지 않는걸로 판단한다.
	const data = MonitorStore.monitorInfoList.map(
		(e) => moment.duration(nowTime.diff(e.sensingDt)).asMinutes() < 60 && e.sensingDt
	);
	const useable = data.filter((e) => false !== e).length;
	const unuseable = data.filter((e) => false === e).length;

	const { t } = useTranslation();
	const hRatio = 0.8;
	// 대시보드의 알림 현황 데이타
	// alertCurrent = {alerts: [], devnum: "", devon: "", h2s: "", indol: "", nh3: "", odor: "", voc: ""};
	const alertCurrent = AlertStore.alertCurrent;
	const circleImg = require("../../../images/facilities/circle/circle_1x.png");
	const rectangleImg = require("../../../images/facilities/rectangle/rectangle_1x.png");
	const starImg = require("../../../images/facilities/star/star_1x.png");
	const triangleImg = require("../../../images/facilities/triangle/triangle_1x.png");
	return (
		<div className="container-fluid">
			<Row>
				<Col lg={12}>
					{/* <div className="hr-text hr-text-left mt-4 mb-4">
						<span>{t("deviceOverview")}</span>
					</div> */}
					<Row>
						<Col lg={10} md={12} xs={12}>
							{/* <div className="ml-auto mr-2" style={{ width: 230, right: 8, position: "absolute", zIndex: 100 }}>
								<OrdorColorLegend />
							</div> 
							PC화면 
							<div className="d-none d-lg-block">
								<MapView hRatio={hRatio} list={MonitorStore.monitorInfoList} />
							</div>
							모바일화면
							<div className="d-lg-none">
								<MapView hRatio={0.6} list={MonitorStore.monitorInfoList} />
							</div> */}
							<MediaQuery minWidth={991}>
								<MapView hRatio={hRatio} list={MonitorStore.monitorInfoList} />
							</MediaQuery>
							<MediaQuery maxWidth={990}>
								<MapView hRatio={hRatio * 0.7} list={MonitorStore.monitorInfoList} />
							</MediaQuery>
							{/* //어떤 장비가 가동중인지 확인하기 위해 임시로 만듦 */}
							<Link
								to={`/superlist`}
								style={{
									fontSize: "1px",
									display: AccountStore.username !== "이엔티" && "none",
								}}
								className="text-white"
							>
								.
							</Link>
						</Col>
						<Col lg={2} md={12} xs={12}>
							<div className="d-none d-lg-block" style={{ height: "50px" }}></div>
							{/* 현황 배경색 */}
							<Card style={{ height: window.innerHeight * hRatio, overflow: "hidden", backgroundColor: "white" }}>
								<CardBody className="bb-0">
									<span className="d-flex mt-1 mb-3">
										<CardTitle className="mb-0 bb-0 overviewTitle">{t("deviceOverview")}</CardTitle>
									</span>
									<Row>
										<Col lg={12} md={6} xs={12}>
											<div className="overviewFirstbox">
												<div className="hr-text-left my-2">
													<span className="overviewSubTitle">{t("deviceOn")}</span>
												</div>
												<div className="text-center my-2 AngleHalfGraph">
													{/* <div className="my-2" style={{ fontWeight: "600", color: "#4a5568" }}></div> */}
													<PieChartWithPaddingAngleHalf unuseable={unuseable} useable={useable} />
													<div className="deviceNum">
														{t("total")}
														<span>{useable}</span>
													</div>
												</div>
											</div>
										</Col>
										{/* 기존 장비가동률  
									<div className="hr-text hr-text-left my-2">
										<span style={{color: 'black', fontSize: '14px' }}>
											{t("deviceOn")}
										</span>
									</div>
									<div className="mb-4">
										<div className="d-flex justify-content-between text-black" style={{ fontSize: '20px' }}>
											<span className="d-flex align-items-center mr-2">총 147</span>
											<Progress value="95" className="mt-3 w-50 progress" style={{height: "5px"}} />
											<span className="ml-2">95%</span>
										</div>
									</div> */}
										<Col lg={12} md={6} xs={12}>
											<div className="overviewSecondbox">
												<div className="my-2 mb-3">
													<span className="overviewSubTitle">{t("sensorAlerts")}</span>
												</div>
												<Table size="sm">
													<tr>
														<td className="bt-0 sensorElement">NH3</td>
														<td className="text-right bt-0">
															<h4>
																<Badge className="deviceBadge" pill>
																	0
																</Badge>
															</h4>
														</td>
													</tr>
													<tr>
														<td className="sensorElement">H2S</td>
														<td className="text-right">
															<h4>
																<Badge className="deviceBadge" pill>
																	0
																</Badge>
															</h4>
														</td>
													</tr>
													<tr>
														<td className="sensorElement">CO2</td>
														<td className="text-right">
															<h4>
																<Badge className="deviceBadge" pill>
																	0
																</Badge>
															</h4>
														</td>
													</tr>
													<tr>
														<td className="sensorElement">ACID</td>
														<td className="text-right">
															<h4>
																<Badge className="deviceBadge" pill>
																	0
																</Badge>
															</h4>
														</td>
													</tr>
													<tr>
														<td className="sensorElement">INDOLES</td>
														<td className="text-right">
															<h4>
																<Badge className="deviceBadge" pill>
																	0
																</Badge>
															</h4>
														</td>
													</tr>
												</Table>
											</div>
										</Col>
									</Row>
									<div className="overviewThirdbox">
										<div className="hr-text-left my-3">
											<span className="overviewSubTitle">{t("alertsbyDay")}</span>
										</div>
										<div className="mb-3">
											<TinyBarChart />
										</div>
									</div>
									<div className="hr-text"></div>
									<div className="my-4">
										<span className="facilityTitle">{t("facilities")}</span>
									</div>
									<div className="mt-4 text-center">
										<div className="facilityAlign">
											<div>
												<img src={rectangleImg} alt="pigsty_mark" />
												<div className="mt-2 facilitLegend">{t("pig")}</div>
											</div>
											<div>
												<img src={circleImg} alt="cowhouse_mark" />
												<div className="mt-2 facilitLegend">{t("cow")}</div>
											</div>
											<div>
												<img src={triangleImg} alt="henhouse_mark" />
												<div className="mt-2 facilitLegend">{t("hen")}</div>
											</div>
											<div>
												<img src={starImg} alt="manure_storage_mark" />
												<div className="mt-2 facilitLegend">{t("manure")}</div>
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Col>

				<Col lg={12}>
					<div className="hr-text hr-text-left mt-4">
						<span className="deviceList">{t("deviceList")}</span>
					</div>
					<DeviceListTable data={MonitorStore.monitorInfoList} />

					{/* ======================수정중================ */}
					{/* <div className='d-flex flex-wrap center'>
					<Row>
						<Col lg={12} md={12} xs={12}>
							<DeviceCardTable/>
						</Col>
					</Row>
					</div>  */}
					{/* ======================수정중================ */}

					{/* ======================모니터링 표 그대로 쓰기================ */}
					{/* <div className="row ml-2" style={{ height: window.innerHeight * 0.9, overflowY: "auto", marginRight: "0px" }}> */}
					{/* nh3를 기준으로 값이 큰 것부터 정렬하여, 위험수위가 높은 카드를 최상위에 배치 */}
					{/* {_.sortBy(_.values(MonitorStore.monitorInfoList), "nh3")
							.reverse()
							.map((record) => (
								<span key={record.id}>
									<MarkerInfoBox record={record} value={record.nh3} showOverlay={true} isAdmin={AccountStore.role != "user"} />
								</span>
						))}
					</div> */}
					{/* ======================모니터링 표 그대로 쓰기================ */}
				</Col>
			</Row>
		</div>
	);
});
