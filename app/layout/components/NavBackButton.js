import React from "react";
import { useTranslation } from "react-i18next";
import MediaQuery from "react-responsive";

const NavBackButton = () => {
	const backImg = require("../../images/avatars/arrow.png");

	const { t } = useTranslation();
	return (
		<div
			className="back-btn d-lg-none mr-2 "
			onClick={() => {
				history.back();
			}}
		>
			<div className="pl-1" style={{ height: "20px" }}>
				<img className="" src={backImg} alt="이전" />
			</div>
			<MediaQuery minWidth={481}>
				<div style={{ paddingTop: "5px", fontSize: "13px", fontWeight: 600 }}>
					<span style={{ color: "#718096" }}>이전</span>
				</div>
			</MediaQuery>
			<MediaQuery maxWidth={480}>
				<div style={{ paddingTop: "5px", fontSize: "12px", fontWeight: 600 }}>
					<span style={{ color: "#718096" }}>이전</span>
				</div>
			</MediaQuery>
		</div>
	);
};

export default NavBackButton;
