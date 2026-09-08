import _ from "lodash";
import { makeAutoObservable } from "mobx";
import Api from "../api";
import { store } from "react-notifications-component";
import React from "react";

class AlertStore {
	/**@type {Array<alert>} */
	alertList = [];
	alertJsxList = [];

	// 대시보드의 알림 현황
	// alertCurrent = {alerts: [], devnum: "", devon: "", h2s: "", indol: "", nh3: "", odor: "", voc: ""};

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * @returns {Promise<{status: number, data: Array<alert>}>}
	 */
	async getAlertList() {
		try {
			let result = await Api.postSilently("/api/Alerts/todoList");
			if (result.status == 200) {
				/**@type {Array<alert>} */
				let data = result.data;
				let alertList = [...this.alertList];
				let alertJsxList = [...this.alertJsxList];
	
				for (let alert of data) {
					if (_.find(alertList, ["id", alert.id])) {
						continue;
					} else {
						alertList.push(alert);
					}
	
					/**@type {"danger"|"warning"|"default"|"success"|"info"} */
					let type = "info";
					let title = "";
					switch (String(alert.type).toLowerCase()) {
						case "fatal":
							type = "danger";
							title = "Fatal!(심각)";
							break;
						case "danger":
							type = "danger";
							title = "Danger!(위험)";
							break;
						case "warn":
							type = "warning";
							title = "Warning!(경고)";
							break;
						case "success":
							type = "success";
							title = "Success!(성공)";
							break;
					}
	
					let content = (
						<div className={`notification__content notification__item--${type}`}>
							<div className="notification__message">
								<div className="row">
									<div className="col col-3 my-auto">
										<i className="fa fa-3x fa-exclamation-triangle"></i>
									</div>
									<div className="col my-auto">
										<div className="row">
											<span className="font-weight-bold">
												{title} - {alert.alertid}
											</span>
										</div>
										<div className="row">
											<span>{alert.content}</span>
										</div>
										<div className="row">
											<span>
												{alert.kind} - {alert.value}
											</span>
										</div>
										<div className="row">
											<span>{alert.times}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
	
					alertJsxList.push(content);
	
					store.addNotification({
						content: content,
						onRemoval: () => {},
						type: type,
						insert: "top",
						container: "top-right",
						slidingEnter: {
							duration: 300,
						},
						slidingExit: {
							duration: 300,
						},
						dismiss: {
							duration: 0,
						},
					});
				}
	
				this.alertList = alertList;
				this.alertJsxList = alertJsxList;
			}
	
			return result;
		}
		catch (error) {
			console.error(error);
		}
	}

	async getAlertListLoop() {
		await this.getAlertList();
		this.timeoutAlertListId = setTimeout(this.getAlertListLoop.bind(this), 5 * 1e3);
	}

	async stopAlertListLoop() {
		clearTimeout(this.timeoutAlertListId);
	}

	/**
	 * @returns {Promise<{status: number, data: object}>}
	 */
	async getAlertCurrent() {
		try {
			let result = await Api.postSilently("/api/Menu/currcond");
			if (result.status == 200) {
				// 대시보드의 알림 현황
				this.alertCurrent = result.data;
			}

			return result;
		}
		catch (error) {
			console.error(error);
		}
	}

	async getAlertCurrentLoop() {
		await this.getAlertCurrent();
		this.timeoutAlertCurrentId = setTimeout(this.getAlertCurrentLoop.bind(this), 5 * 1e3);
	}

	async stopAlertCurrentLoop() {
		clearTimeout(this.timeoutAlertCurrentId);
	}
}

/**
 * 	@typedef {object} alert
 * 	@prop {number} id
 *	@prop {number} alertid
 *	@prop {string} status
 *	@prop {string} type
 *	@prop {string} name
 *	@prop {string} kind
 *	@prop {string} content
 *	@prop {string} value
 *	@prop {string} times
 */

export default new AlertStore();
