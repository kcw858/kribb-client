import { makeAutoObservable } from "mobx";
import Api from "../api";

class LogStore {
	page = 1;
	sizePerPage = 10;
	sortField = "";
	sortOrder = "";
	search = "";
	totalSize = 0;
	fromDate = "";
	toDate = "";

	/**@type Array<log> */
	logList = [];

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * @param {import("../../components/CustomTable/CustomRemoteTable").CustomRemoteTableParams} params
	 * @returns {Promise<{status: number, data: {totalSize: number, pagedList: Array<log>}}>}
	 */
	async getLogList(params) {
		let result = await Api.post("api/WorkLogs/PagedList", params);
		if (result.status == 200) {
			this.page = params.page;
			this.sizePerPage = params.sizePerPage;
			this.sortField = params.sortField;
			this.sortOrder = params.sortOrder;
			this.search = params.search;
			this.fromDate = params.fromDate;
			this.toDate = params.toDate;
			this.totalSize = result.data.totalSize;
			this.logList = result.data.pagedList;
		}

		return result;
	}
}

/**
 * 	@typedef {object} log
 *  @prop {number} id
 *  @prop {string} userid
 *  @prop {string} part
 *  @prop {string} level
 *  @prop {string} content
 *  @prop {string} times
 */

export default LogStore;
