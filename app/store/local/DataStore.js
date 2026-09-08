import _ from "lodash";
import { makeAutoObservable } from "mobx";
import moment from 'moment';
import Api from "../api";

class DataStore {
	/**@type Array<data> */
	dataList = [];

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * @param {{deviceid: Array<string>, sect: string, arith: string, fromDate: string, toDate: string, limit: number}} params
	 * @returns {Promise<{status: number, data: Array<data>}>}
	 */
	async getDataList(params) {
		let result = await Api.post("api/Menu/chart", params);
		if (result.status == 200) {

			// 임시로 브라우저에서 mV 단위를 ppm으로 보정함.
			let beforeCalibration = _.keyBy(result.data, "deviceid");
			if(params.deviceid){
				beforeCalibration[`${params.deviceid[0]}`].nH3.forEach((e) => e.y = (e.y == "-1" ? e.y*0 : e.y-0).toFixed(1));
				beforeCalibration[`${params.deviceid[0]}`].h2S.forEach((e) => e.y = (e.y == "-1" ? e.y*0 : e.y-0).toFixed(2));
				beforeCalibration[`${params.deviceid[0]}`].odor.forEach((e) => e.y = (e.y == "-1" ? e.y*0 : e.y-0).toFixed(1));
				beforeCalibration[`${params.deviceid[0]}`].voc.forEach((e) => e.y = (e.y == "-1" ? e.y*0 : e.y-0).toFixed(1));
			}
			let calibratedData;


			// 누리농장01
			if (beforeCalibration["E831CD283E98"]) {
				calibratedData = beforeCalibration["E831CD283E98"];
				calibratedData.odor.forEach((e) => (e.y = ((e.y-0) / 10).toFixed(2)));
			}

			// "성지농장-외부-01"
			if (beforeCalibration["246F28DAE6C8"]) {
				calibratedData = beforeCalibration["246F28DAE6C8"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 300) / 15).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}

			// "성지농장-내부-01"
			if (beforeCalibration["F4CFA28B492C"]) {
				calibratedData = beforeCalibration["F4CFA28B492C"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 135) / 4.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}

			// "포동농장-01-내부"
			if (beforeCalibration["246F28DAE43C"]) {
				beforeCalibration["246F28DAE43C"].nH3.forEach((e) => (e.y = ((e.y - 65.2) / 4.5).toFixed(1)));
				beforeCalibration["246F28DAE43C"].h2S.forEach((e) => (e.y = ((e.y - 120) / 333.33).toFixed(2)));
			}
			// "포동농장-01-외부"
			if (beforeCalibration["F4CFA28C0274"]) {
				calibratedData = beforeCalibration["F4CFA28C0274"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 65.2) / 4.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 120) / 333.33).toFixed(2)));
			}
			// "신천농장-01-내부"
			if (beforeCalibration["246F28DAE40C"]) {
				calibratedData = beforeCalibration["246F28DAE40C"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 170) / 2.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}
			// "신천농장-01-외부"
			if (beforeCalibration["246F28DAE6EC"]) {
				calibratedData = beforeCalibration["246F28DAE6EC"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 170) / 2.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}
			// "태웅-01-내부"
			if (beforeCalibration["246F28DAE6C0"]) {
				calibratedData = beforeCalibration["246F28DAE6C0"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 170) / 2.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}
			// "태웅-01-외부"
			if (beforeCalibration["246F28DAE3FC"]) {
				calibratedData = beforeCalibration["246F28DAE3FC"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 170) / 2.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}
			// "상원농장-01-내부"
			if (beforeCalibration["246F28DAE6BC"]) {
				calibratedData = beforeCalibration["246F28DAE6BC"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 170) / 2.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}
			// "상원농장-01-외부"
			if (beforeCalibration["246F28DAE770"]) {
				calibratedData = beforeCalibration["246F28DAE770"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 170) / 2.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}
			// "축산과학원:제주01"
			if (beforeCalibration["246F28DAE760"]) {
				calibratedData = beforeCalibration["246F28DAE760"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 65.2) / 9).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}
			// "대덕산업단지환경사업소-in-01"
			if (beforeCalibration["8CAAB5B2E4C4"]) {
				calibratedData = beforeCalibration["8CAAB5B2E4C4"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 45) / 9.35).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 120) / 33.33).toFixed(2)));
			}
			// "대덕산업단지환경사업소-out-01"
			if (beforeCalibration["246F28DAE438"]) {
				calibratedData = beforeCalibration["246F28DAE438"];
				calibratedData.nH3.forEach((e) => (e.y = -((e.y - 170) / 5.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = -((e.y - 120) / 33.33).toFixed(2)));
			}
			// "이천분뇨자원화센터-01-내부"
			if (beforeCalibration["F4CFA28DC314"]) {
				calibratedData = beforeCalibration["F4CFA28DC314"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 65.2) / 4.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}
			// "이천분뇨자원화센터-01-외부"
			if (beforeCalibration["8CAAB5B17BE0"]) {
				calibratedData = beforeCalibration["8CAAB5B17BE0"];
				calibratedData.nH3.forEach((e) => (e.y = ((e.y - 155) / 9.5).toFixed(1)));
				calibratedData.h2S.forEach((e) => (e.y = ((e.y - 155) / 333.33).toFixed(2)));
			}

			this.dataList = result.data;
		}

		return result;
	}
}

/**
 * 	@typedef {[{[key: string]: any}]} data
 */

export default DataStore;
