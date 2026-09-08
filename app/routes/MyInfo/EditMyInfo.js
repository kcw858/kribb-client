/* eslint-disable react/prop-types */
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { HeaderMain } from "../components/HeaderMain";
import { Dropdown } from "react-bootstrap";
import { SwitchInput, SelectInput, TextInput, useInput } from "../../components/Form";
import { observer } from "mobx-react-lite";
import AccountStore from "../../store/global/AccountStore";
import PasswordInput from "../../components/Form/PasswordInput";
import _ from "lodash";
import useCheckbox from "../../components/Form/useCheckbox";
import UserStore from "../../store/local/UserStore";
import { useTranslation } from "react-i18next";

export default observer(function EditMyInfo() {
	const { t, i18n } = useTranslation();

	let form = useForm();

	useEffect(() => {
		i18n.changeLanguage(window.localStorage.getItem("language"));
	}, []);

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("myInfoTitle")} />
			</div>

			<div className="row justify-content-end mb-2 mr-3">
				<Dropdown
					className="mr-2 justify-content-end"
					onSelect={(value) => {
						window.localStorage.setItem("language", value);
						i18n.changeLanguage(value);
					}}
				>
					<Dropdown.Toggle variant="light" size="sm" className="transLanguageBtn" style={{ color: "#4A5568" }}>
						{i18n.language == "ko" ? "한국어" : "ENGLISH"}
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item eventKey={"ko"}>한국어</Dropdown.Item>
						<Dropdown.Item eventKey={"en"}>ENGLISH</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>

				<div className="input-group input-group-sm mr-2" style={{ maxWidth: 120 }}>
					<div className="input-group-prepend">
						<span className="input-group-text" style={{ backgroundColor: "#E2E8F0" }}>
							<i className="fa fa-fw fa-lock" style={{ color: "#4A5568" }} />
						</span>
					</div>
					<input
						type="text"
						value={AccountStore.lockInterval}
						style={{ width: window["mode"] == "desktop" ? 50 : 40, textAlign: "center", color: "#4A5568" }}
						className="form-control bg-white"
						onChange={(e) => AccountStore.setLockInterval(e.currentTarget.value)}
					/>
					<div className="input-group-append">
						<span className="input-group-text" style={{ backgroundColor: "#E2E8F0", color: "#4A5568" }}>
							{t("menuMin")}
						</span>
					</div>
				</div>
			</div>
			<div className="card">
				<div className="card-body">
					<form>
						<span style={{ color: "#4a5568" }}>
							<TextInput
								label={<span className="fw-600">{t("userid")}</span>}
								id={"useridInput"}
								{...form.useridInput}
								disabled={true}
							/>
						</span>
						<PasswordInput label={<span className="fw-600">{t("password")}</span>} id={"userpwInput"} {...form.userpwInput} />
						<TextInput label={<span className="fw-600">{t("userName")}</span>} id={"usernameInput"} {...form.usernameInput} />
						<SelectInput
							label={<span className="fw-600">{t("geocode")}</span>}
							id={"geotextInput"}
							valueList={AccountStore.getGeotextList()}
							{...form.geotextInput}
							disabled={AccountStore.role != "super"}
						/>
						<TextInput label={<span className="fw-600">{t("company")}</span>} id={"departInput"} {...form.departInput} />
						<TextInput label={<span className="fw-600">{t("position")}</span>} id={"positionInput"} {...form.positionInput} />
						<TextInput label={<span className="fw-600">{t("email")}</span>} id={"emailInput"} {...form.emailInput} />
						<TextInput label={<span className="fw-600">{t("phoneNumber")}</span>} id={"phoneInput"} {...form.phoneInput} />
						<SwitchInput label={<span className="fw-600">{t("webAlert")}</span>} id={"onWebInput"} {...form.onWebInput} />
						{/* <SwitchInput label={<span className="fw-600">{t("emailAlert")}</span>} id={"onmailInput"} {...form.onmailInput} /> */}
						<SwitchInput label={<span className="fw-600">{t("smsAlert")}</span>} id={"onSmsInput"} {...form.onSmsInput} />
						{/* <SwitchInput label={<span className="fw-600">{t("pushAlert")}</span>} id={"onPushInput"} {...form.onPushInput} /> */}
						<span style={{ color: "#4a5568" }}>
							<SelectInput
								label={<span className="fw-600">{t("rank")}</span>}
								id={"roleInput"}
								valueList={["user", "admin", "super"]}
								{...form.roleInput}
								disabled={true}
							/>
						</span>

						<div className="row">
							<div className="col-12 col-md-2  mb-md-0 mb-2 offset-md-8">
								<button type="button" className="btn btn-primary btn-block" onClick={form.onSave}>
									{t("save")}
								</button>
							</div>

							<div className="col-12 col-md-2  mb-md-0 mb-2">
								<button type="button" className="btn btn-cancel btn-block" onClick={form.onCancel}>
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
	const history = useHistory();
	const useridInput = useInput(AccountStore.userid);
	const userpwInput = useInput("");
	const usernameInput = useInput(AccountStore.username);
	const geotextInput = useInput(AccountStore.getGeotextBygeocode(AccountStore.geocode));
	const departInput = useInput(AccountStore.depart);
	const positionInput = useInput(AccountStore.position);
	const emailInput = useInput(AccountStore.email);
	const phoneInput = useInput(AccountStore.phone);
	const roleInput = useInput(AccountStore.role);
	const onWebInput = useCheckbox(AccountStore.onweb);
	const onmailInput = useCheckbox(AccountStore.onmail);
	const onSmsInput = useCheckbox(AccountStore.onsms);
	const onPushInput = useCheckbox(AccountStore.onpush);

	let onSave = useCallback(async () => {
		let userid = _.trim(useridInput.value);
		let userpw = _.trim(userpwInput.value);
		let username = _.trim(usernameInput.value);
		let geocode = AccountStore.getGeocodeByGeotext(geotextInput.value);
		let depart = _.trim(departInput.value);
		let position = _.trim(positionInput.value);
		let email = _.trim(emailInput.value);
		let phone = _.trim(phoneInput.value);
		let role = _.trim(roleInput.value);
		let onweb = onWebInput.value;
		let onmail = onmailInput.value;
		let onsms = onSmsInput.value;
		let onpush = onPushInput.value;

		if (!userpw) {
			return alert(t("inputPassword"));
		}

		if (!userid || !username || !geocode || !depart || !position || !email || !phone || !role) {
			return alert("입력값이 올바르지 않습니다.");
		}

		if (!confirm("변경사항을 저장하시겠습니까?")) {
			return;
		}

		let { status } = await AccountStore.updateMyInfo({
			userid: undefined,
			userpw,
			username,
			geocode,
			depart,
			position,
			email,
			phone,
			onweb,
			onmail,
			onsms,
			onpush,
			role: undefined,
			isConfirm: undefined,
		});

		if (status != 200) {
			return;
		}

		if (AccountStore.role == "super") {
			await new UserStore().setgeocode(AccountStore.userid, geocode);
		}

		await AccountStore.login(AccountStore.userid, userpw);

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/user");
		}
	}, [
		useridInput,
		userpwInput,
		usernameInput,
		geotextInput,
		departInput,
		positionInput,
		emailInput,
		phoneInput,
		roleInput,
		onWebInput,
		onmailInput,
		onSmsInput,
		onPushInput,
	]);

	let onCancel = useCallback(() => {
		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/");
		}
	}, []);

	return {
		useridInput,
		userpwInput,
		usernameInput,
		geotextInput,
		departInput,
		positionInput,
		emailInput,
		phoneInput,
		roleInput,
		onWebInput,
		onmailInput,
		onSmsInput,
		onPushInput,
		onSave,
		onCancel,
	};
}
