/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AccountStore from "../../../../store/global/AccountStore";
import WsApi from "../../../../store/wsApi";
import EditInsysSetup from "../EditInsysSetup";

export default function InsysController({ manufacturer, id }) {
	const { t } = useTranslation();
	const [setupModal, setSetupModal] = useState(false);
	const [isConnected, setIsConnected] = useState(true);
	const [systemInfo, setSystemInfo] = useState(null);

	useEffect(() => {
		let timeoutId;
		let action = async () => {
			try {
				let { arr } = await WsApi.getConnectList(AccountStore.userid);
				if (arr.indexOf(id) == -1) {
					setIsConnected(false);
					return alert("장비가 연결되지 않았습니다.");
				}

				let data = await WsApi.getSystemInfo(manufacturer, AccountStore.userid, id);
				if (data) {
					// 인시스 데이타와 주원전자 데이타 정의는 wsApi.js 파일 맨 아래 주석을 참조할 것.
					// 예) 인시스 시스템 결과 : systemInfo['statusResult']
					// 예) 주원전자 시스템 결과 : systemInfo['sysInfo']
					console.log("systemInfo: ");
					setSystemInfo(data);
				} else {
					console.log("no systemInfo!!!");
				}
			} catch (error) {
				alert("장비가 연결되지 않았습니다.");
			}
		};

		action();

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	if (!isConnected) {
		return (
			<div style={{ width: "100%" }}>
				<button type="button" className="btn btn-no-connect w-100" disabled style={{ borderRadius: "0.2rem", height: "50px" }}>
					장비가 연결되지 않았습니다.
				</button>
			</div>
		);
	}

	// 서버에서 인시스 장비의 status를 묻는 물음에 장비가 답변하지 않고 있음.
	// 따라서, 그 부분 주석처리
	// if (!systemInfo) {
	// 	return (
	// 		<button type="button" className="btn btn-secondary" disabled>
	// 			장비와 연결중입니다...
	// 		</button>
	// 	);
	// }

	return (
		<>
			{setupModal && (
				<EditInsysSetup
					id={id}
					// 현재 장비의 설정값을 가져와서 보여줌. 없으면 모두 0
					measure={systemInfo && systemInfo["statusResult"] ? Number(systemInfo["statusResult"]["insideTime"]) : 0}
					flush={systemInfo && systemInfo["statusResult"] ? Number(systemInfo["statusResult"]["outsideTime"]) : 0}
					rest={systemInfo && systemInfo["statusResult"] ? Number(systemInfo["statusResult"]["restTime"]) : 0}
					cycle={systemInfo && systemInfo["statusResult"] ? Number(systemInfo["statusResult"]["dataInterval"]) : 0}
					close={() => {
						setSetupModal(false);
						//현재 응답이 없으므로 반영되었는지 확인(1초뒤에 추가 확인하도록)
						WsApi.getSystemInfo(manufacturer, AccountStore.userid, id).then((data) => setSystemInfo(data));
						setTimeout(() => WsApi.getSystemInfo(manufacturer, AccountStore.userid, id).then((data) => setSystemInfo(data)), 1e3);
					}}
				/>
			)}
			{/* <button
				type="button"
				className="btn btn-outline-dark"
				onClick={() => {
					WsApi.stop(AccountStore.userid, id);
				}}
			>
				{t("stop")}
			</button>
			<button
				type="button"
				className="btn btn-outline-dark"
				onClick={() => {
					WsApi.clean(AccountStore.userid, id);
				}}
			>
				{t("clean")}
			</button> */}
			<div style={{ width: "100%" }}>
				<button
					type="button"
					className="btn btn-primary btn-connect-white-border w-100"
					onClick={() => {
						setSetupModal(true);
					}}
					style={{ borderRadius: "0.2rem", height: "50px" }}
				>
					{t("setup")}
				</button>
			</div>
		</>
	);
}
