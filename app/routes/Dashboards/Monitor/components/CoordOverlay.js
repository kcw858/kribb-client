/* eslint-disable react/prop-types */
import React from "react";
import { useTranslation } from "react-i18next";

export default function CoordOverlay({ lat, lng }) {
	const { t } = useTranslation();

	return (
		<div className="card" style={{ position: "absolute", zIndex: 1000, top: -110, left: 0 }}>
			<div className="card-body text-white">
				<a href={`javascript: window.reactHistory.push("/dashboards/device/add/${lat}/${lng}");`}>
					<div style={{color: 'green'}}>{t("addDevice")}</div>
					<div style={{color: 'black'}}>{t("latitude")} : {lat}</div>
					<div style={{color: 'black'}}>{t("longitude")} : {lng}</div>
				</a>
			</div>
		</div>
	);
}
