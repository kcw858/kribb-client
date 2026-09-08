import { makeAutoObservable } from "mobx";
import Api from "../api";

class AlertRecipentStore {
	/**@type {Array<alertUser>} */
	// alertUserList = [];

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * @returns {Promise<{status: number, data: alertUsage}>}
	 */
	async getAlertUsage() {
		let result = await Api.post("api/Menu/alertusage");
		return result;
	}

	// 알림은 SMS만 있다고 가정한다(Web 알림은 기본).
	// 전화번호를 기준으로 알림사용자를 등록하거나 삭제만 가능하다.
	// 한명의 사용자(userid)로 복수의 전화번호를 등록하기 위해서는 사용자를 선택한 후 전화번호를 바꿔서 등록하면 된다.
	// 알림 사용자를 삭제할 때도 기준은 전화번호를 기준으로 하면 된다.
	/**
	 * @param {alertUser} params
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async addAlertUser(params) {
		let result = await Api.post("api/Alerts/useradd", params);
		return result;
	}

	/**
	 * @param {string} id
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async removeAlertUser(id) {
		let result = await Api.post("api/Alerts/userdel", { id });
		return result;
	}
}

/**
 * 	@typedef {object} alertUsage
 * 	@prop {number} all
 * 	@prop {number} month
 * 	@prop {number} year
 * 	@prop {Array<alertUser>} users
 */

/**
 * 	@typedef {object} alertUser
 *  @prop {string} id // 알림 사용자 id로 전화번호로 이해하면 된다. 한명의 사용자가 복수의 전화번호를 사용할 수 있기 때문이다.
 * 	@prop {string} userid
 * 	@prop {string} name
 * 	@prop {string} telno
 */

export default AlertRecipentStore;
