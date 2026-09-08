/* eslint-disable react/prop-types */
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { HeaderMain } from "../components/HeaderMain";
import { SelectInput, TextInput, useInput } from "../../components/Form";
import AccountStore from "../../store/global/AccountStore";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import UserStore from "../../store/local/UserStore";
import MonitorStore from "../../store/global/MonitorStore";
import { useTranslation } from "react-i18next";

export default observer(function AddUser() {
	const { t } = useTranslation();

	const form = useForm();

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("addUserTitle")} />
			</div>

			<div className="card">
				<div className="card-body">
					<form>
						<TextInput label={t("userid")} id={"useridInput"} {...form.useridInput} />
						<TextInput label={t("userName")} id={"usernameInput"} {...form.usernameInput} />
						<SelectInput
							label={t("geocode")}
							id={"geotextInput"}
							valueList={AccountStore.getGeotextList()}
							{...form.geotextInput}
						/>
						<TextInput label={t("company")} id={"departInput"} {...form.departInput} />
						<TextInput label={t("position")} id={"positionInput"} {...form.positionInput} />
						<TextInput label={t("email")} id={"emailInput"} {...form.emailInput} />
						<TextInput label={t("phoneNumber")} id={"phoneInput"} {...form.phoneInput} />
						<SelectInput label={t("rank")} id={"roleInput"} valueList={["user", "admin", "super"]} {...form.roleInput} />

						<div className="row">
							<div className="col-12 col-md-2  mb-md-0 mb-2 offset-md-8">
								<button type="button" className="btn btn-primary btn-block" onClick={form.onSave}>
									{t("save")}
								</button>
							</div>

							<div className="col-12 col-md-2  mb-md-0 mb-2">
								<button type="button" className="btn btn-outline-secondary btn-block" onClick={form.onCancel}>
									{t("cancel")}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
});

function useForm() {
	let [userStore] = useState(new UserStore());
	const history = useHistory();
	const useridInput = useInput("");
	const usernameInput = useInput("");
	const departInput = useInput("");
	const geotextInput = useInput("");
	const positionInput = useInput("");
	const emailInput = useInput("");
	const phoneInput = useInput("");
	const roleInput = useInput("user");

	let onSave = useCallback(async () => {
		if (AccountStore.role != "super") {
			alert("계정등록 권한이 없습니다.");
			return;
		}

		let userid = _.trim(useridInput.value);
		let username = _.trim(usernameInput.value);
		let geocode = AccountStore.getGeocodeByGeotext(geotextInput.value);
		let depart = _.trim(departInput.value);
		let position = _.trim(positionInput.value);
		let email = _.trim(emailInput.value);
		let phone = _.trim(phoneInput.value);
		let role = _.trim(roleInput.value);

		if (!userid || !username || !geocode || !depart || !position || !email || !phone || !role) {
			return alert("입력값이 올바르지 않습니다.");
		}

		if (!confirm("변경사항을 저장하시겠습니까?")) {
			return;
		}

		let params = {
			userid,
			username,
			geocode,
			depart,
			position,
			email,
			phone,
			role,
		};

		let { status } = await userStore.addUser(params);

		// 이미 있는 아이디의 경우 : BadRequest 처리
		if (status == 400) {
			alert("이미 등록된 아이디입니다.\n등록된 아이디임에도 불구하고 사용할 수 없다면, 관리자 승인이 필요합니다.");
			return;
		}

		if (status != 200) {
			return;
		}

		await userStore.setRole(userid, role);
		await userStore.setgeocode(userid, geocode);

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/user");
		}
	}, [useridInput, usernameInput, geotextInput, departInput, positionInput, emailInput, phoneInput, roleInput]);

	let onCancel = useCallback(() => {
		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/user");
		}
	}, []);

	return {
		useridInput,
		geotextInput,
		usernameInput,
		departInput,
		positionInput,
		emailInput,
		phoneInput,
		roleInput,
		onSave,
		onCancel,
	};
}
