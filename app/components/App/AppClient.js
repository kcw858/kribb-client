import React from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import AppLayout from "./../../layout/default";
import { RoutedContent } from "./../../routes";
import TabletAppLayout from "../../layout/tabletLayout";
import { TabletRoutedContent } from "../../routes/tablet";

function DesktopApp() {
	return (
		<Router basename={"/"}>
			<ReactNotifications />
			<AppLayout>
				<RoutedContent />
			</AppLayout>
		</Router>
	);
}

function MobileApp() {
	return (
		<Router basename={"/mobile"}>
			<ReactNotifications />
			<AppLayout>
				<RoutedContent />
			</AppLayout>
		</Router>
	);
}

function TabletApp() {
	return (
		<Router basename={"/tablet"}>
			<TabletAppLayout>
				<TabletRoutedContent />
			</TabletAppLayout>
		</Router>
	);
}

const AppClient = () => {
	switch (location.pathname.split("/")[1]) {
		case "moible":
			window["mode"] = "mobile";
			break;
		case "tablet":
			window["mode"] = "tablet";
			break;
		default:
			window["mode"] = "desktop";
			break;
	}

	let params = new URLSearchParams(location.search);
	// window["mode"] = params.get("mode");

	switch (window["mode"]) {
		case "tablet":
			window["deviceid"] = params.get("deviceid");
			if (!window["deviceid"]) {
				alert("장비 아이디정보를 찾을 수 없습니다. 담당자에게 문의하여주세요.");
				return <div>Invalid Device Id</div>;
			}
			return <TabletApp />;
		case "mobile":
			return <MobileApp />;
		default:
			return <DesktopApp />;
	}
};

export default hot(module)(AppClient);
