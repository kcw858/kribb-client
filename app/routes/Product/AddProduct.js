/* eslint-disable react/prop-types */
import React from "react";
import { useHistory } from "react-router";
import { TextInput, useInput } from "../../components/Form";
import ProductStore from "../../store/local/ProductStore";
import { HeaderMain } from "../components/HeaderMain";
import _ from "lodash";
import { useTranslation } from "react-i18next";

export default function AddProduct() {
	const { t } = useTranslation();

	const form = useForm();

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("addProductTitle")} />
			</div>

			<div className="card">
				<div className="card-body">
					<form>
						<TextInput label={t("productid")} id={"idInput"} {...form.idInput} />
						<TextInput label={t("manufacturer")} id={"companyInput"} {...form.companyInput} />
						<TextInput label={t("productName")} id={"nameInput"} {...form.nameInput} />
						<TextInput label={t("registeredDate")} id={"registInput"} {...form.registInput} />
						<TextInput label={t("releasedDate")} id={"releaseInput"} {...form.releaseInput} />
						<TextInput label={t("purpose")} id={"purposeInput"} {...form.purposeInput} />
						<TextInput label={t("note")} id={"noteInput"} {...form.noteInput} />

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
}

function useForm() {
	const history = useHistory();

	const idInput = useInput("");
	const companyInput = useInput("");
	const nameInput = useInput("");
	const registInput = useInput("");
	const releaseInput = useInput("");
	const purposeInput = useInput("");
	const noteInput = useInput("");

	let onSave = async () => {
		if (!confirm("변경사항을 저장하시겠습니까?")) {
			return;
		}

		let params = {
			id: _.trim(idInput.value),
			company: _.trim(companyInput.value),
			name: _.trim(nameInput.value),
			regist: _.trim(registInput.value),
			release: _.trim(releaseInput.value),
			purpose: _.trim(purposeInput.value),
			note: _.trim(noteInput.value),
		};

		if (!params.company) {
			return alert(`소속을 선택하세요`);
		}

		for (let key in params) {
			if (_.isNil(params[key])) {
				return alert(`입력된 값이 올바르지 않습니다(${key})`);
			}
		}

		await new ProductStore().addProduct(params);

		alert("등록되었습니다.");

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/product");
		}
	};

	let onCancel = () => {
		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/product");
		}
	};

	return {
		idInput,
		companyInput,
		nameInput,
		registInput,
		releaseInput,
		purposeInput,
		noteInput,
		onSave,
		onCancel,
	};
}
