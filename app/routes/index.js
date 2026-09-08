import React from "react";
import { Route, Switch, Redirect } from "react-router";

// ----------- Pages Imports ---------------
import Product from "./Product";
import Device from "./Dashboards/Device";
import Monitor from "./Dashboards/Monitor";

import NavbarOnly from "./Layouts/NavbarOnly";
import SidebarWithNavbar from "./Layouts/SidebarWithNavbar";

// ----------- Layout Imports ---------------
import { DefaultNavbar } from "./../layout/components/DefaultNavbar";
import { DefaultSidebar } from "./../layout/components/DefaultSidebar";

import { SidebarANavbar } from "./../layout/components/SidebarANavbar";
import { SidebarASidebar } from "./../layout/components/SidebarASidebar";
import { observer } from "mobx-react-lite";
import AccountStore from "../store/global/AccountStore";
import Login from "./Auth/Login";
import Lock from "./Auth/Lock";
import { UserList, AddUser, EditUser } from "./User";
import { AlertConfigList, AddAlertConfig, EditAlertConfig, AlertHistoryList } from "./Alert";
import { EditMyInfo } from "./MyInfo";
// import { LogList } from "./Log";
import AlertRecipent from "./Alert/AlertRecipent";
import { DataAdvanced, DataChart, DataCompareChart } from "./Data";

//------ Route Definitions --------
// eslint-disable-next-line no-unused-vars
export const RoutedContent = observer(() => {

	if (AccountStore.isLock()) {
		if (AccountStore.userid) {
			return <Lock />;
		} else {
			return <Login />;
		}
	}

	let role = AccountStore.role;
	let isSuper = role == "super";
	let isAdmin = role == "super" || role == "admin";

	return (
		<Switch>
			<Redirect from="/" to="/dashboards/device" exact />

			<Redirect from="/dashboards" to="/dashboards/device" exact />

			{/* {<Route path="/dashboards/monitor" exact component={Monitor.Monitor} />} //모니터링은 일단 안씀 */}
			{isSuper && <Route path="/product" exact component={Product.ProductList} />}
			{isSuper && <Route path="/product/info/:id" exact component={Product.ProductInfo} />}
			{isSuper && <Route path="/product/add" exact component={Product.AddProduct} />}
			{isSuper && <Route path="/product/edit/:id" exact component={Product.EditProduct} />}

			{isSuper && <Route path="/product/:id/add" exact component={Product.AddAttribs} />}
			{isSuper && <Route path="/product/:id/edit/:attrId" exact component={Product.EditAttribs} />}

			{/* 마지막으로 넘어온 데이터 시간 */}
			{isSuper && <Route path="/superlist" exact component={Device.DeviceDateList} />} 
			{<Route path="/dashboards/device" exact component={Device.DeviceList} />}
			{isAdmin && <Route path="/dashboards/device/add" exact component={Device.AddDevice} />}
			{isAdmin && <Route path="/dashboards/device/add/:lat/:lng" exact component={Device.AddDevice} />}
			{<Route path="/dashboards/device/info/:id" exact component={Device.DeviceInfo} />}
			{isAdmin && <Route path="/dashboards/device/edit/:id" exact component={Device.EditDevice} />}

			{/* {isAdmin && <Route path="/data/chart" exact component={DataChart} />}
			{isAdmin && <Route path="/data/compare" exact component={DataCompareChart} />}
			{isAdmin && <Route path="/data/advanced" exact component={DataAdvanced} />} */}
			{<Route path="/data/chart" exact component={DataChart} />}
			{<Route path="/data/compare" exact component={DataCompareChart} />}
			{<Route path="/data/advanced" exact component={DataAdvanced} />}

			{isAdmin && <Route path="/alert/config" exact component={AlertConfigList} />}
			{isAdmin && <Route path="/alert/config/add" exact component={AddAlertConfig} />}
			{isAdmin && <Route path="/alert/config/edit/:id" exact component={EditAlertConfig} />}
			{<Route path="/alert/history" exact component={AlertHistoryList} />}
			{<Route path="/alert/recipent" exact component={AlertRecipent} />}

			{isSuper && <Route path="/user" exact component={UserList} />}
			{isSuper && <Route path="/user/add" exact component={AddUser} />}
			{isSuper && <Route path="/user/edit/:id" exact component={EditUser} />}

			{/* {isAdmin && <Route path="/log" exact component={LogList} />} */}

			{<Route path="/myinfo/edit" exact component={EditMyInfo} />}
			<Redirect to="/pages/error-404" />
		</Switch>
	);
});

//------ Custom Layout Parts --------
export const RoutedNavbars = () => (
	<Switch>
		{/* Other Navbars: */}
		<Route component={SidebarANavbar} path="/layouts/sidebar-a" />
		<Route component={NavbarOnly.Navbar} path="/layouts/navbar" />
		<Route component={SidebarWithNavbar.Navbar} path="/layouts/sidebar-with-navbar" />
		{/* Default Navbar: */}
		<Route component={DefaultNavbar} />
	</Switch>
);

export const RoutedSidebars = () => (
	<Switch>
		{/* Other Sidebars: */}
		<Route component={SidebarASidebar} path="/layouts/sidebar-a" />
		<Route component={SidebarWithNavbar.Sidebar} path="/layouts/sidebar-with-navbar" />
		{/* Default Sidebar: */}
		<Route component={DefaultSidebar} />
	</Switch>
);
