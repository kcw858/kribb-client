// import React, { useEffect, useState } from "react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Navbar, Nav, NavItem, SidebarTrigger } from "./../../components";
// import { Dropdown } from "react-bootstrap";
import NavbarActivityFeed from "./NavbarActivityFeed";
// import { NavbarUser } from "./NavbarUser";
// import { LogoThemed } from "./../../routes/components/LogoThemed/LogoThemed";
import AccountStore from "../../store/global/AccountStore";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarAddOn } from "./../../components";
import NavBackButton from "./NavBackButton";
import MediaQuery from "react-responsive";
// import { randomAvatar } from "./../../utilities";

// const avatarImg = randomAvatar();
const avatarImg = require("../../images/avatars/my-info.png");
const backImg = require("../../images/avatars/arrow.png");

export const DefaultNavbar = observer(() => {
	// const { t, i18n } = useTranslation();
	const { t } = useTranslation();
	// const location = useLocation();
	// let paths = location.pathname.split("/");

	// useEffect(() => {
	// 	i18n.changeLanguage(window.localStorage.getItem("language"));
	// }, []);

	return (
		<Navbar light expand="xs" fluid>
			<Nav navbar>
				<MediaQuery minWidth={481}>
					<NavItem className="mr-3">
						<SidebarTrigger style={{ color: "#718096" }} />
					</NavItem>
				</MediaQuery>
				<MediaQuery maxWidth={480}>
					<NavItem className="mr-1">
						<SidebarTrigger style={{ color: "#718096" }} />
					</NavItem>
				</MediaQuery>

				<NavItem className="navbar-brand d-lg-none">
					<MediaQuery minWidth={481}>
						<span style={{ color: "#718096", fontWeight: "600" }}>{AccountStore.depart}</span>
					</MediaQuery>
					<MediaQuery maxWidth={480}>
						<span style={{ fontSize: "12px", color: "#718096", fontWeight: "600" }}>{AccountStore.depart}</span>
					</MediaQuery>
				</NavItem>
				{/* <NavItem className="d-none d-md-block">
					<span className="navbar-text">
						<Link to="/">
							<i className="fa fa-home"></i>
						</Link>
					</span>
					<span className="navbar-text px-2">
						<i className="fa fa-angle-right"></i>
					</span>
					<span className="navbar-text">
						<Link to={`/${paths[1]}`}>{paths[1]}</Link>
					</span>

					{paths[2] ? (
						<>
							<span className="navbar-text px-2">
								<i className="fa fa-angle-right"></i>
							</span>
							<span className="navbar-text">
								<Link to={`/${paths[1]}/${paths[2]}`}>{paths[2]}</Link>
							</span>
						</>
					) : (
						<span />
					)}

					{paths[3] ? (
						<>
							<span className="navbar-text px-2">
								<i className="fa fa-angle-right"></i>
							</span>
							<span className="navbar-text">
								<Link to={`/${paths[1]}/${paths[2]}/${paths[3]}`}>{paths[3]}</Link>
							</span>
						</>
					) : (
						<span />
					)}
				</NavItem> */}
			</Nav>
			<Nav>
				<NavItem className="d-none d-lg-block">
					<div style={{ textAlign: "end" }}>
						<span style={{ color: "#718096" }}>{t("mainNavBarText")}</span>
					</div>
				</NavItem>
			</Nav>
			<Nav navbar className="ml-auto">
				<div className="d-flex align-items-center justify-content-center">
					{/* <Link to="/myinfo/edit">
						<i className="fa fa-user" style={{color: 'white'}}></i>
					</Link> */}
					<Link to="/myinfo/edit" className="d-block mr-2">
						<div className="pl-2" style={{ height: "20px" }}>
							<img className="pl-1" src={avatarImg} alt="내정보" />
						</div>
						<MediaQuery minWidth={481}>
							<div style={{ paddingTop: "3px", fontWeight: 600 }}>
								<span style={{ fontSize: "13px", color: "#718096" }}>{t("menuMyInfo")}</span>
							</div>
						</MediaQuery>
						<MediaQuery maxWidth={480}>
							<div style={{ paddingTop: "3px", fontWeight: 600 }}>
								<span style={{ fontSize: "12px", color: "#718096" }}>{t("menuMyInfo")}</span>
							</div>
						</MediaQuery>
					</Link>
					<NavbarActivityFeed className="mr-2" />
					<NavBackButton className="mr-2" />
					&nbsp;&nbsp;&nbsp;
					{/* <Dropdown
					className="mr-2"
						onSelect={(value) => {
							window.localStorage.setItem("language", value);
							i18n.changeLanguage(value);
						}}
					>
						<Dropdown.Toggle variant="light" size="sm">
							{i18n.language == "ko" ? "한국어" : "ENGLISH"}
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item eventKey={"ko"}>한국어</Dropdown.Item>
							<Dropdown.Item eventKey={"en"}>ENGLISH</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown> */}
					{/* &nbsp;&nbsp;
					<div className="input-group input-group-sm">
						<div className="input-group-prepend">
							<span className="input-group-text">
								<i className="fa fa-fw fa-lock" />
							</span>
						</div>
						<input
							type="text"
							value={AccountStore.lockInterval}
							style={{ width: window["mode"] == "desktop" ? 50 : 40, textAlign: "center" }}
							className="form-control bg-white"
							onChange={(e) => AccountStore.setLockInterval(e.currentTarget.value)}
						/>
						<div className="input-group-append">
							<span className="input-group-text">{t("menuMin")}</span>
						</div>
					</div>
					&nbsp;&nbsp; */}
					{/* <NavbarUser className="ml-2" /> */}
				</div>
			</Nav>
		</Navbar>
	);
});
