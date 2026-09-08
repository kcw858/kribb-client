/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { HeaderMain } from "../components/HeaderMain";
import { SelectInput, TextInput, useInput } from "../../components/Form";
import _ from "lodash";
import AttribsStore from "../../store/local/AttribsStore";
import { useTranslation } from "react-i18next";

export default function EditSensor() {
	const { t } = useTranslation();
	/**@type {{id?: string, attrId?: string}} */
	const { id, attrId } = useParams();
	let form = useForm(t, id, attrId);

	useEffect(() => {
		new AttribsStore().getAttribsInfo(Number(attrId)).then(({ data }) => {
			form.typeInput.setValue(data.type);
			form.aliasInput.setValue(data.alias);
			form.nameInput.setValue(data.name);
			form.onoffInput.setValue(data.onoff);
			form.labelInput.setValue(data.label);
			form.specInput.setValue(data.spec);
			form.chemiunitInput.setValue(data.chemiunit);
			form.thresholdInput.setValue(data.threshold);
			form.minInput.setValue(data.min);
			form.maxInput.setValue(data.max);
			form.elecunitInput.setValue(data.elecunit);
			form.noteInput.setValue(data.note);
		});
	}, []);

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("editSensorTitle")} />
			</div>

			<div className="card">
				<div className="card-body">
					<form>
						<span style={{ color: "#4a5568" }}>
							<TextInput label={<span className="fw-600">ID</span>} id={"idInput"} {...form.idInput} disabled={true} />
						</span>
						<span style={{ color: "#4a5568" }}>
							<SelectInput
								label={<span className="fw-600">PRODUCTID</span>}
								id={"productIdInput"}
								{...form.productIdInput}
								disabled={true}
							/>
						</span>
						<SelectInput
							label={<span className="fw-600">TYPE</span>}
							id={"typeInput"}
							valueList={["Sensor", "Actuator"]}
							{...form.typeInput}
						/>
						<TextInput label={<span className="fw-600">ALIAS</span>} id={"aliasInput"} {...form.aliasInput} />
						<TextInput label={<span className="fw-600">NAME</span>} id={"nameInput"} {...form.nameInput} />
						<SelectInput
							label={<span className="fw-600">ON/OFF</span>}
							id={"onoffInput"}
							{...form.onoffInput}
							valueList={["on", "off"]}
						/>
						<TextInput label={<span className="fw-600">LABEL</span>} id={"labelInput"} {...form.labelInput} />
						<TextInput label={<span className="fw-600">SPEC</span>} id={"specInput"} {...form.specInput} />
						<TextInput label={<span className="fw-600">CHEMIUNIT</span>} id={"chemiunitInput"} {...form.chemiunitInput} />
						<TextInput label={<span className="fw-600">THRESHOLD</span>} id={"thresholdInput"} {...form.thresholdInput} />
						<TextInput label={<span className="fw-600">MIN</span>} id={"minInput"} {...form.minInput} />
						<TextInput label={<span className="fw-600">MAX</span>} id={"maxInput"} {...form.maxInput} />
						<TextInput label={<span className="fw-600">ELECUNIT</span>} id={"elecunitInput"} {...form.elecunitInput} />
						<TextInput label={<span className="fw-600">NOTE</span>} id={"noteInput"} {...form.noteInput} />

						<div className="row">
							<div className="col-12 col-md-2 mb-md-0 mb-2">
								<button type="button" className="btn btn-primary btn-block" onClick={form.onSave}>
									{t("save")}
								</button>
							</div>

							<div className="col-12 col-md-2 mb-md-0 mb-2 offset-md-6">
								<button type="button" className="btn btn-danger btn-block" onClick={form.remove}>
									{t("delete")}
								</button>
							</div>

							<div className="col-12 col-md-2 mb-md-0 mb-2">
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
}

function useForm(t, id, attrId) {
	let [attribsStore] = useState(new AttribsStore());
	const history = useHistory();
	const idInput = useInput(attrId || "");
	const productIdInput = useInput(id || "");
	const typeInput = useInput("");
	const aliasInput = useInput("");
	const nameInput = useInput("");
	const onoffInput = useInput("");
	const labelInput = useInput("");
	const specInput = useInput("");
	const chemiunitInput = useInput("");
	const thresholdInput = useInput("");
	const minInput = useInput("");
	const maxInput = useInput("");
	const elecunitInput = useInput("");
	const noteInput = useInput("");

	let onSave = async () => {
		if (!confirm("변경사항을 저장하시겠습니까?")) {
			return;
		}

		let params = {
			id: Number(attrId),
			productid: _.trim(productIdInput.value),
			type: _.trim(typeInput.value),
			alias: _.trim(aliasInput.value),
			name: _.trim(nameInput.value),
			onoff: _.trim(onoffInput.value),
			label: _.trim(labelInput.value),
			spec: _.trim(specInput.value),
			chemiunit: _.trim(chemiunitInput.value),
			threshold: _.trim(thresholdInput.value),
			min: _.trim(minInput.value),
			max: _.trim(maxInput.value),
			elecunit: _.trim(elecunitInput.value),
			note: _.trim(noteInput.value),
		};

		if (!params.type) {
			return alert(`type을 선택하세요.`);
		}

		for (let key in params) {
			if (_.isNil(params[key])) {
				return alert(`입력된 값이 올바르지 않습니다(${key})`);
			}
		}

		let { status } = await attribsStore.editAttribs(params);

		if (status != 200) {
			return;
		}

		alert("수정되었습니다.");

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push(`/product/info/${id}`);
		}
	};

	let onCancel = useCallback(() => {
		if (history.length > 0) {
			history.goBack();
		} else {
			history.push(`/product/info/${id}`);
		}
	}, []);

	let remove = async () => {
		if (!confirm(t("deleteConfirmDescription"))) {
			return;
		}

		let { status } = await attribsStore.removeAttribs(Number(attrId));

		if (status != 200) {
			return;
		}

		alert(t("alertRemoved"));

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push(`/product/info/${id}`);
		}
	};

	return {
		idInput,
		productIdInput,
		typeInput,
		aliasInput,
		nameInput,
		onoffInput,
		labelInput,
		specInput,
		chemiunitInput,
		thresholdInput,
		minInput,
		maxInput,
		elecunitInput,
		noteInput,
		onSave,
		onCancel,
		remove,
	};
}
