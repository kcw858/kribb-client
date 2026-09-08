import _ from "lodash";
import { makeAutoObservable } from "mobx";
import Api from "../api";
import AlertStore from "./AlertStore";
import MonitorStore from "./MonitorStore";

class AccountStore {
	lockInterval;
	userid = window.localStorage.getItem("userid") || "";
	id = 0;
	username = "";
	geocode = "";
	depart = "";
	position = "";
	email = "";
	phone = "";
	role = "";
	onweb = true;
	onmail = true;
	onsms = true;
	onpush = true;
	token = "";
	authTime = 0;
	/**@type {Array<geocode>} */
	geocodeList = [];

	constructor() {
		let interval = Number(window.localStorage.getItem("lockInterval"));
		interval = isNaN(interval) || !isFinite(interval) || !interval || interval < 1 ? 5 : interval;
		this.lockInterval = interval;
		makeAutoObservable(this);
	}

	/**
	 * @param {string} userid
	 * @param {string} userpw
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async login(userid, userpw) {
		let result = await Api.post("/api/Users/Login", { userid, userpw });

		if (result.status == 200) {
			Api.setToken(result.data.token, this.setLockScreen.bind(this));
			window.localStorage.setItem("userid", String(result.data.userid));

			//geo정보를 저장하여 맵화면 초기화시 중심좌표와 척도를 고정한다.
			this.geocodeList = (await this.getgeocodeList()).data;
			// let geocodeList = (await AccountStore.getGeocodeList()).data;
			let geoRecord = _.find(this.geocodeList, ["id", result.data.geocode]);
			if (geoRecord != null) {
				window.localStorage.setItem("geoRecord", JSON.stringify(geoRecord));
			}

			this.id = result.data.id;
			this.userid = result.data.userid;
			this.username = result.data.username;
			this.geocode = result.data.geocode;
			this.depart = result.data.depart;
			this.position = result.data.position;
			this.email = result.data.email;
			this.phone = result.data.phone;
			this.role = result.data.role;
			this.token = result.data.token;
			this.onweb = result.data.onweb;
			this.onmail = result.data.onmail;
			this.onsms = result.data.onsms;
			this.onpush = result.data.onpush;
			this.authTime = new Date().getTime();

			//======================로그인 확인===================
			// console.log("id==="+result.data.id)
			// console.log("userid==="+result.data.userid)
			// console.log("username==="+result.data.username)
			// console.log("geocode==="+result.data.geocode)
			// console.log("depart==="+result.data.depart)
			// console.log("position==="+result.data.position)
			// console.log("email==="+result.data.email)
			// console.log("phone==="+result.data.phone)
			// console.log("role==="+result.data.role)
			// console.log("token==="+result.data.token)
			// console.log("onweb==="+result.data.onweb)
			// console.log("onmail==="+result.data.onmail)
			// console.log("onsms==="+result.data.onsms)
			// console.log("onpush==="+result.data.onpush)
			// console.log("authTime==="+new Date().getTime())
			//======================로그인 확인===================

			// @ts-ignore 로그인시 알림과 장비내역을 바로 한번 가져옴
			// window["mode"] != "tablet" && AlertStore.getAlertListLoop();
			// window["mode"] != "tablet" && AlertStore.getAlertCurrentLoop();
			// window["mode"] != "tablet" && MonitorStore.getMonitorList();
			AlertStore.getAlertListLoop();
			// AlertStore.getAlertCurrentLoop();
			MonitorStore.getMonitorList();
		}

		return result;
	}

	async signOut() {
		this.id = 0;
		this.userid = "";
		this.username = "";
		this.geocode = "";
		this.depart = "";
		this.position = "";
		this.email = "";
		this.phone = "";
		this.role = "";
		this.token = "";
		this.authTime = 0;

		window.localStorage.removeItem("userid");
	}

	/**
	 * @param {userInfo} params
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async updateMyInfo(params) {
		return await Api.post("api/Users/update", params);
	}

	updateRole(role) {
		this.role = role;
	}

	updategeocode(geocode) {
		this.geocode = geocode;
	}

	setLockScreen() {
		this.authTime = 0;
	}

	setLockInterval(interval) {
		interval = Number(interval);
		if (isNaN(interval) || !isFinite(interval) || !interval || interval < 1) {
			return;
		}

		this.lockInterval = interval;
		window.localStorage.setItem("lockInterval", interval);
	}

	isLock() {
		if (window["mode"] == "tablet") {
			return !this.token || new Date().getTime() - this.authTime > 10 * 60 * 1e3;
		} else {
			return !this.token || new Date().getTime() - this.authTime > this.lockInterval * 60 * 1e3;
		}
	}

	checkIsLockLoop() {
		if (this.isLock()) {
			// @ts-ignore
			window["mode"] != "tablet" && AlertStore.stopAlertListLoop();
			this.setLockScreen();
		}

		setTimeout(this.checkIsLockLoop.bind(this), 1e3);
	}

	/**
	 * @returns {Promise<{status: number, data: geocode[]}>}
	 */
	async getgeocodeList() {
		let response = await Api.post("api/Menu/geocodeList");
		response.data = _.orderBy(response.data, ["metro", "name"], ["asc", "asc"]);
		return response;
	}

	getGeotextList() {
		let geoList = [];
		for (let record of this.geocodeList) {
			if (record.metro === record.name) {
				record.name = "";
				geoList.push(record.metro + record.name);
				//console.log("record.metro", record.metro);
			} else {
				geoList.push(record.metro + " " + record.name);
				//console.log("record.metro", record.metro, "record.name", record.name);
			}
		}
		geoList.sort();
		// geoList.unshift("전국");
		const firstGeo = geoList.splice(175, 1);
		geoList.splice(0, 0, firstGeo[0]);

		// const set = new Set(geoList);
		// geoList = [...set];
		return geoList;
	}

	getGeocodeByGeotext(text) {
		let geoValues = (_.trim(text) || "").split(" ");

		if (geoValues.length != 2) {
			geoValues = [`${geoValues}`,""]
		}
		console.log("geoValuessssssssss", geoValues);
		let record = _.find(this.geocodeList, (record) => record.metro == geoValues[0] && (record.name == geoValues[1] || null));
		console.log("record", this.geocodeList);
		console.log("record", record);
		console.log("record.metro", record.metro);
		console.log("geoValues[0]", geoValues[0]);
		console.log("===================================");
		console.log("record.name", record.name);
		console.log("geoValues[1]", geoValues[1]);
		console.log("record.id", record.id);
		return record ? record.id : "";
	}

	getGeotextBygeocode(code) {
		let record = _.find(this.geocodeList, (record) => record.id == code);
		if (record.metro === record.name) {
			return record ? record.metro : "";
		} else {
			return record ? record.metro + " " + record.name : "";
		}
	}
}

/**
 * 	@typedef {object} userInfo
 * 	@prop {string} userid
 *  @prop {string} userpw
 * 	@prop {string} username
 * 	@prop {string} geocode
 * 	@prop {string} depart
 * 	@prop {string} position
 * 	@prop {string} email
 * 	@prop {string} phone
 * 	@prop {string} role
 *	@prop {boolean} onweb
 *	@prop {boolean} onmail
 *	@prop {boolean} onsms
 *	@prop {boolean} onpush
 * 	@prop {boolean?} isConfirm
 */

/**
 * 	@typedef {object} geocode
 *	@prop {string} id
 *	@prop {string?} name
 *	@prop {string} metro
 *	@prop {string} district
 *	@prop {string} lati
 *	@prop {string} longi
 *	@prop {string} measure
 *	@prop {string} exurl
 */
export default new AccountStore();
