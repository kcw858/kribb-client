/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { HeaderMain } from "../components/HeaderMain";
import { SelectInput, TextInput, useInput } from "../../components/Form";
import { observer } from "mobx-react-lite";
import AccountStore from "../../store/global/AccountStore";
import _ from "lodash";
import UserStore from "../../store/local/UserStore";
import MonitorStore from "../../store/global/MonitorStore";
import { useTranslation } from "react-i18next";

export default observer(function EditUser() {
	const { t } = useTranslation();

	let form = useForm(t);

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("editUserTitle")} />
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
						<span style={{ color: "#4a5568" }}>
							<TextInput
								label={<span className="fw-600">{t("userName")}</span>}
								id={"usernameInput"}
								{...form.usernameInput}
								disabled={true}
							/>
						</span>
						<SelectInput
							label={<span className="fw-600">{t("geocode")}</span>}
							id={"geotextInput"}
							valueList={AccountStore.getGeotextList()}
							{...form.geotextInput}
							disabled={form.useridInput.value === "admin" && true}
						/>
						<span style={{ color: "#4a5568" }}>
							<TextInput
								label={<span className="fw-600">{t("company")}</span>}
								id={"departInput"}
								{...form.departInput}
								disabled={true}
							/>
						</span>
						<span style={{ color: "#4a5568" }}>
							<TextInput
								label={<span className="fw-600">{t("position")}</span>}
								id={"positionInput"}
								{...form.positionInput}
								disabled={true}
							/>
						</span>
						<span style={{ color: "#4a5568" }}>
							<TextInput
								label={<span className="fw-600">{t("email")}</span>}
								id={"emailInput"}
								{...form.emailInput}
								disabled={true}
							/>
						</span>
						<span style={{ color: "#4a5568" }}>
							<TextInput
								label={<span className="fw-600">{t("phoneNumber")}</span>}
								id={"phoneInput"}
								{...form.phoneInput}
								disabled={true}
							/>
						</span>
						<SelectInput
							label={<span className="fw-600">{t("rank")}</span>}
							id={"roleInput"}
							valueList={["user", "admin", "super"]}
							{...form.roleInput}
							disabled={form.useridInput.value === "admin" && true}
						/>

						<div className="row">
							{form.isConfirm ? (
								<div className="col-12 col-md-3 mb-md-0 mb-2">
									<button type="button" className="btn btn-primary btn-block" onClick={() => form.resetPassword()}>
										{t("initPassword")}
									</button>
								</div>
							) : (
								<div className="col-12 col-md-2 mb-md-0 mb-2">
									<button type="button" className="btn btn-success btn-block" onClick={() => form.confirmRegister()}>
										{t("approval")}
									</button>
								</div>
							)}
							<div className="col-12 col-md-2 mb-md-0 mb-2">
								<button type="button" className="btn btn-danger btn-block" onClick={form.onRemove}>
									{t("removeUser")}
								</button>
							</div>

							<div className="col-12 col-md-2 mb-md-0 mb-2 offset-md-3">
								<button type="button" className="btn btn-save btn-block" onClick={form.onSave}>
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

function useForm(t) {
	let [userStore] = useState(new UserStore());

	/**@type {{id?: string}} */
	const { id } = useParams();
	const history = useHistory();
	const originalUserInfo = useRef(null);
	const [isConfirm, setIsConfrim] = useState({});
	const useridInput = useInput("");
	const usernameInput = useInput("");
	const geotextInput = useInput("");
	const departInput = useInput("");
	const positionInput = useInput("");
	const emailInput = useInput("");
	const phoneInput = useInput("");
	const roleInput = useInput("");

	useEffect(() => {
		userStore.getUserInfo(id).then(({ data }) => {
			useridInput.setValue(data.userid);
			usernameInput.setValue(data.username);
			geotextInput.setValue(AccountStore.getGeotextBygeocode(data.geocode));
			departInput.setValue(data.depart);
			positionInput.setValue(data.position);
			emailInput.setValue(data.email);
			phoneInput.setValue(data.phone);
			roleInput.setValue(data.role);
			setIsConfrim(data.isConfirm);
			originalUserInfo.current = data;
		});
	}, []);

	let onSave = useCallback(async () => {
		let role = _.trim(roleInput.value);
		let geocode = AccountStore.getGeocodeByGeotext(geotextInput.value);

		if (!confirm("사용자의 정보를 변경하시겠습니까?")) {
			return;
		}

		let roleResponse = await userStore.setRole(id, role);
		let geocodeResponse = await userStore.setgeocode(id, geocode);
		if (roleResponse.status != 200 || geocodeResponse.status != 200) {
			return;
		}

		if (AccountStore.userid == id) {
			AccountStore.updateRole(role);
			AccountStore.updategeocode(geocode);
		}

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

	let onRemove = useCallback(async () => {
		if (!confirm(t("deleteConfirmDescription"))) {
			return;
		}

		let { status } = await userStore.remoteUser(id);

		if (status != 200) {
			return;
		} else {
			alert(t("alertRemoved"));
		}

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/user");
		}
	}, []);

	let confirmRegister = useCallback(async () => {
		if (confirm("해당 사용자의 가입을 승인하시겠습니까?")) {
			await userStore.confirmRegister(id);
			setIsConfrim(true);
			alert("가입이 승인되었습니다.");
		}
	}, []);

	let resetPassword = useCallback(async () => {
		if (confirm("해당 사용자의 비밀번호를 초기화 하시겠습니까?")) {
			await userStore.resetPassword(id, originalUserInfo.current.username, originalUserInfo.current.email);
			alert("비밀번호를 초기화 하였습니다.");
		}
	}, []);

	return {
		useridInput,
		usernameInput,
		geotextInput,
		departInput,
		positionInput,
		emailInput,
		phoneInput,
		roleInput,
		isConfirm,
		confirmRegister,
		onSave,
		onCancel,
		onRemove,
		resetPassword,
	};
}
