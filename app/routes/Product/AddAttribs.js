/* eslint-disable react/prop-types */
import React, { useCallback, useState } from "react";
import { useHistory, useParams } from "react-router";
import { HeaderMain } from "../components/HeaderMain";
import { SelectInput, TextInput, useInput } from "../../components/Form";
import _ from "lodash";
import AttribsStore from "../../store/local/AttribsStore";
import { useTranslation } from "react-i18next";

export default function AddSensor() {
	const { t } = useTranslation();

	/**@type {{id?: string, attrId?: string}} */
	const { id, attrId } = useParams();
	let form = useForm(id, attrId);

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("addSensorTitle")} />
			</div>

			<div className="card">
				<div className="card-body">
					<form>
						<TextInput label={"id"} id={"idInput"} {...form.idInput} disabled={true} />
						<SelectInput label={"productid"} id={"productIdInput"} {...form.productIdInput} disabled={true} />
						<SelectInput label={"type"} id={"typeInput"} valueList={["Sensor", "Actuator"]} {...form.typeInput} />
						<TextInput label={"alias"} id={"aliasInput"} {...form.aliasInput} />
						<TextInput label={"name"} id={"nameInput"} {...form.nameInput} />
						<SelectInput label={"onoff"} id={"onoffInput"} {...form.onoffInput} valueList={["on", "off"]} />
						<TextInput label={"label"} id={"labelInput"} {...form.labelInput} />
						<TextInput label={"spec"} id={"specInput"} {...form.specInput} />
						<TextInput label={"chemiunit"} id={"chemiunitInput"} {...form.chemiunitInput} />
						<TextInput label={"threshold"} id={"thresholdInput"} {...form.thresholdInput} />
						<TextInput label={"min"} id={"minInput"} {...form.minInput} />
						<TextInput label={"max"} id={"maxInput"} {...form.maxInput} />
						<TextInput label={"elecunit"} id={"elecunitInput"} {...form.elecunitInput} />
						<TextInput label={"note"} id={"noteInput"} {...form.noteInput} />

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

function useForm(id, type) {
	let [attribsStore] = useState(new AttribsStore());
	const history = useHistory();
	const idInput = useInput("");
	const productIdInput = useInput(id);
	const typeInput = useInput(type);
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
		if (!confirm("등록 하시겠습니까?")) {
			return;
		}

		let params = {
			productid: id,
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

		let { status } = await attribsStore.addAttribs({ id: undefined, ...params });

		if (status != 200) {
			return;
		}

		alert("등록되었습니다.");

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
	};
}
