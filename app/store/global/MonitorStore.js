import { makeAutoObservable } from "mobx";
import Api from "../api";
import _ from "lodash";
import { getOdorLevelColor } from "../../routes/Dashboards/Monitor/components/OdorColorLegend";

class MonitorStore {
	/**@type {Array<monitorInfo>} */
	monitorInfoList = [];

	/**@type {summury} */
	summury = { onoff: [124, 32], sensor: [30, 126], prediction: [6, 150], alert: [20, 136] };

	constructor() {
		makeAutoObservable(this);
	}

	async getMonitorList() {
		try {
			let boundsDevice = await this.getBoundsDevice();
			let boundsChart = await this.getBoundsChart();

			// let chart = await this.getDeviceChart();
			let marker = await this.getDeviceMarker();

			let result = [];
			if (!boundsDevice || !boundsChart || !marker) {
				return;
			}

			for (let key in marker) {
				if (!boundsDevice[key]) {
					continue;
				}

				/**@type {{[key: string]: any}} */
				let record = marker[key];
				record.id = boundsDevice[key].id;
				record.status = boundsDevice[key].status;
				record.productid = boundsDevice[key].productid;
				record.productName = boundsDevice[key].productName;
				record.control = boundsDevice[key].control;
				record.depart = boundsDevice[key].depart;
				record.addr = boundsDevice[key].addr;

				if (boundsChart[record.id]) {
					record.nh3List = boundsChart[record.id]["nh3List"];
					record.h2sList = boundsChart[record.id]["h2sList"];
					record.odorList = boundsChart[record.id]["odorList"];
					record.vocList = boundsChart[record.id]["vocList"];
					record.sensingDtList = boundsChart[record.id]["sensingDtList"];
				} else {
					record.nh3List = [];
					record.h2sList = [];
					record.odorList = [];
					record.vocList = [];
					record.sensingDtList = [];
				}
				record.indolList = [];
				record.co2List = [];
				// record.id = chart[key].id;
				// record.status = chart[key].status
				// record.productid = chart[key].productid;
				// record.productName = chart[key].productName;
				// record.control = chart[key].control;
				// record.depart = chart[key].depart;
				// record.addr = chart[key].addr;
				// record.nh3List = _.map(chart[key].nH3, (v) => v.y);
				// record.h2sList = _.map(chart[key].h2S, (v) => v.y);
				// record.co2List = _.map(chart[key].co2, (v) => v.y);
				// record.vocList = _.map(chart[key].voc, (v) => v.y);
				// record.indolList = _.map(chart[key].indol, (v) => v.y);
				// record.odorList = _.map(chart[key].odor, (v) => v.y);
				record.level = Number(record.silution);
				record.levelColor = getOdorLevelColor(record.level);
				result.push(record);
			}
			// @ts-ignore
			this.monitorInfoList = result;
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * @returns {Promise<{[key: string]: deviceMarker}>}
	 */
	async getDeviceMarker() {
		let result = await Api.postSilently("/api/v2/Menu/Monitoring");
		if (result.status == 200) {
			// 임시로 브라우저에서 mV 단위를 ppm으로 보정함.
			let beforeCalibration = _.keyBy(result.data, "name");

			let calibratedData;

			if (beforeCalibration["누리농장01"]) {
				calibratedData = beforeCalibration["누리농장01"];
				calibratedData.odor = ((calibratedData.odor) / 10).toFixed(2);
			}


			if (beforeCalibration["성지농장-외부-01"]) {
				calibratedData = beforeCalibration["성지농장-외부-01"];
				calibratedData.nh3 = ((calibratedData.nh3 - 300) / 15).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			if (beforeCalibration["성지농장-내부-01"]) {
				calibratedData = beforeCalibration["성지농장-내부-01"];
				calibratedData.nh3 = ((calibratedData.nh3 - 135) / 4.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			if (beforeCalibration["포동농장-01-내부"]) {
				calibratedData = beforeCalibration["포동농장-01-내부"];
				calibratedData.nh3 = ((calibratedData.nh3 - 65.2) / 4.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 120) / 333.33).toFixed(2);
			}

			if (beforeCalibration["포동농장-01-외부"]) {
				calibratedData = beforeCalibration["포동농장-01-외부"];
				calibratedData.nh3 = ((calibratedData.nh3 - 65.2) / 4.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 120) / 333.33).toFixed(2);
			}

			if (beforeCalibration["신천농장-01-내부"]) {
				calibratedData = beforeCalibration["신천농장-01-내부"];
				calibratedData.nh3 = ((calibratedData.nh3 - 170) / 2.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			if (beforeCalibration["신천농장-01-외부"]) {
				calibratedData = beforeCalibration["신천농장-01-외부"];
				calibratedData.nh3 = ((calibratedData.nh3 - 170) / 2.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			if (beforeCalibration["태웅-01-내부"]) {
				calibratedData = beforeCalibration["태웅-01-내부"];
				calibratedData.nh3 = ((calibratedData.nh3 - 170) / 2.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			if (beforeCalibration["태웅-01-외부"]) {
				calibratedData = beforeCalibration["태웅-01-외부"];
				calibratedData.nh3 = ((calibratedData.nh3 - 170) / 2.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			if (beforeCalibration["상원농장-01-내부"]) {
				calibratedData = beforeCalibration["상원농장-01-내부"];
				calibratedData.nh3 = ((calibratedData.nh3 - 170) / 2.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			if (beforeCalibration["상원농장-01-외부"]) {
				calibratedData = beforeCalibration["상원농장-01-외부"];
				calibratedData.nh3 = ((calibratedData.nh3 - 170) / 2.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			if (beforeCalibration["축산과학원:제주01"]) {
				calibratedData = beforeCalibration["축산과학원:제주01"];
				calibratedData.nh3 = ((calibratedData.nh3 - 65.2) / 9).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			if (beforeCalibration["대덕산업단지환경사업소-in-01"]) {
				calibratedData = beforeCalibration["대덕산업단지환경사업소-in-01"];
				calibratedData.nh3 = ((calibratedData.nh3 - 45) / 9.35).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 120) / 33.33).toFixed(2);
			}

			//대덕산업단지환경사업소-out-01 - 1374로 회로 open 상태임
			if (beforeCalibration["대덕산업단지환경사업소-out-01"]) {
				calibratedData = beforeCalibration["대덕산업단지환경사업소-out-01"];
				calibratedData.nh3 = ((calibratedData.nh3 - 170) / 5.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 120) / 33.33).toFixed(2);
			}

			if (beforeCalibration["이천분뇨자원화센터-01-내부"]) {
				calibratedData = beforeCalibration["이천분뇨자원화센터-01-내부"];
				calibratedData.nh3 = ((calibratedData.nh3 - 65.2) / 4.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			if (beforeCalibration["이천분뇨자원화센터-01-외부"]) {
				calibratedData = beforeCalibration["이천분뇨자원화센터-01-외부"];
				calibratedData.nh3 = ((calibratedData.nh3 - 155) / 9.5).toFixed(1);
				calibratedData.h2s = ((calibratedData.h2s - 155) / 333.33).toFixed(2);
			}

			return _.keyBy(result.data, "name");
		} else {
			return {};
		}
	}

	/**
	 * @returns {Promise<{[key: string]: boundsDevice}>}
	 */
	async getBoundsDevice() {
		let result = await Api.postSilently("/api/v2/Menu/BoundsDevice");

		if (result.status == 200) {
			// 임시로 포동농장과 신천농장에 대해서 브라우저 mV 단위를 ppm으로 보정함.
			// let beforeCalibration = _.keyBy(result.data, "name");

			return _.keyBy(result.data, "name");
		} else {
			return {};
		}
	}

	/**
	 * @returns {Promise<{[key: any]: getBoundsChart}>}
	 */
	async getBoundsChart() {
		let result = await Api.postSilently("/api/v2/Menu/BoundsChart");

		if (result.status == 200) {
			// 임시로 포동농장과 신천농장에 대해서 브라우저 mV 단위를 ppm으로 보정함.
			let beforeCalibration = {};

			for (let record of result.data) {
				beforeCalibration[record["deviceid"]] = beforeCalibration[record["deviceid"]] || [];
				beforeCalibration[record["deviceid"]].push(record);
			}

			for (let key in beforeCalibration) {
				beforeCalibration[key].nh3List = _.map(beforeCalibration[key], "nh3").reverse();
				beforeCalibration[key].h2sList = _.map(beforeCalibration[key], "h2s").reverse();
				beforeCalibration[key].odorList = _.map(beforeCalibration[key], "odor").reverse();
				beforeCalibration[key].vocList = _.map(beforeCalibration[key], "voc").reverse();
				beforeCalibration[key].sensingDtList = _.map(beforeCalibration[key], "sensingDt").reverse();
			}

			// calibrating

			// 누리농장01
			if (beforeCalibration["E831CD283E98"]) {
				beforeCalibration["E831CD283E98"].odorList = beforeCalibration["E831CD283E98"].odorList.map(
					(e) => (e = ((e) / 10).toFixed(2))
				);
			}

			// "성지농장-외부-01"
			if (beforeCalibration["246F28DAE6C8"]) {
				beforeCalibration["246F28DAE6C8"].nh3List = beforeCalibration["246F28DAE6C8"].nh3List.map(
					(e) => (e = ((e - 300) / 15).toFixed(1))
				);
				beforeCalibration["246F28DAE6C8"].h2sList = beforeCalibration["246F28DAE6C8"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}

			// "성지농장-내부-01"
			if (beforeCalibration["F4CFA28B492C"]) {
				beforeCalibration["F4CFA28B492C"].nh3List = beforeCalibration["F4CFA28B492C"].nh3List.map(
					(e) => (e = ((e - 135) / 4.5).toFixed(1))
				);
				beforeCalibration["F4CFA28B492C"].h2sList = beforeCalibration["F4CFA28B492C"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}

			// "포동농장-01-내부"
			if (beforeCalibration["246F28DAE43C"]) {
				beforeCalibration["246F28DAE43C"].nh3List = beforeCalibration["246F28DAE43C"].nh3List.map(
					(e) => (e = ((e - 65.2) / 4.5).toFixed(1))
				);
				beforeCalibration["246F28DAE43C"].h2sList = beforeCalibration["246F28DAE43C"].h2sList.map(
					(e) => (e = ((e - 120) / 333.33).toFixed(2))
				);
			}
			// "포동농장-01-외부"
			if (beforeCalibration["F4CFA28C0274"]) {
				beforeCalibration["F4CFA28C0274"].nh3List = beforeCalibration["F4CFA28C0274"].nh3List.map(
					(e) => (e = ((e - 65.2) / 4.5).toFixed(1))
				);
				beforeCalibration["F4CFA28C0274"].h2sList = beforeCalibration["F4CFA28C0274"].h2sList.map(
					(e) => (e = ((e - 120) / 333.33).toFixed(2))
				);
			}
			// "신천농장-01-내부"
			if (beforeCalibration["246F28DAE40C"]) {
				beforeCalibration["246F28DAE40C"].nh3List = beforeCalibration["246F28DAE40C"].nh3List.map(
					(e) => (e = ((e - 170) / 2.5).toFixed(1))
				);
				beforeCalibration["246F28DAE40C"].h2sList = beforeCalibration["246F28DAE40C"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}
			// "신천농장-01-외부"
			if (beforeCalibration["246F28DAE6EC"]) {
				beforeCalibration["246F28DAE6EC"].nh3List = beforeCalibration["246F28DAE6EC"].nh3List.map(
					(e) => (e = ((e - 170) / 2.5).toFixed(1))
				);
				beforeCalibration["246F28DAE6EC"].h2sList = beforeCalibration["246F28DAE6EC"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}
			// "태웅-01-내부"
			if (beforeCalibration["246F28DAE6C0"]) {
				beforeCalibration["246F28DAE6C0"].nh3List = beforeCalibration["246F28DAE6C0"].nh3List.map(
					(e) => (e = ((e - 170) / 2.5).toFixed(1))
				);
				beforeCalibration["246F28DAE6C0"].h2sList = beforeCalibration["246F28DAE6C0"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}
			// "태웅-01-외부"
			if (beforeCalibration["246F28DAE3FC"]) {
				beforeCalibration["246F28DAE3FC"].nh3List = beforeCalibration["246F28DAE3FC"].nh3List.map(
					(e) => (e = ((e - 170) / 2.5).toFixed(1))
				);
				beforeCalibration["246F28DAE3FC"].h2sList = beforeCalibration["246F28DAE3FC"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}
			// "상원농장-01-내부"
			if (beforeCalibration["246F28DAE6BC"]) {
				beforeCalibration["246F28DAE6BC"].nh3List = beforeCalibration["246F28DAE6BC"].nh3List.map(
					(e) => (e = ((e - 170) / 2.5).toFixed(1))
				);
				beforeCalibration["246F28DAE6BC"].h2sList = beforeCalibration["246F28DAE6BC"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}
			// "상원농장-01-외부"
			if (beforeCalibration["246F28DAE770"]) {
				beforeCalibration["246F28DAE770"].nh3List = beforeCalibration["246F28DAE770"].nh3List.map(
					(e) => (e = ((e - 170) / 2.5).toFixed(1))
				);
				beforeCalibration["246F28DAE770"].h2sList = beforeCalibration["246F28DAE770"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}
			// "축산과학원:제주01"
			if (beforeCalibration["246F28DAE760"]) {
				beforeCalibration["246F28DAE760"].nh3List = beforeCalibration["246F28DAE760"].nh3List.map(
					(e) => (e = ((e - 65.2) / 9).toFixed(1))
				);
				beforeCalibration["246F28DAE760"].h2sList = beforeCalibration["246F28DAE760"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}
			// "대덕산업단지환경사업소-in-01"
			if (beforeCalibration["8CAAB5B2E4C4"]) {
				beforeCalibration["8CAAB5B2E4C4"].nh3List = beforeCalibration["8CAAB5B2E4C4"].nh3List.map(
					(e) => (e = ((e - 45) / 9.35).toFixed(1))
				);
				beforeCalibration["8CAAB5B2E4C4"].h2sList = beforeCalibration["8CAAB5B2E4C4"].h2sList.map(
					(e) => (e = ((e - 120) / 33.33).toFixed(2))
				);
			}
			// "대덕산업단지환경사업소-out-01"
			if (beforeCalibration["246F28DAE438"]) {
				beforeCalibration["246F28DAE438"].nh3List = beforeCalibration["246F28DAE438"].nh3List.map(
					(e) => (e = -((e - 170) / 5.5).toFixed(1))
				);
				beforeCalibration["246F28DAE438"].h2sList = beforeCalibration["246F28DAE438"].h2sList.map(
					(e) => (e = -((e - 120) / 33.33).toFixed(2))
				);
			}
			// "이천분뇨자원화센터-01-내부"
			if (beforeCalibration["F4CFA28DC314"]) {
				beforeCalibration["F4CFA28DC314"].nh3List = beforeCalibration["F4CFA28DC314"].nh3List.map(
					(e) => (e = ((e - 65.2) / 4.5).toFixed(1))
				);
				beforeCalibration["F4CFA28DC314"].h2sList = beforeCalibration["F4CFA28DC314"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}
			// "이천분뇨자원화센터-01-외부"
			if (beforeCalibration["8CAAB5B17BE0"]) {
				beforeCalibration["8CAAB5B17BE0"].nh3List = beforeCalibration["8CAAB5B17BE0"].nh3List.map(
					(e) => (e = ((e - 155) / 9.5).toFixed(1))
				);
				beforeCalibration["8CAAB5B17BE0"].h2sList = beforeCalibration["8CAAB5B17BE0"].h2sList.map(
					(e) => (e = ((e - 155) / 333.33).toFixed(2))
				);
			}
			// "범민농장-01"
			if (beforeCalibration["246F28DAE774"]) {
				beforeCalibration["246F28DAE774"].nh3List = beforeCalibration["246F28DAE774"].nh3List.map(
					(e) => (e = ((e - 65.2) / 4.5).toFixed(1))
				);
				beforeCalibration["246F28DAE774"].h2sList = beforeCalibration["246F28DAE774"].h2sList.map(
					(e) => (e = ((e - 70) / 333.33).toFixed(2))
				);
			}

			return beforeCalibration;
		} else {
			return {};
		}
	}

	/** DeviceAllList는 폐기함 - 서버 응답 시간이 너무 오래 걸림(5초이상)
	 * @returns {Promise<{[key: string]: deviceChart}>}
	 */
	// async getDeviceChart() {
	// 	let result = await Api.postSilently("/api/Menu/DeviceAllList");

	// 	if (result.status == 200) {

	// 		// 임시로 포동농장과 신천농장에 대해서 브라우저 mV 단위를 ppm으로 보정함.
	// 		let beforeCalibration = _.keyBy(result.data, "name");

	// 		let calibratedData;
	// 		if(beforeCalibration["포동농장-01-내부"]) {
	// 			calibratedData = beforeCalibration["포동농장-01-내부"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 65.2) / 4.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 120) / 333.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["포동농장-01-외부"]) {
	// 			calibratedData = beforeCalibration["포동농장-01-외부"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 65.2) / 4.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 120) / 333.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["신천농장-01-내부"]) {
	// 			calibratedData = beforeCalibration["신천농장-01-내부"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 170) / 2.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 155) / 333.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["신천농장-01-외부"]) {
	// 			calibratedData = beforeCalibration["신천농장-01-외부"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 170) / 2.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 155) / 333.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["태웅-01-내부"]) {
	// 			calibratedData = beforeCalibration["태웅-01-내부"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 170) / 2.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 155) / 333.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["태웅-01-외부"]) {
	// 			calibratedData = beforeCalibration["태웅-01-외부"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 170) / 2.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 155) / 333.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["상원농장-01-내부"]) {
	// 			calibratedData = beforeCalibration["상원농장-01-내부"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 170) / 2.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 155) / 333.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["상원농장-01-외부"]) {
	// 			calibratedData = beforeCalibration["상원농장-01-외부"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 170) / 2.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 155) / 333.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["축산과학원:제주01"]) {
	// 			calibratedData = beforeCalibration["축산과학원:제주01"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 65.2) / 9).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 155) / 333.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["대덕산업단지환경사업소-in-01"]) {
	// 			calibratedData = beforeCalibration["대덕산업단지환경사업소-in-01"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 45) / 9.35).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 120) / 33.33).toFixed(2))
	// 		}

	// 		//대덕산업단지환경사업소-out-01 - 1374로 회로 open 상태임
	// 		if(beforeCalibration["대덕산업단지환경사업소-out-01"]) {
	// 			calibratedData = beforeCalibration["대덕산업단지환경사업소-out-01"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 170) / 5.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 120) / 33.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["이천분뇨자원화센터-01-내부"]) {
	// 			calibratedData = beforeCalibration["이천분뇨자원화센터-01-내부"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 65.2) / 4.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 155) / 333.33).toFixed(2))
	// 		}

	// 		if(beforeCalibration["이천분뇨자원화센터-01-외부"]) {
	// 			calibratedData = beforeCalibration["이천분뇨자원화센터-01-외부"];
	// 			calibratedData.nH3.forEach(e => e.y = ((e.y - 155) / 9.5).toFixed(1))
	// 			calibratedData.h2S.forEach(e => e.y = ((e.y - 155) / 333.33).toFixed(2))
	// 		}

	// 		return _.keyBy(result.data, "name");
	// 	} else {
	// 		return {};
	// 	}
	// 	// let result = await Api.postSilently("/api/Menu/Products");
	// 	// if (result.status != 200) {
	// 	// 	return {};
	// 	// }

	// 	// let productList = result.data;
	// 	// let deviceChart = [];

	// 	// for (let record of productList) {
	// 	// 	let productid = record.id;
	// 	// 	let productName = record.name;

	// 	// 	result = await Api.postSilently("/api/Menu/DeviceList", { productid });
	// 	// 	if (result.status != 200) {
	// 	// 		continue;
	// 	// 	} else {
	// 	// 		for (let deviceRecord of result.data) {
	// 	// 			deviceRecord.productid = productid;
	// 	// 			deviceRecord.productName = productName;
	// 	// 		}

	// 	// 		deviceChart = [...deviceChart, ...result.data];
	// 	// 	}
	// 	// }

	// 	// return _.keyBy(deviceChart, "name");
	// }

	/**
	 * @returns {Promise<{status: number, data: productInfo}>}
	 */
	async getProductInfo(productid) {
		let aaa = await Api.post("/api/Menu/ProductInfo", { id: productid });
		return await Api.post("/api/Menu/ProductInfo", { id: productid });
	}

	async getMonitorListLoop() {
		await this.getMonitorList();
		setTimeout(this.getMonitorListLoop.bind(this), 5 * 1e3);
	}
}

/**
 *	@typedef {object} monitorInfo
 *  @prop {string} id
 * 	@prop {string} productid
 * 	@prop {string} productName
 *  @prop {string} name
 * 	@prop {string} company
 *  @prop {string} depart
 *  @prop {string} odor
 *  @prop {string} silution
 *  @prop {string} solidity
 *  @prop {string} h2s
 *  @prop {string} nh3
 *  @prop {string} voc
 *  @prop {string} lati
 *  @prop {string} longi
 *  @prop {string} winddirect
 *  @prop {string} windspeed
 *  @prop {string} temperature
 *  @prop {string} humidity
 *  @prop {string} status
 *  @prop {string} alert
 *  @prop {string} control
 *  @prop {string} address
 *  @prop {string} nh3,
 *  @prop {string} h2s,
 *  @prop {string} co2,
 *  @prop {string} voc,
 *  @prop {string} indol,
 *  @prop {string} odor,
 *  @prop {Array<{number}>} nh3List
 *  @prop {Array<{number}>} h2sList
 *  @prop {Array<{number}>} co2List
 *  @prop {Array<{number}>} vocList
 *  @prop {Array<{number}>} indolList
 *  @prop {Array<{number}>} odorList
 *  @prop {number} level
 * 	@prop {string} levelColor
 */

/**
 * #2021.08.18
 * @typedef productInfo
 * @prop {string} id
 * @prop {string} name
 * @prop {string} company
 * @prop {Array<import("../local/AttribsStore").attribs>} attribs
 */

/**
 *	@typedef {object} deviceMarker // api/Menu/Monitoring
 *  @prop {number} id
 *  @prop {string} name
 *  @prop {string} odor
 *  @prop {string} silution
 *  @prop {string} solidity
 *  @prop {string} h2s
 *  @prop {string} nh3
 *  @prop {string} co2
 *  @prop {string} voc
 *  @prop {string} indol
 *  @prop {string} lati
 *  @prop {string} longi
 *  @prop {string} winddirect
 *  @prop {string} windspeed
 *  @prop {string} temperature
 *  @prop {string} humidity
 *  @prop {string} status
 *  @prop {string} alert
 */

/**
 * 	@typedef {object} boundsChart
 *  @prop {number} id
 *  @prop {string} h2s
 *  @prop {string} nh3
 *  @prop {string} odor
 *  @prop {string} voc
 *  @prop {string} sensingDt
 */

/**
 * 	@typedef {object} boundsDevice
 *  @prop {number} id
 *  @prop {string} name
 *  @prop {string} productid
 *  @prop {string} productName
 * 	@prop {string} company
 *  @prop {string} depart
 *  @prop {string} geocode
 *  @prop {string} control
 *  @prop {string} addr
 *  @prop {string} status
 **/

/**
 * 	@typedef {object} deviceChart
 *  @prop {number} id
 *  @prop {string} name
 *  @prop {string} productid
 *  @prop {string} productName
 * 	@prop {string} company
 *  @prop {string} control
 *  @prop {string} addr
 *  @prop {string} status
 *  @prop {string} depart
 *  @prop {Array<{x: string, y: string}>} nH3
 *  @prop {Array<{x: string, y: string}>} h2S
 *  @prop {Array<{x: string, y: string}>} co2
 *  @prop {Array<{x: string, y: string}>} voc
 *  @prop {Array<{x: string, y: string}>} indol
 *  @prop {Array<{x: string, y: string}>} odor
 */

/**
 * 	@typedef {object} summury
 * 	@prop {[number, number]} onoff
 *	@prop {[number, number]} sensor
 *	@prop {[number, number]} prediction
 *	@prop {[number, number]} alert
 */

export default new MonitorStore();
