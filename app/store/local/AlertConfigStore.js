import { makeAutoObservable } from "mobx";
import Api from "../api";

class AlertConfigStore {
	/**@type Array<alertConfig> */
	alertConfigList = [];

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * @returns {Promise<{status: number, data: Array<alertConfig>}>}
	 */
	async getAlertConfigList() {
		let result = await Api.post("api/Alerts/list");
		this.alertConfigList = result.data;
		return result;
	}

	/**
	 * @param {number} id
	 * @returns {Promise<{status: number, data: alertConfig}>}
	 */
	async getAlertConfigInfo(id) {
		let result = await Api.post("api/Alerts/info", { id });
		return result;
	}

	/**
	 * @param {alertConfig} params
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async addAlertConfig(params) {
		let result = await Api.post("api/Alerts/register", params);
		return result;
	}

	/**
	 * @param {alertConfig} params
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async editAlertConfig(params) {
		let result = await Api.post("api/Alerts/update", { ...params, id: Number(params.id) });
		return result;
	}

	/**
	 * @param {number} id
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async reomveAlertConfig(id) {
		let result = await Api.post("api/Alerts/remove", { id });
		return result;
	}
}

/**
 * 	@typedef {object} alertConfig
 *  @prop {number} id
 *  @prop {string} geocode
 *  @prop {string} productid
 *  @prop {string} type
 *  @prop {string} warn
 *  @prop {string} err
 *  @prop {string} setup
 */

export default AlertConfigStore;
