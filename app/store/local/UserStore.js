import { makeAutoObservable } from "mobx";
import Api from "../api";

class UserStore {
	/**@type {Array<user>} */
	userList = [];

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * @returns {Promise<{status: number, data: Array<user>}>}
	 */
	async getUserList() {
		let result = await Api.post("api/Users/UserList");
		this.userList = result.data || [];
		return result;
	}

	/**
	 * @returns {Promise<{status: number, data: Array<user>}>}
	 * user : the same depart && geocode
	 * admin : the same geocode
	 * super : all = getUserList
	 */
	async getUsers4Geo() {
		let result = await Api.post("api/Menu/users4geo");
		this.userList = result.data || [];
		return result;
	}

	/**
	 * @param {string} userid
	 * @returns {Promise<{status: number, data: import("../global/AccountStore").userInfo}>}
	 */
	async getUserInfo(userid) {
		return await Api.post("api/Users/info", { userid });
	}

	/**
	 * @param {user} parmas
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async addUser(parmas) {
		try {
			return await Api.post("api/Users/register", parmas);
		} catch (error) {
			return await Api.post("api/Users/register", parmas);
		}
	}

	/**
	 * @param {string} userid
	 * @param {string} role
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async setRole(userid, role) {
		return await Api.post("api/Users/setRole", { userid, role });
	}

	/**
	 * @param {string} userid
	 * @param {string} geocode
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async setgeocode(userid, geocode) {
		console.log("geocode", geocode);
		return await Api.post("api/Users/setgeocode", { userid, geocode });
	}

	/**
	 * @param {string} userid
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async confirmRegister(userid) {
		return await Api.post("api/Users/confirm", { userid });
	}

	/**
	 * @param {string} userid
	 * @param {string} username
	 * @param {string} email
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async resetPassword(userid, username, email) {
		return await Api.post("api/Users/newpassword", { userid, username, email });
	}

	/**
	 * @param {string} userid
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async remoteUser(userid) {
		return await Api.post("api/Users/remove", { userid });
	}
}

/**
 * 	@typedef {object} user
 * 	@prop {string} userid
 * 	@prop {string} username
 * 	@prop {string} depart
 * 	@prop {string} position
 * 	@prop {string} email
 *  @prop {string} geocode
 * 	@prop {string} phone
 * 	@prop {string} role
 */

export default UserStore;
