/* eslint-disable react/prop-types */
import _ from "lodash";
import React, { useCallback, useRef, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import SelectSearch from "react-select-search";
import SelectSearchInput from "../../components/Form/SelectSearchInput";
import AlertRecipentStore from "../../store/local/AlertRecipentStore";
import UserStore from "../../store/local/UserStore";
import { HeaderMain } from "../components/HeaderMain";
import { useTranslation } from "react-i18next";
import { SelectInput } from "../../components/Form";
import "../../styles/components/alertrecipent/alertrecipent.css";

const tableHeaderBg = { backgroundColor: "#edf2f7" };

export default function AlertRecipent() {
	const { t } = useTranslation();

	const alertRecipentStore = new AlertRecipentStore();
	const userStore = new UserStore();

	const phoneInputRef = useRef();
	let phoneNumber = ""; // const [phoneNumber, setPhoneNumber] = userState(null)을 사용하면 값 변환시 즉각적으로 반영되지 않는다. - 리액트의 문제

	/**@type {[alertUsage: import("../../store/local/AlertRecipentStore").alertUsage, setAlertConfig: any]} */
	let [alertUsage, setAlertUsage] = useState(null);

	/**@type {[alertUserList: Array<import("../../store/local/AlertRecipentStore").alertUser>, setAlertUserList: any]} */
	let [alertUserList, setAlertUserList] = useState(null);

	/**@type {[userList: Array<import("../../store/local/UserStore").user>, setUserList: any]} */
	let [userList, setUserList] = useState(null);

	/**@type {[user:import("../../store/local/UserStore").user, setUser:any]} */
	let [user, setUser] = useState(null);

	/**@type {[phoneNumberList:  Array<String>, setPhoneNumberList: any]} */
	let [phoneNumberList, setPhoneNumberList] = useState(null);

	useEffect(() => {
		alertRecipentStore.getAlertUsage().then(({ data }) => {
			setAlertUsage(data);
			setAlertUserList(data.users);
			setPhoneNumberList(data.users.map((user) => user.telno));
		});

		userStore.getUsers4Geo().then(({ data }) => setUserList(data));
	}, []);

	if (!alertUsage || !alertUserList || !userList) {
		return <></>;
	}

	let valueList = [];

	for (let record of userList) {
		// valueList.push({ name: record.userid, value: record.userid, disabled: _.find(alertUsage.users, ["userid", record.userid]) ? true : false });
		valueList.push({ name: record.userid, value: record.userid });
	}

	const addUser = async () => {
		if (!phoneNumber) {
			phoneNumber = user.phone;
		}
		let userid = user.userid;
		let name = user.username;
		let telno = phoneNumber;

		if (!userid || !name || !telno) {
			return alert(t("alertNotCorrectInput")); //입력된 값이 올바르지 않습니다.
		}

		if (phoneNumberList.includes(phoneNumber)) {
			return alert("이미 등록되어 있는 전화번호입니다.");
		}

		let params = {
			userid,
			name,
			telno,
		};

		// @ts-ignore
		let { status } = await new AlertRecipentStore().addAlertUser(params);
		if (status != 200) {
			return;
		}

		alert(t("alertRegistered")); //등록되었습니다

		// 알림사용자 추가 이후 화면 새로고침을 위한 코드 : useState를 변화시키지 않으면 서버데이타만 변경되고 화면은 바뀌지 않는다.
		await new AlertRecipentStore().getAlertUsage().then(({ data }) => {
			setAlertUserList(data.users);
			setPhoneNumberList(data.users.map((user) => user.telno));
			phoneNumber = "";
		});
	};

	const removeUser = async (id) => {
		if (!confirm(t("deleteConfirmDescription"))) {
			//정말로 삭제하시겠습니까?
			return;
		}

		await new AlertRecipentStore().removeAlertUser(id);
		alert(t("alertRemoved")); //삭제되었습니다

		// 알림사용자 삭제 이후 화면 새로고침을 위한 코드 : useState를 변화시키지 않으면 서버데이타만 변경되고 화면은 바뀌지 않는다.
		await new AlertRecipentStore().getAlertUsage().then(({ data }) => {
			setAlertUserList(data.users);
			setPhoneNumberList(data.users.map((user) => user.telno));
			phoneNumber = "";
		});
	};

	const InputID = (e) => {
		setUser(_.find(userList, ["userid", e.target.value]));
		// @ts-ignore : 사용자를 바꾸는 경우 전화번호 input field를 초기화시킨다.
		phoneInputRef.current.value = "";
	};

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("menuAlertRecipent")} />
			</div>

			{/* <div className="row mb-1">
				<div className="col">
					<AddAlertRecipentTable id={Number(id)} data={alertConfig} />
				</div>
			</div> */}

			<div className="row mb-1">
				<div className="col">
					{/* AlertUsageTable */}
					<AlertUsageTable data={alertUsage} />
				</div>
			</div>

			<div className="row my-4">
				<div className="col">
					{/* AddRecipentTable */}
					<div className="row ml-0 mb-3">
						<h5 className="recipient-sub-title">{t("addRecipient")}</h5>
					</div>
					<div className="row">
						<div className="col-12 col-lg-3 pr-4">
							<div className="addrecipient-style mb-3">{t("selectUser")}</div>
							<div className="user-select-input">
								<div>
									<SelectInput label="" id={"InputID"} valueList={valueList.map((e) => e.name)} onChange={InputID} />
								</div>
							</div>
						</div>
						<div className="col-12 col-lg-3 px-4">
							<div className="addrecipient-style mb-3">{t("userName")}</div>
							<div className="mb-4 pt-2">
								{/* {(user && user.username) || `${t("user")}`} */}
								{(user && <span style={{ color: "#4a5568" }}>{user?.username}</span>) || (
									<span style={{ color: "#a0aec0" }}>{t("user")}</span>
								)}
							</div>
						</div>
						<div className="col-12 col-lg-3 px-4">
							<div className="addrecipient-style mb-3">{t("phoneNumber")}</div>
							<div>
								<input
									type="text"
									// value={user ? user.phone : ""}
									//TODO: placeholder, value 다시 짜보기
									placeholder={(user && user.phone) || "010-0000-0000"}
									onChange={(phone) => {
										phoneNumber = phone.target.value;
									}}
									className="recipient-phone form-control bg-white"
									ref={phoneInputRef}
								/>
							</div>
						</div>

						<div className="col-12 col-lg-3 px-4">
							<div className="d-none d-lg-block mb-3">&nbsp;</div>
							<div className="d-lg-none mb-0">&nbsp;</div>
							<button className="btn btn btn-primary btn-block" onClick={addUser}>
								{t("register")}
							</button>
						</div>
					</div>
					{/* <table className="table text-center">
							<tr>
								<td className="recipient-box-style">{t("selectUser")}</td>
								<td className="user-select-input">
									<div>
										<SelectInput label="" id={"InputID"} valueList={valueList.map((e) => e.name)} onChange={InputID} />
									</div>
									{/* <SelectSearch
									options={valueList}
									filterOptions={(options) => (query) => {
										let result = [];
										for (let option of options) {
											if (option.name.indexOf(query) != -1) {
												result.push(option);
											}
										}
										return result;
									}}
									closeOnSelect={true}
									search={true}
									multiple={false}
									value={user ? user.userid : ""}
									placeholder={t("selectUser")}
									onChange={(userid) => {
										setUser(_.find(userList, ["userid", userid]));
										// @ts-ignore : 사용자를 바꾸는 경우 전화번호 input field를 초기화시킨다.
										phoneInputRef.current.value = "";
									}}
								/> */}
					{/* </td>
							</tr>
							<tr>
								<td className="recipient-box-style">{t("userName")}</td>
								<td style={{ color: "#4a5568" }}>{user && user.username}</td>
							</tr>
							<tr>
								<td className="recipient-box-style">{t("phoneNumber")}</td>
								{/* <td>{user && user.phone}</td> */}
					{/* <td>
									<input
										type="text"
										placeholder={user ? user.phone : ""}
										onChange={(phone) => {
											phoneNumber = phone.target.value;
										}}
										className="recipient-phone form-control bg-white"
										ref={phoneInputRef}
									></input>
								</td>
							</tr>
							<tr>
								<td colSpan={4}>
									<div className="row">
										<div className="col col-12 col-lg-2 offset-lg-10">
											<button className="btn btn btn-primary btn-block" onClick={addUser}>
												{t("register")}
											</button>
										</div>
									</div>
								</td>
							</tr>
						</table> */}
				</div>
			</div>

			<div className="row mb-1">
				<div className="col">
					{/* RecipentTable */}
					<div className="row ml-0 mt-2 mb-3">
						<h5 className="recipient-sub-title">{t("recipientList")}</h5>
					</div>
					<table className="table text-center">
						<thead>
							<tr style={tableHeaderBg}>
								<td className="fw-600" style={{ fontSize: "12px", color: "#718096" }}>
									{t("userid")}
								</td>
								<td className="fw-600" style={{ fontSize: "12px", color: "#718096" }}>
									{t("userName")}
								</td>
								<td className="fw-600" style={{ fontSize: "12px", color: "#718096" }}>
									{t("phoneNumber")}
								</td>
								<td className="col-2 fw-600" style={{ fontSize: "12px", color: "#718096" }}>
									{t("delete")}
								</td>
							</tr>
						</thead>
						{alertUserList.map((record) => (
							<tr key={record.id} className="recipient-user">
								<td>{record.userid}</td>
								<td>{record.name}</td>
								<td>{record.telno}</td>
								<td>
									<div className="col col-12">
										<button className="btn btn btn-danger btn-block" onClick={() => removeUser(record.id)}>
											{t("delete")}
										</button>
									</div>
								</td>
							</tr>
						))}
					</table>
				</div>
			</div>
		</div>
	);
}

/**
 * 알림사용량 테이블
 * @param {{data: import("../../store/local/AlertRecipentStore").alertUsage}} props
 * @returns
 */
function AlertUsageTable({ data }) {
	const { t } = useTranslation();
	return (
		<div>
			<div className="row ml-0 mb-3">
				<h5 className="recipient-sub-title">{t("alertsOverview")}</h5>
			</div>
			<table className="table text-center">
				<tr>
					<td style={tableHeaderBg} className="recipient-box-style">
						{t("thisMonth")}
					</td>
					<td style={tableHeaderBg} className="recipient-box-style">
						{t("thisYear")}
					</td>
					<td className="fw-600" style={{ color: "#718096", ...tableHeaderBg }}>
						{t("accumulation")}
					</td>
				</tr>
				<tr>
					<td style={{ color: "#4a5568", borderRight: "1px solid black" }}>{data.month}</td>
					<td style={{ color: "#4a5568", borderRight: "1px solid black" }}>{data.year}</td>
					<td className="fw-600" style={{ color: "#4a5568" }}>
						{data.all}
					</td>
				</tr>
			</table>
		</div>
	);
}

/**
 * 알림 수신자 추가
 * @param {{data: Array<import("../../store/local/UserStore").user>, alertUsage: import("../../store/local/AlertRecipentStore").alertUsage, setUserList: any}} props
 * @returns
 */
// function AddRecipentTable({ data, alertUsage, setUserList }) {
// 	const { t } = useTranslation();
// 	/**@type {[user:import("../../store/local/UserStore").user, setUser:any]} */
// 	let [user, setUser] = useState(null);

// 	let valueList = [];
// 	for (let record of data) {
// 		valueList.push({ name: record.userid, value: record.userid, disabled: _.find(alertUsage.users, ["userid", record.userid]) ? true : false });
// 	}

// 	const addUser = useCallback(async () => {
// 		await new AlertRecipentStore().addAlertUser(user.userid, "web");
// 		new UserStore().getUserList().then(({ data }) => setUserList(data));
// 		alert("등록되었습니다.");
// 		setUser(null);
// 	}, [user]);

// 	return (
// 		<table className="table table-bordered bg-white text-center">
// 			<tbody>
// 				<tr>
// 					<td rowSpan={3} className="align-middle" style={{ width: "200px", ...tableHeaderBg }}>
// 						{t("addRecipient")}
// 					</td>
// 					<td>{t("selectUser")}</td>
// 					<td>
// 						<SelectSearch
// 							options={valueList}
// 							filterOptions={(options) => (query) => {
// 								let result = [];
// 								for (let option of options) {
// 									if (option.name.indexOf(query) != -1) {
// 										result.push(option);
// 									}
// 								}

// 								return result;
// 							}}
// 							closeOnSelect={true}
// 							search={true}
// 							multiple={false}
// 							value={user ? user.userid : ""}
// 							placeholder={t("selectUser")}
// 							onChange={(userid) => {
// 								setUser(_.find(data, ["userid", userid]));
// 							}}
// 						/>
// 					</td>
// 				</tr>
// 				<tr>
// 					<td>{t("userName")}</td>
// 					<td>{user && user.username}</td>
// 				</tr>
// 				<tr>
// 					<td>{t("phoneNumber")}</td>
// 					<td>{user && user.email}</td>
// 				</tr>
// 				<tr>
// 					<td colSpan={4}>
// 						<div className="row">
// 							<div className="col col-12 col-lg-2 offset-lg-10">
// 								<button className="btn btn btn-primary btn-block" onClick={addUser}>
// 									{t("register")}
// 								</button>
// 							</div>
// 						</div>
// 					</td>
// 				</tr>
// 			</tbody>
// 		</table>
// 	);
// }

/**
 * 알림 수신자 목록
 * @param {{data: import("../../store/local/AlertRecipentStore").alertUsage}} props
 * @returns
 */
// function RecipentTable({ data }) {
// 	const { t } = useTranslation();

// 	const removeUser = useCallback(async () => {
// 		if (!confirm(t("deleteConfirmDescription"))) {
// 			return;
// 		}

// 		await new AlertRecipentStore().removeAlertUser(data.users[userid]);
// 		new UserStore().getUserList().then(({ data.user }) => setUserList(data));
// 		alert(t("alertRemoved"));
// 	}, []);

// 	return (
// 		<table className="table table-bordered bg-white text-center">
// 			<thead>
// 				<tr>
// 					<th style={tableHeaderBg}>{t("index")}</th>
// 					<th style={tableHeaderBg}>{t("userid")}</th>
// 					<th style={tableHeaderBg}>{t("userName")}</th>
// 					<th style={tableHeaderBg}>{t("phoneNumber")}</th>
// 					<th style={tableHeaderBg}>{t("delete")}</th>
// 				</tr>
// 			</thead>
// 			<tbody>
// 				{data.users.map((record) => (
// 					<tr key={record.id}>
// 						<td>{record.id}</td>
// 						<td>{record.userid}</td>
// 						<td>{record.username}</td>
// 						<td>{record.email}</td>
// 						<td>
// 							<button className="btn btn-sm btn-danger btn-block" onClick={() => removeUser(record.id)}></button>
// 						</td>
// 					</tr>
// 				))}
// 			</tbody>
// 		</table>
// 	);
// }
