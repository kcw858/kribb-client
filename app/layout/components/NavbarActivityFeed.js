import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
	UncontrolledDropdown,
	DropdownToggle,
	IconWithBadge,
	Badge,
	ExtendedDropdown,
	ListGroup,
	ListGroupItem,
	Media,
} from "./../../components";
import { observer } from "mobx-react-lite";
import AlertStore from "../../store/global/AlertStore";
import { useTranslation } from "react-i18next";
import MediaQuery from "react-responsive";

/*eslint-disable */
const alertIcons = {
	warn: (
		<span className="fa-stack fa-lg fa-fw d-flex mr-3">
			<i className="fa fa-circle fa-fw fa-stack-2x text-success"></i>
			<i className="fa fa-check fa-stack-1x fa-fw text-white"></i>
		</span>
	),
	error: (
		<span className="fa-stack fa-lg fa-fw d-flex mr-3">
			<i className="fa fa-circle fa-fw fa-stack-2x text-danger"></i>
			<i className="fa fa-close fa-stack-1x fa-fw text-white"></i>
		</span>
	),
	fatal: (
		<span className="fa-stack fa-lg fa-fw d-flex mr-3">
			<i className="fa fa-circle fa-fw fa-stack-2x text-warning"></i>
			<i className="fa fa-exclamation fa-stack-1x fa-fw text-white"></i>
		</span>
	),
};
/*eslint-enable */

export default observer(function NavbarActivityFeed(props) {
	const { t } = useTranslation();

	const notice = require("../../images/avatars/noti.png");

	return (
		<div>
			{/* <MediaQuery maxWidth={1024}>
				<div
					className="back-btn"
					onClick={() => {
						history.back();
					}}
				>
					<i className="fa fa-fw fa-arrow-left fa-lg" aria-hidden={true} style={{ padding: "16px" }}></i>
				</div>
			</MediaQuery> */}
			<UncontrolledDropdown nav inNavbar {...props}>
				<DropdownToggle nav>
					{AlertStore.alertList.length ? (
						<IconWithBadge
							badge={
								<Badge pill color="primary">
									{AlertStore.alertList.length}
								</Badge>
							}
						>
							<i className="text-white pl-2" style={{ height: "20px" }}>
								<img src={notice} alt="알림" />
							</i>
							<MediaQuery minWidth={481}>
								<div style={{ paddingTop: "3px", fontWeight: 600, fontSize: "13px" }}>
									<span style={{ color: "#718096" }}>{t("menuAlert")}</span>
								</div>
							</MediaQuery>
							<MediaQuery maxWidth={480}>
								<div style={{ paddingTop: "3px", fontWeight: 600, fontSize: "12px" }}>
									<span style={{ color: "#718096" }}>{t("menuAlert")}</span>
								</div>
							</MediaQuery>
						</IconWithBadge>
					) : (
						<div>
							<i className="pl-2" style={{ height: "20px" }}>
								<img src={notice} alt="알림" />
							</i>
							<MediaQuery minWidth={481}>
								<div style={{ paddingTop: "3px", fontWeight: 600, fontSize: "13px" }}>
									<span style={{ color: "#718096" }}>{t("menuAlert")}</span>
								</div>
							</MediaQuery>
							<MediaQuery maxWidth={480}>
								<div style={{ paddingTop: "3px", fontWeight: 600, fontSize: "12px" }}>
									<span style={{ color: "#718096" }}>{t("menuAlert")}</span>
								</div>
							</MediaQuery>
						</div>
					)}
				</DropdownToggle>
				<ExtendedDropdown right>
					<ExtendedDropdown.Section className="d-flex justify-content-between align-items-center">
						<h6 className="mb-0">{t("alertInfo")}</h6>
						<Badge pill>{AlertStore.alertList.length || ""}</Badge>
					</ExtendedDropdown.Section>

					<ExtendedDropdown.Section list>
						<ListGroup>
							{AlertStore.alertJsxList.map((alertJsx, index) => (
								<ListGroupItem key={index} action>
									<Link to="/alert/history">
										<Media>
											{/* <Media left>{alertIcons[type]}</Media> */}
											<Media body>{alertJsx}</Media>
										</Media>
									</Link>
								</ListGroupItem>
							))}
						</ListGroup>
					</ExtendedDropdown.Section>

					<ExtendedDropdown.Section className="text-center" tag={Link} to="/alert/history">
						{t("seeAllAlerts")}
						<i className="fa fa-angle-right fa-fw ml-2" />
					</ExtendedDropdown.Section>
				</ExtendedDropdown>
			</UncontrolledDropdown>
		</div>
	);
});
