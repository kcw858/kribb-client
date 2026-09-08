// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import MarkerInfoBox from "./components/MarkerInfoBox";
import { useHistory } from "react-router";
import { observer } from "mobx-react-lite";
import MonitorStore from "../../../store/global/MonitorStore";
import AccountStore from "../../../store/global/AccountStore";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import MapView from "../Monitor/MapView";
import SplitPane from "react-split-pane";

const isMiniSize = () => (window.innerWidth < 576 ? true : false);

export default observer(function Monitor() {
	// @ts-ignore
	// window.reactHistory = useHistory();

	//번역기능
	const { t } = useTranslation();

	// const markerStdInfo = {
	// 	odor: t("odor"),
	// 	silution: t("dilutionFactor"),
	// 	solidity: t("odorIntensity"),
	// };

	let [mini, setMini] = useState(isMiniSize());

	useEffect(() => {
		const handleResize = () => {
			setMini(isMiniSize());
		};

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="container-fluid" style={{ backgroundColor: "#F9FAFC" }}>
			{mini ? (
				<div className="col-md-12 col-xs-12">
					<MapView list={MonitorStore.monitorInfoList} />
				</div>
			) : (
				<div className="row mb-2 ml-0">
					<SplitPane
						style={{ position: "relative" }}
						split="vertical"
						minSize={450}
						step={50}
						defaultSize={Number(window.localStorage.getItem("splitPos")) ? Number(window.localStorage.getItem("splitPos")) : 930}
						onChange={(size) => window.localStorage.setItem("splitPos", size)}
					>
						<div className="mr-3">
							<MapView list={MonitorStore.monitorInfoList} />
						</div>
						{/* 내부의 스크롤바를 좁게 보이게 하기 위해 marginRight를 -12px로 잡음. 0으로 하면 두꺼운 스크롤바가 나타남. */}
						<div className="row ml-2" style={{ height: window.innerHeight * 0.9, overflowY: "auto", marginRight: "0px" }}>
							{/* nh3를 기준으로 값이 큰 것부터 정렬하여, 위험수위가 높은 카드를 최상위에 배치 */}
							{_.sortBy(_.values(MonitorStore.monitorInfoList), "nh3")
								.reverse()
								.map((record) => (
									<span key={record.id}>
										<MarkerInfoBox record={record} value={record.nh3} showOverlay={true} isAdmin={AccountStore.role != "user"} />
									</span>
								))}
						</div>
					</SplitPane>
				</div>
			)}
		</div>
	);
});
