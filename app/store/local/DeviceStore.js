import { makeAutoObservable } from "mobx";
import Api from "../api";

class DeviceStore {
	/**@type {Array<device>} */
	deviceList = [];

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * @returns {Promise<{status: number, data: Array<device>}>}
	 */
	async getDeviceList() {
		let result = await Api.post("/api/Devices/AllList");

		if (result.status == 200) {
			this.deviceList = result.data;
		}

		return result;
	}

	/**
	 * @param {string} productid
	 * @returns {Promise<{status: number, data: Array<device>}>}
	 */
	async getDeviceListByProduct(productid) {
		return await Api.post("/api/Devices/list", { productid });
	}

	/**
	 * @param {string} id
	 * @returns {Promise<{status: number, data: device}>}
	 */
	async getDeviceInfo(id) {
		return await Api.post("/api/Devices/info", { id });
	}

	/**
	 * @param {device} params
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async addDevice(params) {
		return await Api.post("/api/Devices/register", params);
	}

	/**
	 * @param {device} params
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async editDevice(params) {
		return await Api.post("/api/Devices/update", params);
	}

	/**
	 * @param {string} id
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async removeDevice(id) {
		return await Api.post("/api/Devices/remove", { id });
	}
}

/**
 *  2021.09.03
 *	@typedef {object} device
 *  @prop {string} id
 *  @prop {string} productid
 *  @prop {string} company
 *  @prop {string} name
 *  @prop {string} macaddr
 *  @prop {string} depart
 *  @prop {string} addr
 *  @prop {string} geocode
 *  @prop {string} lati
 *  @prop {string} longi
 *  @prop {string} firmware
 *  @prop {string} serverip
 *  @prop {string} serverport
 *  @prop {string} memo
 *  @prop {string} control
 *  @prop {string} status
 *  @prop {boolean} on_nh3
 *  @prop {boolean} on_h2s
 *  @prop {boolean} on_odor
 *  @prop {boolean} on_voc
 *  @prop {boolean} on_indol
 *  @prop {boolean} on_temp
 *  @prop {boolean} on_humi
 *  @prop {boolean} on_sen1
 *  @prop {boolean} on_sen2
 *  @prop {boolean} on_sen3
 *  insys 장비
//  {string } measect
//  {string } meacycle
//  {string } flushsect
//  {string } restsect
 *  @prop {string } multiple
 *  @prop {string } ratio
 *  @prop {string } constant
 *  @prop {string } resolution
 *  @prop {string } deci
 *  jtron장비
 *  @prop {string} rex_nh3
 *  @prop {string} rex_h2s
 *  @prop {string} rex_odor
 *  @prop {string} rex_voc
 *  @prop {string} rex_ou
 *  @prop {string} min1
 *  @prop {string} min2
 *  @prop {string} min3
 *  @prop {string} min4
 *  @prop {string} min5
 *  @prop {string} rsvtime
 *  @prop {string} rsvproc
 *  @prop {string} odorlev
 *  @prop {string} autoproc
 */
export default DeviceStore;