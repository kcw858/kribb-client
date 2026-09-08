/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AccountStore from "../../../../store/global/AccountStore";
import WsApi from "../../../../store/wsApi";
import EditCapture from "../EditCapture";

export default function JtronController({ manufacturer, id }) {
	const { t } = useTranslation();
	const [captureModal, setCaptureModal] = useState(false);
	const [isConnected, setIsConnected] = useState(true);
	const [systemInfo, setSystemInfo] = useState(null);

	useEffect(() => {
		let timeoutId;
		let action = async () => {
			try {
				let { arr } = await WsApi.getConnectList(AccountStore.userid);
				console.log("connected list: ");
				console.log(arr);
				if (arr.indexOf(id) == -1) {
					setIsConnected(false);
					return alert("장비가 연결되지 않았습니다.");
				}

				let data = await WsApi.getSystemInfo(manufacturer, AccountStore.userid, id);
				if (data) {
					setSystemInfo(data);
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

	if (!systemInfo) {
		return (
			<div style={{ width: "100%" }}>
				<button type="button" className="btn btn-secondary w-100" disabled style={{ borderRadius: "0.2rem", height: "50px" }}>
					장비와 연결중입니다...
				</button>
			</div>
		);
	}

	return (
		<>
			{captureModal && (
				<EditCapture
					id={id}
					value={systemInfo && systemInfo["sysInfo"] ? Number(systemInfo["sysInfo"]["autoProcOdorLev"]) : 0}
					close={() => {
						setCaptureModal(false);
						//현재 응답이 없으므로 반영되었는지 확인(1초뒤에 추가 확인하도록)
						WsApi.getSystemInfo(manufacturer, AccountStore.userid, id).then((data) => setSystemInfo(data));
						setTimeout(() => WsApi.getSystemInfo(manufacturer, AccountStore.userid, id).then((data) => setSystemInfo(data)), 1e3);
					}}
				/>
			)}
			<button
				type="button"
				className="btn btn-primary"
				onClick={() => {
					WsApi.sample(AccountStore.userid, id);
				}}
			>
				{t("capture")}
			</button>
			<button
				type="button"
				className="btn btn-outline-secondary"
				onClick={() => {
					WsApi.stop(AccountStore.userid, id);
				}}
			>
				{t("stop")}
			</button>
			<button
				type="button"
				className="btn btn-outline-secondary"
				onClick={() => {
					WsApi.clean(AccountStore.userid, id);
				}}
			>
				{t("clean")}
			</button>
			<button
				type="button"
				className="btn btn-outline-secondary"
				onClick={() => {
					setCaptureModal(true);
				}}
			>
				{t("autoCapture")}
			</button>
		</>
	);
}
