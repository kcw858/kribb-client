import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MediaQuery from "react-responsive";
import AccountStore from "../../store/global/AccountStore";
// import MonitorStore from "../../store/global/MonitorStore";
import { LogoThemed } from "../components/LogoThemed/LogoThemed";
import Monitor from "../Dashboards/Monitor";
import AuthLayout from "./components/AuthLayout";
import SignUp from "./SignUp";

export default function Login() {
	const { t } = useTranslation();
	let [currentPage, setCurrentPage] = useState("login");
	let [id, setId] = useState("");
	let [password, setPassword] = useState("");

	if (currentPage == "signUp") {
		return <SignUp onComplete={() => setCurrentPage("login")} />;
	}

	if (currentPage == "monitor") {
		return (
			<AuthLayout>
				<nav className="navbar navbar-light" style={{ backgroundColor: "#3c3c3c" }}>
					<LogoThemed className="" checkBackground height="30" />
					<button onClick={() => setCurrentPage("login")} className="btn btn-primary">
						{t("login")}
					</button>
				</nav>
				<Monitor />
			</AuthLayout>
		);
	}

	return (
		<AuthLayout>
			<div className="row justify-content-center align-items-center p-5">
				<div className="col-12 col-lg-4">
					<div className="d-flex flex-column align-items-center justify-content-center mb-4">
						<LogoThemed className="" checkBackground height="35" />
					</div>
					<div className="text-center mt-2 mb-4">
						<p style={{ color: "#718096" }}>{t("mainNavBarText")}</p>
					</div>
					{/* 아이디 입력칸 */}
					<div className="form-group d-flex align-items-center justify-content-center">
						<MediaQuery minWidth={401}>
							<div style={{ width: "75px" }} className="fw-600">
								<span style={{ color: "#718096" }}>{t("id")}</span>
							</div>
							<input
								type="id"
								onChange={(e) => setId(e.currentTarget.value)}
								value={id}
								className="form-control bg-white"
								id="id"
								style={{ width: "275px" }}
								//엔터키
								onKeyPress={async (e) => {
									if (e.key === "Enter") {
										if (!id) {
											return alert(t("inputID"));
										}

										if (!password) {
											return alert(t("inputPassword"));
										}

										//입력한 ID,PW를 Login api로 보낸다.
										await AccountStore.login(id, password);
									}
								}}
							/>
						</MediaQuery>
						<MediaQuery maxWidth={400}>
							<div className="w-100">
								<div className="fw-600 mb-2 text-center">
									<span style={{ color: "#718096" }}>{t("id")}</span>
								</div>
								<input
									type="id"
									onChange={(e) => setId(e.currentTarget.value)}
									value={id}
									className="form-control bg-white"
									id="id"
									//엔터키
									onKeyPress={async (e) => {
										if (e.key === "Enter") {
											if (!id) {
												return alert(t("inputID"));
											}

											if (!password) {
												return alert(t("inputPassword"));
											}

											//입력한 ID,PW를 Login api로 보낸다.
											await AccountStore.login(id, password);
										}
									}}
								/>
							</div>
						</MediaQuery>
					</div>
					{/* 비밀번호 입력칸 */}
					<div className="form-group d-flex align-items-center justify-content-center">
						<MediaQuery minWidth={401}>
							<div style={{ width: "75px" }} className="fw-600">
								<span style={{ color: "#718096" }}>{t("password")}</span>
							</div>
							<input
								type="password"
								onChange={(e) => setPassword(e.currentTarget.value)}
								value={password}
								className="form-control bg-white"
								id="password"
								style={{ width: "275px" }}
								//엔터키
								onKeyPress={async (e) => {
									if (e.key === "Enter") {
										if (!id) {
											return alert(t("inputID"));
										}

										if (!password) {
											return alert(t("inputPassword"));
										}

										//입력한 ID,PW를 Login api로 보낸다.
										await AccountStore.login(id, password);
									}
								}}
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
									className="form-control bg-white"
									id="password"
									//엔터키
									onKeyPress={async (e) => {
										if (e.key === "Enter") {
											if (!id) {
												return alert(t("inputID"));
											}

											if (!password) {
												return alert(t("inputPassword"));
											}

											//입력한 ID,PW를 Login api로 보낸다.
											await AccountStore.login(id, password);
										}
									}}
								/>
							</div>
						</MediaQuery>
					</div>
					<div className="d-flex align-items-center justify-content-center" style={{ marginTop: "27px" }}>
						<button
							onClick={async () => {
								if (!id) {
									return alert(t("inputID"));
								}

								if (!password) {
									return alert(t("inputPassword"));
								}

								//입력한 ID,PW를 Login api로 보낸다.
								await AccountStore.login(id, password);
							}}
							className="btn btn-primary btn-lg btn-block"
							style={{ width: "350px" }}
						>
							{t("login")}
						</button>
					</div>

					<div className="d-flex align-items-center justify-content-center">
						{/* <button onClick={() => setCurrentPage("monitor")} className="btn card-link mt-3">
							<span style={{color:"#4A5568", fontWeight:600}}>모니터링화면 보기</span>
						</button> */}
						<button onClick={() => setCurrentPage("signUp")} className="btn card-link mt-3">
							<span style={{ color: "#718096" }} className="fw-600">
								{t("signUp")}
							</span>
						</button>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
}
