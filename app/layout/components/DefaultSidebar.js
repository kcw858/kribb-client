import React from "react";
import { Link } from "react-router-dom";

import { Sidebar, SidebarTrigger } from "./../../components";

import SidebarMiddleNav from "./SidebarMiddleNav";

import { SidebarBottomA } from "../../routes/components/Sidebar/SidebarBottomA";
import { LogoThemed } from "../../routes/components/LogoThemed/LogoThemed";
import { useTranslation } from "react-i18next";

export function DefaultSidebar() {
	useTranslation();

	return (
		//사이드바
		<Sidebar>
			{/* START SIDEBAR-OVERLAY: Close (x) */}
			<Sidebar.Close>
				<SidebarTrigger tag={"a"} href="#">
					<i className="fa fa-times-circle fa-fw text-dark"/>
				</SidebarTrigger>
			</Sidebar.Close>
			{/* START SIDEBAR-OVERLAY: Close (x) */}

			{/* START SIDEBAR: Only for Desktop */}
			<Sidebar.HideSlim>
				<Sidebar.Section>
					<div className="row">
						<div className="col">
							<div className="d-flex justify-content-center">
								<Link to="/" className="sidebar__brand">
									{/* SIDEBAR LOGO */}
									<div> 
										{/* 사이드바 로고 */}
										<LogoThemed checkBackground height="35" /> 
									</div>
								</Link>
							</div>
						</div>
					</div>
				</Sidebar.Section>
			</Sidebar.HideSlim>
			{/* END SIDEBAR: Only for Desktop */}

			{/* START SIDEBAR: Only for Mobile */}
			<Sidebar.MobileFluid>
				{/* <SidebarTopA /> */}

				<Sidebar.Section fluid cover >
					{/* SIDEBAR: Menu */}
					<SidebarMiddleNav />
				</Sidebar.Section>

				<SidebarBottomA />
			</Sidebar.MobileFluid>
			{/* END SIDEBAR: Only for Mobile */}
		</Sidebar>
	);
}
