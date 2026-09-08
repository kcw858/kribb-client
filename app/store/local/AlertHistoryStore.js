import { makeAutoObservable } from "mobx";
import Api from "../api";

class AlertHistoryStore {
	page = 1;
	sizePerPage = 10;
	sortField = "";
	sortOrder = "";
	search = "";
	totalSize = 0;
	fromDate = "";
	toDate = "";

	/**@type Array<alertHistory> */
	alertHistoryList = [];

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * @param {import("../../components/CustomTable/CustomRemoteTable").CustomRemoteTableParams} params
	 * @returns {Promise<{status: number, data: {totalSize: number, pagedList: Array<alertHistory>}}>}
	 */
	async getAlertHistoryList(params) {
		let result = await Api.post("/api/Alerts/history", params);
		if (result.status == 200) {
			this.page = params.page;
			this.sizePerPage = params.sizePerPage;
			this.sortField = params.sortField;
			this.sortOrder = params.sortOrder;
			this.search = params.search;
			this.fromDate = params.fromDate;
			this.toDate = params.toDate;
			this.totalSize = result.data.totalSize;
			this.alertHistoryList = result.data.pagedList;
		}

		return result;
	}
}

/**
 * 	@typedef {object} alertHistory
 *  @prop {number} id
 *  @prop {string} status
 *  @prop {string} type
 *  @prop {string} name
 *  @prop {string} kind
 *  @prop {string} content
 *  @prop {string} value
 *  @prop {string} times
 */

export default AlertHistoryStore;
