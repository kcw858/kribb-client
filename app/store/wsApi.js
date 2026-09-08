import moment from "moment";

const { wsHost } = require("../../config");

class WsApi {
	static serverInfo = {
		serverdn: "livestockdb.com",
		serverip: "175.208.89.113",
		socket: "websocket",
		portNo: "7000",
	};

	static ws;
	static callback = {};

	static async connect() {
		return new Promise((resolve) => {
			this.ws = new WebSocket(wsHost);
			this.ws.onmessage = (event) => {
				try {
					// 장비가 연결되지 않은 상태에서 주석을 풀고 테스트를 하면,
					// event.data = id not Found 인 경우가 되어, JSON.parse의 SyntaxError 발생함.
					let data = JSON.parse(event.data);
					let type = data.type || data.res;
					if (this.callback[type]) {
						this.callback[type](data);
						delete this.callback[type];
					}
				} catch (error) {
					console.error(error);
				}
			};

			this.ws.onopen = () => resolve();
			this.ws.onclose = () => {
				this.connect();
			};
		});
	}

	static async getConnectList(userid) {
		//this.ws가 undefined면
		if (!this.ws) {
			await this.connect();
		}

		return new Promise((resolve) => {
			this.callback["connectList"] && this.callback["connectList"]();
			this.callback["connectList"] = resolve;

			this.ws.send(
				JSON.stringify({
					command: "connectList",
					deviceId: userid,
				})
			);
		});
	}

	//=============================================
	static async getSystem(manufacturer, userid, deviceid) {
		if (!this.ws) {
			await this.connect();
		}
		let { arr } = await this.getConnectList(userid);
		if (arr.indexOf(deviceid) == -1) {
			return "-1";
		}
		// await this.getConnectList();

		let systemInfo;

		if (manufacturer == 'insys') {
			systemInfo = new Promise((resolve) => {
				// callback을 받을 인자를 넣어야 제대로 받는다. status는 보내는 인자고, statusResult가 받는 인자로 정의되어 있다.
				this.callback["statusResult"] && this.callback["statusResult"]();
				this.callback["statusResult"] = resolve;
				this.ws.send(
					JSON.stringify({
						command: "orderInsys",
						deviceId: userid,
						sendto: deviceid,
						ordermsg: JSON.stringify({
							company: "insys",
							name: "server",
							timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
							deviceId: deviceid,
							type: "status"
						}),
					})
				);
			});
		} else if (manufacturer == 'jtron') {
			systemInfo == new Promise((resolve) => {
				this.callback["sysInfo"] && this.callback["sysInfo"]();
				this.callback["sysInfo"] = resolve;
	
				this.ws.send(
					JSON.stringify({
						command: "orderJtron",
						deviceid: userid,
						sendto: deviceid,
						ordermsg: JSON.stringify({
							company: "JTRON",
							name: "server",
							deviceid: deviceid,
							sendDt: moment().format("YYYY-MM-DD HH:mm:ss"),
							type: "sysInfo",
						}),
					})
				);
			});
		} else {
			alert("해당 장비의 제조사가 올바르지 않습니다.");
		}

		return "1";
	}


	//=============================================




	static async getSystemInfo(manufacturer, userid, deviceid) {
		if (!this.ws) {
			await this.connect();
		}

		let { arr } = await this.getConnectList(userid);
		console.log('getSystemInof connected list: ')
	
		if (arr.indexOf(deviceid) == -1) {
			return alert("장비가 연결되지 않았습니다.");
		}
		// await this.getConnectList();

		let systemInfo;

		if (manufacturer == 'insys') {
			systemInfo = new Promise((resolve) => {
				// callback을 받을 인자를 넣어야 제대로 받는다. status는 보내는 인자고, statusResult가 받는 인자로 정의되어 있다.
				this.callback["statusResult"] && this.callback["statusResult"]();
				this.callback["statusResult"] = resolve;
				this.ws.send(
					JSON.stringify({
						command: "orderInsys",
						deviceId: userid,
						sendto: deviceid,
						ordermsg: JSON.stringify({
							company: "insys",
							name: "server",
							timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
							deviceId: deviceid,
							type: "status"
						}),
					})
				);
			});
		} else if (manufacturer == 'jtron') {
			systemInfo == new Promise((resolve) => {
				this.callback["sysInfo"] && this.callback["sysInfo"]();
				this.callback["sysInfo"] = resolve;
	
				this.ws.send(
					JSON.stringify({
						command: "orderJtron",
						deviceid: userid,
						sendto: deviceid,
						ordermsg: JSON.stringify({
							company: "JTRON",
							name: "server",
							deviceid: deviceid,
							sendDt: moment().format("YYYY-MM-DD HH:mm:ss"),
							type: "sysInfo",
						}),
					})
				);
			});
		} else {
			alert("해당 장비의 제조사가 올바르지 않습니다.");
		}

		return systemInfo;
	}

	// insideTime: "측정 구간",  //measectInput.value - 분단위
	// outsideTime: "세척 구간", //flushsectInput.value - 분단위 
	// restTime: "휴식 기간", 	//restsectInput.value - 분단위
	// dataInterval: "측정 주기",//meacycleInput.value - 초단위
	static async setup(userid, deviceid, insideTime, outsideTime, restTime, dataInterval) {
		if (!this.ws) {
			await this.connect();
		}

		return new Promise((resolve) => {
			this.callback["setup"] && this.callback["setup"]();
			this.callback["setup"] = resolve;

			this.ws.send(
				JSON.stringify({
					command: "orderInsys",
					deviceId: userid,
					sendto: deviceid,
					ordermsg: JSON.stringify({
						company: "insys",
						name: "server",
						timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
						deviceId: deviceid,
						type: "setup",
						setup: {
							insideTime: insideTime,
							outsideTime: outsideTime,
							restTime: restTime,
							dataInterval: dataInterval
						},
					}),
				})
			);
		});
	}

	static async sample(userid, deviceid) {
		if (!this.ws) {
			await this.connect();
		}

		return new Promise((resolve) => {
			this.callback["sample"] && this.callback["sample"]();
			this.callback["sample"] = resolve;

			this.ws.send(
				JSON.stringify({
					command: "orderJtron",
					deviceId: userid,
					sendto: deviceid,
					ordermsg: JSON.stringify({
						company: "JTRON",
						name: "server",
						deviceId: deviceid,
						sendDt: moment().format("YYYY-MM-DD HH:mm:ss"),
						type: "sample",
						sample: {
							actuate: "On",
							...this.serverInfo,
						},
					}),
				})
			);
		});
	}

	static async clean(userid, deviceid) {
		if (!this.ws) {
			await this.connect();
		}

		await this.getConnectList();

		return new Promise((resolve) => {
			this.callback["clean"] && this.callback["clean"]();
			this.callback["clean"] = resolve;

			this.ws.send(
				JSON.stringify({
					command: "orderJtron",
					deviceid: userid,
					sendto: deviceid,
					ordermsg: JSON.stringify({
						company: "JTRON",
						name: "server",
						deviceid: deviceid,
						sendDt: moment().format("YYYY-MM-DD HH:mm:ss"),
						type: "clean",
						clean: {
							actuate: "On",
							...this.serverInfo,
						},
					}),
				})
			);
		});
	}

	static async stop(userid, deviceid) {
		if (!this.ws) {
			await this.connect();
		}

		return new Promise((resolve) => {
			this.callback["stop"] && this.callback["stop"]();
			this.callback["stop"] = resolve;

			this.ws.send(
				JSON.stringify({
					command: "orderJtron",
					deviceid: userid,
					sendto: deviceid,
					ordermsg: JSON.stringify({
						company: "JTRON",
						name: "server",
						deviceid: deviceid,
						sendDt: moment().format("YYYY-MM-DD HH:mm:ss"),
						type: "stop",
						stop: {
							actuate: "On",
							...this.serverInfo,
						},
					}),
				})
			);
		});
	}

	static async autoSample(userid, deviceid) {
		if (!this.ws) {
			await this.connect();
		}

		return new Promise((resolve) => {
			this.callback["autoSample"] && this.callback["autoSample"]();
			this.callback["autoSample"] = resolve;

			this.ws.send(
				JSON.stringify({
					command: "orderJtron",
					deviceid: userid,
					sendto: deviceid,
					ordermsg: JSON.stringify({
						company: "JTRON",
						name: "server",
						deviceid: deviceid,
						sendDt: moment().format("YYYY-MM-DD HH:mm:ss"),
						type: "autoSample",
						autoSample: {
							actuate: "On",
							...this.serverInfo,
						},
					}),
				})
			);
		});
	}

	static async autoSampleLv(userid, deviceid, value) {
		if (!this.ws) {
			await this.connect();
		}

		return new Promise((resolve) => {
			this.callback["autoSampleLv"] && this.callback["autoSampleLv"]();
			this.callback["autoSampleLv"] = resolve;

			this.ws.send(
				JSON.stringify({
					command: "orderJtron",
					deviceid: userid,
					sendto: deviceid,
					ordermsg: JSON.stringify({
						company: "JTRON",
						name: "server",
						deviceid: deviceid,
						sendDt: moment().format("YYYY-MM-DD HH:mm:ss"),
						type: "autoSampleLv",
						autoSampleLv: {
							value: value,
							...this.serverInfo,
						},
					}),
				})
			);
		});
	}
}

// @ts-ignore
window.WsApi = WsApi;
export default WsApi;

/* 인시스 제어 통신 프로토콜 2021.07.31 */
// 1. Boot 전문

// {
//     company: "insys",
//     model: "모델명",
//     name: "sensor",
//     timestamp: "", //"yyyy:mm:dd HH:mm:ss" ,
//     deviceId : "", //Device MAC address,
//     firmVer: ""  // Firmware version,
//     type: "boot",
//     network: {
//         ipaddr: "", //Device IP address
//         signalStrength: "", //RSSI 값
//     },
//     setup: {
//         insideTime: , //내부공기 순환 시간(minutes) - measure
//         outsideTime: , //외부공기 순환 시간(minutes) - flush
//         restTime: , //휴식 시간(minutes) - rest
//         dataInterval:  //센서 데이터 전송 주기(seconds) - cycle
//     }
// }


// 2. Device 레포트 데이터 전문

// {
//     company: "insys",
//     model: "모델명",
//     name: "sensor",
//     timestamp: "", //"yyyy:mm:dd HH:mm:ss" ,
//     deviceId : "", //Device MAC address,
//     firmVer: ""  // Firmware version,
//     type: "data",
//     status: {
//         pump: "on/off", //“on”/”off” : 펌프 on일때만 측정값 의미있음
//         in_valve: "on/off", //“on”/”off” : on일 때 측정(out_valve는 off)
//         out_valve: "on/off", //“on”/”off” : on일 때 세척(in_valve는 off)
//     },
//     sensorData: {
//         h2s: , //황화수소 값, mV
//         nh3: , //암모니아 값, mV
//         odor: , //복합악취 값, mV
//         voc: , //VOC 값, mV
//         indol: , //인돌 값, mV
//         temperature: , //온도 값,︒C
//         humidity: , //습도 값, %
//         acCurrent: , //전류 센서 값, mA
//     }
// }


// 3. Device 환경 설정 전문

// {
//     company: "insys",
//     name: "server",
//     timestamp: "", //"yyyy:mm:dd HH:mm:ss" ,
//     deviceId : "", //Device MAC address,
//     type: "setup",
//     firmVer: ""  // Firmware version, 생략가능
//     setup: {
//         insideTime: , //내부공기 순환 시간(minutes) - measure
//         outsideTime: , //외부공기 순환 시간(minutes) - flush
//         restTime: , //휴식 시간(minutes) - rest
//         dataInterval:  //센서 데이터 전송 주기(seconds) - cycle
//     },
//     network: {
//         serverURI: , ""//서버 접속 URI(ex. ws://175.208.89.113:7000, wss://www.sf.or.kr)서버 URI 변경이 필요 없는 경우 생략 가능
//     }
// }



// 4. 디바이스 설정 상태 조회
// 4.1 Device 설정 상태 조회 전문

// {
//     company: "insys",
//     name: "server",
//     timestamp: "", //"yyyy:mm:dd HH:mm:ss" ,
//     deviceId : "", //Device MAC address,
//     type: “status”
// }


// 4.2 Device 설정 상태 조회 응답 전문

// {
//     company: "insys",
//     model: "모델명",
//     name: "sensor",
//     timestamp: "", //"yyyy:mm:dd HH:mm:ss" ,
//     deviceId : "", //Device MAC address,
//     type: “statusResult”,
//     network: {
//         ipaddr: "", //Device IP address
//         signalStrength: "", //RSSI 값
//     },
//     setup: {
//         insideTime: , //내부공기 순환 시간(minutes) - measure
//         outsideTime: , //외부공기 순환 시간(minutes) - flush
//         restTime: , //휴식 시간(minutes) - rest
//         dataInterval:  //센서 데이터 전송 주기(seconds) - cycle
//     }
// }


/* 주원전자 제어 통신 프로토콜 2021.08.05 */
// 포집기 송신 JSON 데이터

// {
//     "company":"JTRON",
//     "name": "client",
//     "deviceId": "dc:a6:32:7b:24:b4",  *// 라즈베리파이 MAC_Address
//     "sendDt": "2021-07-14 06:54:25",     *// 데이터를 보낸 날짜 및 시간 : yyyy-mm-dd hh:mm:ss
//     "type": "ioStat",
//     "input": {
//         "exTmp": 51.0,          *// 외기 온도 : xx.x 도
//         "exHum": 24.3,          *// 외기 습도 : xx.x %
//         "inTmp": 46.0,          *// 내기 온도 : xx.x 도,
//         "inHum": 25.5,          *// 내기 습도 : xx.x %,
//         "dirAngle": 45.714,     *// 풍향 : xx.x 도
//         "aVelCnt": 0,           *// 풍속 : xx.x (분당 펄스 수) 
//         "ovpVolt": 4.066,       *// 입력 전압: adc 입력 전압값,
//         "preVolt": 0.271,       *// pre 전압: adc 입력 전압값,
//         "odorVolt": 0.025,      *// Odor 센서 전압: adc 입력 전압값
//         "h2sVolt": -0.018,      *// h2s 센서 전압: adc 입력 전압값
//         "nh3Volt": -0.397,      *// nh3 센서 전압: adc 입력 전압값
//         "vocVolt": -0.346,      *// voc 센서 전압: adc 입력 전압값
//         "btStart": 0,            *// Start 버튼 상태 : 1:On,0:Off,
//         "btSample": 0,           *// Sample 버튼 상태 : 1:On,0:Off,
//         "btClean": 0,            *// Clean 버튼 상태 : 1:On,0:Off,
//         "limitSt": 0,            *// Limit Switch 상태 : 1:On,0:Off, 
//         "door1St": 0,            *// door1 Switch 상태 : 1:On,0:Off, 
//         "door2St": 0,            *// door2 Switch 상태 : 1:On,0:Off, 
//         "pumpSt": 0              *// Sampling Pump Fail : 1:Fail,0:정상 
//     },
//     "output": {
//         "solOut1": 0,              *// Sol-valve1 출력 상태 : 0:Off, 1:On
//         "solOut2": 0,              *// Sol-valve2 출력 상태 : 0:Off, 1:On,
//         "solOut3": 0,              *// Sol-valve3 출력 상태 : 0:Off, 1:On,
//         "samplePumpOut": 0,        *// Sampling Pump 출력 상태 : 0:Off, 1:On,
//         "sensorPumpOut": 0,        *// sensor Pump 출력 상태 : 0:Off, 1:On,
//         "fanOut": 0,              *// Fan 출력 상태 : 0:Off, 1:On
//         "heatOut": 0              *// heater 출력 상태 : 0:Off, 1:On
//     }
// }


// Server 에서 보내는 제어 명령의 종류
// 1. 포집 시작. 
// 2. 세척 시작. 
// 3. 작업 중지.(현재 포집/세척/배기 중인 경우)
// 4. 예약포집 시작/중지 설정. 
// 5. 예약포집 시간 설정. 
// 6. 자동포집 시작/중지 설정. 
// 7. 자동포집 레벨 설정. 
// 8. 시스템 정보 요청.

// 1. 포집 시작 (Sample)
// Command : Server -> Client
// {
//  "company": "JTRON", //회사이름
//  "name": "server",   // 신호를 보낸 측. server명 서버에서 장비로 보내는 신호, client면 장비에서 서버로 보내는 신호의 의미임
//  "deviceId": "dc:a6:32:7b:24:b4",  // 맥어드레스를 디바이스 고유아이디로 사용
//  "sendDt": "2021-07-29 12:30:01",  // 신호 발생 시간
//  "type": "sample", "sample": {   // sample은 포집, clean은 세척, stop은 정지, autoSampleLv은 자동포집설정, 시스템정보요청은 sysInfo
//   "actuate": "on", // 제어신호는 actuate: on으로 정의
//    "serverdn": "lomadata.com", 
//    "serverip": "192.168.0.134", 
//    "socket": "websocket", 
//    "portNo": "7000"
//   }
// }
// Response : Server <- Client
// {
//  "company": "JTRON", 
//  "name": "client", 
//  "deviceId": "dc:a6:32:7b:24:b4", 
//  "sendDt": "2021-07-29 12:30:01",
//  "type": "sample", 
//  "sample": {
//  "actuate": "on",
//  "serverdn": "lomadata.com", 
//  "serverip": "192.168.0.134", 
//  "socket": "websocket", 
//  "portNo": "7000"
//  }
// }

// 2. 세척 시작 (Clean)
// Command : Server -> Client
// {
//  "company": "JTRON", "name": "server", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "clean", "clean": {
// "actuate": "on",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }
// Response : Server <- Client
// {
//  "company": "JTRON", "name": "client", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "clean", "clean": {
//  "actuate": "on",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }

// 3. 작업 중지 (Stop)
// Command : Server -> Client
// {
//  "company": "JTRON", "name": "server", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "stop", "stop": {
// "actuate": "on",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }
// Response : Server <- Client
// {
//  "company": "JTRON",
//  "name": "client",
//  "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "stop", "stop": {
//  "actuate": "on",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }

// 4. 예약 포집 On/Off (RsvSample) 
// Command : Server -> Client
// {
//  "company": "JTRON", "name": "server", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "rsvSample", "rsvSample": {
//  "actuate": "on",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }
// Response : Server <- Client
// {
//  "company": "JTRON", "name": "client", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "rsvSample", "rsvSample": {
//  "actuate": "on",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }

// 5. 예약 포집 시간 설정 (RsvSampleT) 
// Command : Server -> Client
// {
//  "company": "JTRON", "name": "server", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "rsvSampleT", "rsvSampleT": {
//  "time": "2021-07-26 12:34:56",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }
// Response : Server <- Client
// {
//  "company": "JTRON", "name": "client", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "rsvSampleT", "rsvSampleT": {
//  "time": "2021-07-26 12:34:56",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }

// 6. 자동 포집 On/Off (AutoSample)
// Command : Server -> Client
// {
//  "company": "JTRON", "name": "server", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "autoSample", "autoSample": {
//  "actuate": "on",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }
// Response : Server <- Client
// {
//  "company": "JTRON", "name": "client", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "autoSample", "autoSample": {
//  "actuate": "on",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }

// 7. 자동 포집 Level 설정 (autoSampleLv)
// Command : Server -> Client
// {
//  "company": "JTRON", "name": "server", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "autoSampleLv", "autoSampleLv": {
//  "value": "2.5",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }
// Response : Server <- Client
// {
//  "company": "JTRON", "name": "client", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "autoSampleLv", "autoSampleLv": {
//  "value": "2.5",
//  "serverdn": "lomadata.com", "serverip": "192.168.0.134", "socket": "websocket", "portNo": "7000"
//  }
// }


// 8. 시스템 정보 요청 (sysInfo)
// Command : Server -> Client
// {
//  "company": "JTRON", "name": "server", "deviceId": "dc:a6:32:7b:24:b4", "sendDt": "2021-07-29 12:30:01",
//  "type": "sysInfo"
// }

// Response : Server <- Client
// {
//   "company": "JTRON", 
//   "name": "client", 
//   "deviceId": "dc:a6:32:7b:24:b4", 
//   "sendDt": "2021-07-29 12:30:01",
//   "type": "sysInfo", 
//   "sysInfo": {
//     "fwVersion": "V1.0001", 
//     "cntProcess": 0,
//     "reservedDateTime": "00-01-01 00:00:03", 
//     "reservedProcess": 0, 
//     "autoProcOdorLev": 1.23, 
//     "autoProcess": 0, 
//     "sampleStartTime": "2021-07-14 06:54:25", 
//     "sampleLabTime": "06:54:25",
//     "sampled": 0,
//     "serverdn": "lomadata.com",
//     "serverip": "192.168.0.134", 
//     "socket": "websocket", 
//     "portNo": "7000"
//   }
// }

// - 데이터를 보낸 날짜 및 시간 : yyyy-mm-dd hh:mm:ss
// - 포집장치 f/w Version
// - 현재 동작 단계 표시 :
// #define PROC_WAIT 0
// #define PROC_SAMP 1
// #define PROC_EXHU 2
// #define PROC_CLEN 3
// #define PROC_STOP 4
// #define PROC_ERR 5
// - 예약 포집 날짜 및 시간 : yyyy-mm-dd hh:mm:ss
// - 예약 포집 enable/disable : 0:Disable, 1:Enable
// - 자동 포집 시작 odor 센서 전압
// - 자동 포집 enable/disable : 0:Disable, 1:Enable
// - 포집 시작 시간 : 포집 시작시 날짜 & 시간
// - 포집 시작부터 끝까지 걸린 시간 : 시간(시:분:초)


// 다음 설정값들은 시스템에 저장되어 전원이 껐다 켜져도 지워지지 않습니다. 
// "reservedDateTime"
// "reservedProcess"
// "autoPocOdorLev"
// "autoProcess" 

// // 포집기 정보
// "system": {
//         "sensingDt": "2021-07-14 06:54:25",     *// 데이터를 보낸 날짜 및 시간 : yyyy-mm-dd hh:mm:ss
//         "fwVersion": "V1.0001",                 *// 포집장치 f/w Version
//         "cntProcess": 0,                        *// 현재 동작 단계 표시 : #define PROC_WAIT(대기) 0, PROC_SAMP(포집) 1, PROC_EXHU(배기) 2, PROC_CLEN(세척) 3, PROC_STOP(정지) 4, PROC_ERR 5, 0 상태에서만 다른 명령이 가능함.
//         "reservedDateTime": "00-01-01 00:00:03",    *// 예약 포집 날짜 및 시간 : yyyy-mm-dd hh:mm:ss
//         "reservedProcess": 0,                   *// 예약 포집 enable/disable : 0:Disable, 1:Enable
//         "autoProcOdorLev": 1.23,                *// 자동 포집 시작 odor 센서 전압
//         "autoProcess": 0,                       *// 자동 포집 enable/disable : 0:Disable, 1:Enable
//         "sampleStartTime": "2021-07-26 00:00:00",       *// 포집 시작 시간 : 포집 시작시 날짜 & 시간
//         "sampleLabTime":"00:11:22"                     *// 포집 시작부터 끝까지 걸린 시간 : 시간(시:분:초)
//     }

// #define PROC_WAIT 0 *// 대기 : 다른 명령이 가능한 상태
// #define PROC_SAMP 1 *// 포집
// #define PROC_EXHU 2 *// 배기
// #define PROC_CLEN 3 *// 세척
// #define PROC_STOP 4 *// 정지
// #define PROC_ERR 5  *// 에러

// {
//    "company": "JTRON",
//    "name" : "server",
//    "deviceId" : "value",  *// 라즈베리파이 MAC 어드레스
//    "timestamp" "2021-07-14 06:54:25",
//    "userId": "admin",    // 제어신호를 서버에서 보낸 사용자의 id 기록
//    "type" : "sampler",  *// Set-up 정보의 경우 "setup", 포집기 가동시는 "sampler" 등 정의하면 됨
//    "sampler" : [
//           "actuate" : "on" *// on이면 포집
//           "serverdn": "string", *// 서버의 도메인 네임. 예) lomadata.com
//           "serverip" : "value",  *// 서버 IP 주소
//           "socket" : "websocket",
//           "portNo" : "7000",  *// 포트 번호
//    ]
// }

// {
//    "company": "JTRON",
//    "name" : "server",
//    "deviceId" : "value",  *// 라즈베리파이 MAC 어드레스
//    "timestamp" "2021-07-14 06:54:25",
//    "userId": "admin",    // 제어신호를 서버에서 보낸 사용자의 id 기록
//    "type" : "setup",  *// Set-up 정보의 경우 "setup", 포집기 가동시는 "sampler" 등 정의하면 됨
//    "setup" : [
//           "sensor" : "odor" *// odor 센서 기준
//           "critical": "value", *// 30ppm, 80mV 등의 특정 임계값
//           "controlUnit" : "sampler",  *// 제어대상이 포집기(sampler)
//           "normalState" : "off",   *// 임계값을 넘지 않았을 때 포집기 상태
//           "criticalState" : "on",  *// 임계값을 넘은 경우 포집기 상태
//    ]
// }

// // 서버에서 제어신호를 받았다는 수신신호
// {
//     "company":"JTRON",
//     "deviceId": "MAC_Address",
//     "timestamp" "2021-07-14 06:54:25", 
//     "type": "setup",    //"setup"(오더센서 임계값 설정:임계값 이상신호 발생시 자동포집),"sampler"(포집기 동작신호) 현재는 2종류뿐임
//     "userId": "admin",    // 제어신호를 서버에서 보낸 사용자의 id 기록
//     "serverIP": "175.266.32.85",
//     "received": "2021-07-14 06:54:20", *// 서버에서 받은 신호의 timestamp
//     "result": "none"  *// success, fail, error, none 등. none은 수신신호를 받기만한 경우
// }

// // 서버에서 제어신호를 받은 후 처리 결과 신호
// {
//     "company":"JTRON",
//     "deviceId": "MAC_Address",
//     "timestamp" "2021-07-14 06:54:25", 
//     "type": "setup",    //"setup"(오더센서 임계값 설정:임계값 이상신호 발생시 자동포집),"sampler"(포집기 동작신호) 현재는 2종류뿐임
//     "userId": "admin",    // 제어신호를 서버에서 보낸 사용자의 id 기록
//     "serverIP": "175.266.32.85",
//     "received": "2021-07-14 06:54:20", *// 서버에서 받은 신호의 timestamp
//     "result": "success"  *// success, fail, error, none 등. none은 수신신호를 받기만한 경우
// }

