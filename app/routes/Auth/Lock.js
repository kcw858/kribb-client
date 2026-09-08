import React, { useState } from "react";
import AccountStore from "../../store/global/AccountStore";
import { LogoThemed } from "../components/LogoThemed/LogoThemed";
import MapView from "../Dashboards/Monitor/MapView";
import AuthLayout from "./components/AuthLayout";
import { useTranslation } from "react-i18next";
import OrdorColorLegend from "../Dashboards/Monitor/components/OdorColorLegend";
import MediaQuery from "react-responsive";

export default function Lock() {
	const { t } = useTranslation();

	// let [showMonitor, setShowMonitor] = useState(location.hostname == "127.0.0.1" ? true : false);
	let [password, setPassword] = useState("");

	//잠금화면

	// if (showMonitor) {
	// 	return (
	// 		<AuthLayout >
	// 			{/* 잠금화면 상단 바 */}
	// 			<nav className="navbar navbar-light" style={{backgroundColor: '#dfe4ea'}}>
	// 				<LogoThemed className="mt-2" checkBackground height="30" />
	// 				<button onClick={() => setShowMonitor(false)} className="btn btn-primary">
	// 					{t("unlock")}
	// 				</button>
	// 			</nav>
	// 		<div style={{width:"80%", margin:"0 auto"}}>
	// 			<div className="ml-auto mr-2" style={{ width: 230, right: 184, position: "absolute", zIndex: 100 }}>
	// 				<OrdorColorLegend />
	// 			</div>
	// 			<MapView hRatio={1}/>
	// 		</div>
	// 		</AuthLayout>
	// 	);
	// }

	return (
		<AuthLayout>
			<div className="row justify-content-center align-items-center p-5">
				<div className="col-12 col-lg-4 mt-5">
					<div className="d-flex justify-content-center">
						<LogoThemed className="" checkBackground height="35" />
					</div>
					<div className="text-center mt-2 mb-4">
						<p style={{ color: "#718096" }}>
							{AccountStore.userid} {t("sessionExpiredDescprition")}
						</p>
					</div>

					<div className="form-group d-flex align-items-center justify-content-center">
						<MediaQuery minWidth={401}>
							<div style={{ width: "75px" }} className="fw-600">
								<span style={{ color: "#718096" }}>{t("password")}</span>
							</div>
							<input
								type="password"
								onChange={(e) => setPassword(e.currentTarget.value)}
								value={password}
								className="form-control"
								id="password"
								style={{ width: "275px" }}
								//엔터키
								onKeyPress={async (e) => {
									if (e.key === "Enter") {
										if (!password) {
											return alert(t("inputPassword"));
										}
										await AccountStore.login(AccountStore.userid, password);
									}
								}}
								autoFocus={true}
							/>
						</MediaQuery>
						<MediaQuery maxWidth={400}>
							<div className="w-100">
								<div className="fw-600 mb-2 text-center">
									<span style={{ color: "#718096" }}>{t("password")}</span>
								</div>
								<input
									type="password"
									onChange={(e) => setPassword(e.currentTarget.value)}
									value={password}
									className="form-control"
									id="password"
									//엔터키
									onKeyPress={async (e) => {
										if (e.key === "Enter") {
											if (!password) {
												return alert(t("inputPassword"));
											}
											await AccountStore.login(AccountStore.userid, password);
										}
									}}
								/>
							</div>
						</MediaQuery>
					</div>
					<div className="d-flex align-items-center justify-content-center" style={{ marginTop: "25px" }}>
						<button
							onClick={async () => {
								if (!password) {
									return alert(t("inputPassword"));
								}

								await AccountStore.login(AccountStore.userid, password);
							}}
							className="btn btn-primary btn-lg btn-block"
							style={{ width: "350px" }}
						>
							{t("unlock")}
						</button>
					</div>
					<div className="d-flex align-items-center justify-content-center">
						{/* <button onClick={() => setShowMonitor(true)} className="btn card-link mt-3">
							<span style={{color:"#4A5568", fontWeight:600}}>{t("pinToMonitoringScreen")}</span>
						</button> */}
						<button onClick={() => AccountStore.signOut()} className="btn card-link mt-3">
							<span style={{ color: "#718096" }} className="fw-600">
								{t("loginWithADifferentAccount")}
							</span>
						</button>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
}
