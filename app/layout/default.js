import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Layout, ThemeProvider } from "./../components";

import "./../styles/bootstrap.scss";
import "./../styles/main.scss";
import "./../styles/plugins/plugins.scss";
import "./../styles/plugins/plugins.css";

import { RoutedNavbars, RoutedSidebars } from "./../routes";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { useHistory, useLocation } from "react-router";
import AccountStore from "../store/global/AccountStore";

const favIcons = [
	{
		rel: "icon",
		type: "image/x-icon",
		href: require("./../images/favicons/favicon.ico"),
	},
	{
		rel: "icon",
		type: "image/png",
		sizes: "512x512",
		href: require("./../images/favicons/favicon512x512.png"),
	},
	{
		rel: "icon",
		type: "image/png",
		sizes: "192x192",
		href: require("./../images/favicons/favicon192x192.png"),
	},
	// {
	// 	rel: "apple-touch-icon",
	// 	sizes: "180x180",
	// 	href: require("./../images/favicons/favicon180x180.png"),
	// },
	{
		rel: "icon",
		type: "image/png",
		sizes: "180x180",
		href: require("./../images/favicons/favicon180x180.png"),
	},
	{
		rel: "icon",
		type: "image/png",
		sizes: "32x32",
		href: require("./../images/favicons/favicon32x32.png"),
	},
	{
		rel: "icon",
		type: "image/png",
		sizes: "16x16",
		href: require("./../images/favicons/favicon16x16.png"),
	},
];
function AppLayout({ children }) {
	let location = useLocation();
	let history = useHistory();

	const getTabValue = () => {
		let tabList = ["monitor", "device", "data", "alert", "myinfo"];

		for (let value of tabList) {
			if (location.pathname.indexOf(value) !== -1) {
				return value;
			}
		}
	};

	let [tab, setTab] = useState(getTabValue());

	useEffect(() => {
		setTab(getTabValue());
	}, [location]);

	return (
		<ThemeProvider initialStyle="dark" initialColor="primary">
			<Layout sidebarSlim favIcons={favIcons}>
				{/* --------- Navbar ----------- */}
				<Layout.Navbar>
					<RoutedNavbars />
				</Layout.Navbar>
				{/* -------- Sidebar ------------*/}
				<Layout.Sidebar>
					<RoutedSidebars />
				</Layout.Sidebar>

				{/* -------- Content ------------*/}
				<Layout.Content>{children}</Layout.Content>
			</Layout>

			{/* <div style={{ height: 105 }}>&nbsp;</div> */}

			{/* <BottomNavigation
				className="fixed-bottom d-flex d-sm-none border-top"
				style={{ height: 95 }}
				value={tab}
				onChange={(event, newValue) => {
					switch (newValue) {
						case "lock":
							AccountStore.setLockScreen();
							break;
						case "monitor":
							history.push("/dashboards/monitor");
							break;
						case "device":
							history.push("/dashboards/device");
							break;
						case "data":
							history.push("/data/chart");
							break;
						case "alert":
							history.push("/alert/history");
							break;
						case "myinfo":
							history.push("/myinfo/edit");
							break;
						default:
							break;
					}
				}}
				showLabels
				// className={classes.root}
			>
				<BottomNavigationAction
					value="lock"
					label="잠금"
					style={{ minWidth: "40px" }}
					icon={<i className="fa fa-fw fa-lock" style={{ fontSize: "1.35em" }} />}
				/>
				<BottomNavigationAction
					value="monitor"
					label="지도"
					style={{ minWidth: "40px" }}
					icon={<i className="fa fa-fw fa-home" style={{ fontSize: "1.35em" }} />}
				/>
				<BottomNavigationAction
					value="device"
					label="장비"
					style={{ minWidth: "40px" }}
					icon={<i className="fa fa-fw fa-desktop" style={{ fontSize: "1.35em" }} />}
				/>
				{AccountStore.role != "user" && (
					<BottomNavigationAction
						value="data"
						label="데이터"
						style={{ minWidth: "40px" }}
						icon={<i className="fa fa-fw fa-bar-chart" style={{ fontSize: "1.35em" }} />}
					/>
				)}
				{AccountStore.role != "user" && (
					<BottomNavigationAction
						value="alert"
						label="알림"
						style={{ minWidth: "40px" }}
						icon={<i className="fa fa-fw fa-bell-o" style={{ fontSize: "1.35em" }} />}
					/>
				)}

				<BottomNavigationAction
					value="myinfo"
					label="내정보"
					style={{ minWidth: "40px" }}
					icon={<i className="fa fa-fw fa-cog" style={{ fontSize: "1.35em" }} />}
				/>
			</BottomNavigation> */}
		</ThemeProvider>
	);
}

AppLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AppLayout;
