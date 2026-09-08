import React from "react";
import { Route, Switch, Redirect } from "react-router";
import AccountStore from "../store/global/AccountStore";
import Login from "./Auth/Login";
import Lock from "./Auth/Lock";
import { EditMyInfo } from "./MyInfo";
import { DataChart } from "./Data";
import { observer } from "mobx-react-lite";
import Device from "./Dashboards/Device";

export const TabletRoutedContent = observer(() => {
	if (AccountStore.isLock()) {
		if (AccountStore.userid) {
			return <Lock />;
		} else {
			return <Login />;
		}
	}
	
	return (
		<Switch>
			<Redirect from="/" to={`/dashboards/device/info/${encodeURIComponent(window["deviceid"])}`} exact />

			<Route path="/dashboards/device/info/:id" exact component={Device.DeviceInfo} />
			<Route path="/myinfo/edit" exact component={EditMyInfo} />
			<Route path="/data/chart" exact component={DataChart} />

			<Redirect to="/pages/error-404" />
		</Switch>
	);
});
