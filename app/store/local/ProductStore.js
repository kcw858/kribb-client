import { makeAutoObservable } from "mobx";
import Api from "../api";

class ProductStore {
	/**@type {Array<product>} */
	productList = [];

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * @returns {Promise<{status: number, data: Array<product>}>}
	 */
	async getProductList() {
		let result = await Api.post("/api/Products/List");
		if (result.status == 200) {
			this.productList = result.data;
		}

		return result;
	}

	/**
	 * @param {string} id
	 * @returns {Promise<{status: number, data: product}>}
	 */
	async getProductInfo(id) {
		let result = await Api.post("/api/Products/info", { id });
		return result;
	}

	/**
	 * @param {product} params
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async addProduct(params) {
		return await Api.post("/api/Products/register", params);
	}

	/**
	 * @param {product} params
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async editProduct(params) {
		return await Api.post("/api/Products/update", params);
	}

	/**
	 * @param {string} id
	 * @returns {Promise<{status: number, data: any}>}
	 */
	async removeProduct(id) {
		return await Api.post("/api/Products/remove", { id });
	}
}

export default ProductStore;

/**
 *  2021.08.18
 *	@typedef {object} product
 * 	@prop {string} id
 *	@prop {string} name
 *  @prop {string} company
 *	@prop {string} regist
 *	@prop {string} release
 *	@prop {string} purpose
 *	@prop {string} note
 */
