/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { SelectInput, TextInput, useInput } from "../../components/Form";
import ProductStore from "../../store/local/ProductStore";
import { HeaderMain } from "../components/HeaderMain";
import _ from "lodash";
import { useTranslation } from "react-i18next";

export default function EditProduct() {
	const { t } = useTranslation();

	/**@type {{id?: string}} */
	const { id } = useParams();

	const form = useForm(t, id);

	useEffect(() => {
		new ProductStore().getProductInfo(id).then(({ data }) => {
			form.idInput.setValue(data.id);
			form.companyInput.setValue(data.company);
			form.nameInput.setValue(data.name);
			form.registInput.setValue(data.regist);
			form.releaseInput.setValue(data.release);
			form.purposeInput.setValue(data.purpose);
			form.noteInput.setValue(data.note);
		});
	}, []);

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("editProductTitle")} />
			</div>

			<div className="card">
				<div className="card-body">
					<form>
						<span style={{ color: "#4a5568" }}>
							<TextInput
								label={<span className="fw-600">{t("productid")}</span>}
								id={"idInput"}
								{...form.idInput}
								disabled={true}
							/>
						</span>
						<SelectInput
							label={<span className="fw-600">{t("manufacturer")}</span>}
							id={"companyInput"}
							valueList={["insys", "jtron"]}
							{...form.companyInput}
						/>
						<TextInput label={<span className="fw-600">{t("productName")}</span>} id={"nameInput"} {...form.nameInput} />
						<TextInput label={<span className="fw-600">{t("registeredDate")}</span>} id={"registInput"} {...form.registInput} />
						<TextInput label={<span className="fw-600">{t("releasedDate")}</span>} id={"releaseInput"} {...form.releaseInput} />
						<TextInput label={<span className="fw-600">{t("purpose")}</span>} id={"purposeInput"} {...form.purposeInput} />
						<TextInput label={<span className="fw-600">{t("note")}</span>} id={"noteInput"} {...form.noteInput} />

						<div className="row">
							<div className="col-12 col-md-2  mb-md-0 mb-2">
								<button type="button" className="btn btn-danger btn-block" onClick={form.onRemove}>
									{t("delete")}
								</button>
							</div>

							<div className="col-12 col-md-2  mb-md-0 mb-2 offset-md-6">
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

function useForm(t, id) {
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

		await new ProductStore().editProduct(params);

		alert("수정되었습니다.");

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

	let onRemove = async () => {
		if (!confirm(t("deleteConfirmDescription"))) {
			return;
		}

		await new ProductStore().removeProduct(id);
		alert(t("alertRemoved"));

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
		onRemove,
	};
}
