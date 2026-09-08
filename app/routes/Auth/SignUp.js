/* eslint-disable react/prop-types */
import React, { useCallback, useState } from "react";

import { EmptyLayout } from "./../../components";

import { LogoThemed } from "../components/LogoThemed/LogoThemed";
import { TextInput, useInput } from "../../components/Form";
import _ from "lodash";
import UserStore from "../../store/local/UserStore";
import { useTranslation } from "react-i18next";

export default function Register({ onComplete }) {
	const form = useForm(onComplete);
	const { t } = useTranslation();

	return (
		<EmptyLayout>
			<div className="container pt-5" style={{ maxWidth: 700 }}>
				{/* START Header */}
				<div className="mb-4">
					<div className="mb-4 text-center">
						<div onClick={onComplete} className="d-inline-block">
							<LogoThemed className="" checkBackground height="40" />
						</div>
					</div>
				</div>
				{/* END Header */}
				{/* START Form */}
				<form>
					<TextInput label={<span className="fw-600">{t("id")}</span>} id={"useridInput"} {...form.useridInput} />
					<TextInput label={<span className="fw-600">{t("email")}</span>} id={"emailInput"} {...form.emailInput} />
					<TextInput label={<span className="fw-600">{t("userName")}</span>} id={"usernameInput"} {...form.usernameInput} />
					<TextInput label={<span className="fw-600">{t("phoneNumber")}</span>} id={"phoneInput"} {...form.phoneInput} />
					<TextInput label={<span className="fw-600">{t("department")}</span>} id={"departInput"} {...form.departInput} />
					<TextInput label={<span className="fw-600">{t("position")}</span>} id={"positionInput"} {...form.positionInput} />

					<div className="row">
						<div className="col-12 col-md-2  mb-md-0 mb-2 offset-md-8">
							<button type="button" className="btn btn-primary btn-block" onClick={form.onSave}>
								{t("signUp")}
							</button>
						</div>

						<div className="col-12 col-md-2  mb-md-0 mb-2">
							<button type="button" className="btn btn-cancel btn-block" onClick={form.onCancel}>
								{t("cancel")}
							</button>
						</div>
					</div>
				</form>
				{/* <p className="text-sm-center mt-5">(C)(주)이엔티 2021 All Rights Reserved.</p> */}
			</div>
		</EmptyLayout>
	);
}

function useForm(onComplete) {
	let [userStore] = useState(new UserStore());
	const useridInput = useInput("");
	const usernameInput = useInput("");
	const departInput = useInput("");
	const positionInput = useInput("");
	const emailInput = useInput("");
	const phoneInput = useInput("");
	const roleInput = useInput("user");

	let onSave = useCallback(async () => {
		let userid = _.trim(useridInput.value);
		let username = _.trim(usernameInput.value);
		let depart = _.trim(departInput.value);
		let position = _.trim(positionInput.value);
		let email = _.trim(emailInput.value);
		let phone = _.trim(phoneInput.value);
		let role = _.trim(roleInput.value);

		if (!userid || !username || !depart || !position || !email || !phone || !role) {
			return alert("입력값이 올바르지 않습니다.");
		}

		if (!confirm("변경사항을 저장하시겠습니까?")) {
			return;
		}

		let params = {
			userid,
			username,
			depart,
			position,
			email,
			phone,
			role: undefined,
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

		alert("회원가입이 요청되었습니다.\n관리자가 확인하고 승인하면 임시비밀번호가 메일로 전송됩니다.");
		onComplete();
	}, [useridInput, usernameInput, departInput, positionInput, emailInput, phoneInput, roleInput]);

	let onCancel = useCallback(() => {
		onComplete();
	}, []);

	return {
		useridInput,
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
