import React, { useState } from "react";
import PropTypes from "prop-types";

import { Layout, ThemeProvider } from "./../components";

import "./../styles/bootstrap.scss";
import "./../styles/main.scss";
import "./../styles/plugins/plugins.scss";
import "./../styles/plugins/plugins.css";

import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { useHistory, useLocation } from "react-router";
import AccountStore from "../store/global/AccountStore";

function TabletAppLayout({ children }) {
	let location = useLocation();
	let history = useHistory();
	let [tab, setTab] = useState(location.pathname.split("/")[2]);

	return (
		<ThemeProvider initialStyle="light" initialColor="primary">
			<Layout sidebarSlim>
				<Layout.Content>{children}</Layout.Content>
			</Layout>

			<div style={{ height: 105 }}>&nbsp;</div>

			<BottomNavigation
				className="fixed-bottom d-flex border-top"
				style={{ height: 95 }}
				value={tab}
				onChange={(event, newValue) => {
					if (newValue != "lock") {
						setTab(newValue);
					}

					switch (newValue) {
						case "lock":
							AccountStore.setLockScreen();
							break;
						case "device":
							history.push(`/dashboards/device/info/${window["deviceid"]}?mode=tablet&deviceid=${window["deviceid"]}`);
							break;
						case "chart":
							history.push(`/data/chart?mode=tablet&deviceid=${window["deviceid"]}`);
							break;
						case "myInfo":
							history.push(`/myinfo/edit?mode=tablet&deviceid=${window["deviceid"]}`);
							break;
						default:
							break;
					}
				}}
				showLabels
			>
				<BottomNavigationAction
					value="lock"
					label="잠금"
					style={{ minWidth: "40px" }}
					icon={<i className="fa fa-fw fa-lock" style={{ fontSize: "2.0em" }} />}
				/>
				<BottomNavigationAction
					value="device"
					label="홈(정보)"
					style={{ minWidth: "40px" }}
					icon={<i className="fa fa-fw fa-home" style={{ fontSize: "2.0em" }} />}
				/>
				<BottomNavigationAction
					value="chart"
					label="데이터보기"
					style={{ minWidth: "40px" }}
					icon={<i className="fa fa-fw fa-bar-chart" style={{ fontSize: "2.0em" }} />}
				/>
				<BottomNavigationAction
					value="myInfo"
					label="내정보"
					style={{ minWidth: "40px" }}
					icon={<i className="fa fa-fw fa-cog" style={{ fontSize: "2.0em" }} />}
				/>
			</BottomNavigation>
		</ThemeProvider>
	);
}

TabletAppLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default TabletAppLayout;
