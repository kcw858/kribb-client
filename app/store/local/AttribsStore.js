import { makeAutoObservable } from "mobx";
import Api from "../api";

class AttribsStore {
	/**@type {Array<attribs>} */
	AttribsList = [];

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * @param {string} productid
	 * @returns {Promise<{status: number, data: Array<attribs>}>}
	 */
	async getAttribsList(productid) {
		let result = await Api.post("/api/Attribs/list", { productid });
		if (result.status == 200) {
			this.AttribsList = result.data;
		}
		return result;
	}

	/**
	 * @param {number} id
	 * @returns {Promise<{status: number, data: attribs}>}
	 */
	async getAttribsInfo(id) {
		let result = await Api.post("/api/Attribs/info", { id });
		return result;
	}

	/**
	 * @param {attribs} params
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async addAttribs(params) {
		return await Api.post("/api/Attribs/register", params);
	}

	/**
	 * @param {attribs} params
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async editAttribs(params) {
		return await Api.post("/api/Attribs/update", params);
	}

	/**
	 * @param {number} id
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async removeAttribs(id) {
		return await Api.post("/api/Attribs/remove", { id });
	}

}

export default AttribsStore;

/**
 *  2021.08.18
 *	@typedef {object} attribs
 *  @prop {number} id
 *  @prop {string} productid
 *  @prop {string} type
 *  @prop {string} alias
 *  @prop {string} name
 *  @prop {string} onoff
 *  @prop {string} label
 *  @prop {string} spec
 *  @prop {string} chemiunit
 *  @prop {string} threshold
 *  @prop {string} min
 *  @prop {string} max
 *  @prop {string} elecunit
 *  @prop {string} note
 */

