import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import AccountStore from "../../store/global/AccountStore";
import { SidebarMenu, SidebarMenuItem } from "./../../components";

export default observer(function SidebarMiddleNav() {
	const { t } = useTranslation();

	//메뉴 아이콘
	const user = require("./../../../app/images/sideIcons/user.png");
	const product = require("./../../../app/images/sideIcons/product.png");
	const notice = require("./../../../app/images/sideIcons/notice.png");
	// const monitoring  = require('./../../../app/images/sideIcons/monitoring.png');
	const infor = require("./../../../app/images/sideIcons/infor.png");
	const dashboard = require("./../../../app/images/sideIcons/dashboard.png");
	const highdata = require("./../../../app/images/sideIcons/high-data.png");
	const comparedata = require("./../../../app/images/sideIcons/compare-data.png");
	const eachdata = require("./../../../app/images/sideIcons/each-data.png");

	let role = AccountStore.role;
	let isSuper = role == "super";
	let isAdmin = role == "super" || role == "admin";

	return (
		<div>
			<SidebarMenu>
				<SidebarMenuItem
					icon={
						<i>
							<img src={dashboard} alt="대시보드" />
						</i>
					}
					title={t("menuDashboard")}
					to="/dashboards/device"
					exact={false}
				/>
				{/* <SidebarMenuItem icon={<i><img src={monitoring} alt="모니터링"/></i>} title={t("menuMonitoring")} to="/dashboards/monitor" exact /> //모니터링 안보이게 */}
				<SidebarMenuItem
					icon={
						<i>
							<img src={eachdata} alt="개별장비" />
						</i>
					}
					title={t("menuDataChart")}
					to="/data/chart"
					exact={false}
				/>
				<SidebarMenuItem
					icon={
						<i>
							<img src={comparedata} alt="장비별비교" />
						</i>
					}
					title={t("menuDataCompare")}
					to="/data/compare"
					exact={false}
				/>
				<SidebarMenuItem
					icon={
						<i>
							<img src={highdata} alt="고급" />
						</i>
					}
					title={t("menuDataAdvanced")}
					to="/data/advanced"
					exact={false}
				/>

				<SidebarMenuItem
					icon={
						<i>
							<img src={notice} alt="알림" />
						</i>
					}
					title={t("menuCtlAlt")}
					exact={false}
				>
					<SidebarMenuItem
						title={<span style={{ fontSize: "12px" }}>{t("menuAlertList")}</span>}
						to="/alert/history"
						exact={false}
					/>
					<SidebarMenuItem
						invisible={!isAdmin || window["mode"] != "desktop"}
						title={<span style={{ fontSize: "12px" }}>{t("menuAlertConfig")}</span>}
						to="/alert/config"
						exact={false}
					/>
					<SidebarMenuItem
						invisible={window["mode"] != "desktop"}
						title={<span style={{ fontSize: "12px" }}>{t("menuAlertRecipent")}</span>}
						to="/alert/recipent"
						exact={false}
					/>
				</SidebarMenuItem>
				{/* 로그는 DB에 남기지 않고, 날짜별로 구분되는 텍스트 파일로 남기도록 한다.
				따라서, api 서버를 통해 로그를 살펴보지 않으며, 관계자가 살펴보고 싶을 때 시스템 운영자가 텍스트 로그를 살피는 방식으로 변경한다.
				DB에 무리도 가고, 로그 DB를 분리하면 관리포인트가 늘어나기 때문이다. */}
				{/* <SidebarMenuItem invisible={!isAdmin} icon={<i className="fa fa-fw fa-tasks"></i>} title={t("menuLog")} to="/log" exact={false} /> */}

				<SidebarMenuItem
					invisible={!isSuper}
					icon={
						<i>
							<img src={product} alt="제품" />
						</i>
					}
					title={t("menuProduct")}
					to="/product"
					exact={false}
				/>

				<SidebarMenuItem
					invisible={!isSuper}
					icon={
						<i>
							<img src={user} alt="사용자관리" />
						</i>
					}
					title={t("menuUser")}
					to="/user"
					exact={false}
				/>

				<SidebarMenuItem
					icon={
						<i>
							<img src={infor} alt="내정보" />
						</i>
					}
					title={t("menuMyInfo")}
					to="/myinfo/edit"
					exact={false}
				/>
			</SidebarMenu>
		</div>
	);
});

/*
@original navigations

<SidebarMenu>
	<SidebarMenuItem icon={<i className="fa fa-fw fa-desktop"></i>} title="대시보드">
		<SidebarMenuItem title="모니터링" to="/dashboards/monitor" exact />
		<SidebarMenuItem title="제품" to="/product" exact={false} />
		<SidebarMenuItem title="장비" to="/dashboards/device" exact={false} />
		<SidebarMenuItem title="분석" to="/dashboards/analytics" exact />
		<SidebarMenuItem title="확산분석" to='/dashboards/analytics' exact />
		<SidebarMenuItem title="보고서" to="/dashboards/reports" exact />
	</SidebarMenuItem>

	<SidebarMenuItem icon={<i className="fa fa-fw fa-bar-chart"></i>} title="차트보기">
		<SidebarMenuItem title="ReCharts" to="/graphs/re-charts" />
	</SidebarMenuItem>

	<SidebarMenuItem icon={<i className="fa fa-fw fa-bell-o"></i>} title="알림">
		<SidebarMenuItem title="알림 설정" to="/alert/config" exact={false} />
		<SidebarMenuItem title="알림 내역" to="/alert/history" exact={false} />
	</SidebarMenuItem>

	<SidebarMenuItem icon={<i className="fa fa-fw fa-book"></i>} title="보고서 설정" to="/reports" />

	<SidebarMenuItem icon={<i className="fa fa-fw fa-tasks"></i>} title="로그" to="/log" exact={false} />

	 <SidebarMenuItem icon={<i className="fa fa-fw fa-list"></i>} title="공지사항" to="/anouncements" />

	<SidebarMenuItem icon={<i className="fa fa-fw fa-user"></i>} title="사용자 관리" to="/user" exact={false} />

	<SidebarMenuItem icon={<i className="fa fa-fw fa-cog"></i>} title="관리자 기능">
		<SidebarMenuItem title="라이선스" to="/license" />
		<SidebarMenuItem title="기타" to="/misc" />
	</SidebarMenuItem>

	<SidebarMenuItem icon={<i className="fa fa-fw fa-copy"></i>} title="Pages">
		<SidebarMenuItem title="Register" to="/pages/register" />
		<SidebarMenuItem title="Login" to="/pages/login" />
		<SidebarMenuItem title="Forgot Password" to="/pages/forgot-password" />
		<SidebarMenuItem title="Lock Screen" to="/pages/lock-screen" />
		<SidebarMenuItem title="Error 404" to="/pages/error-404" />
		<SidebarMenuItem title="Confirmation" to="/pages/confirmation" />
		<SidebarMenuItem title="Success" to="/pages/success" />
		<SidebarMenuItem title="Danger" to="/pages/danger" />
		<SidebarMenuItem title="Coming Soon" to="/pages/coming-soon" />
		<SidebarMenuItem title="Timeline" to="/pages/timeline" />
	</SidebarMenuItem>
</SidebarMenu>;\
*/
