/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useHistory, useParams } from "react-router";
import { HeaderMain } from "../components/HeaderMain";
import { TextInput, useInput, SelectInput, SwitchInput } from "../../components/Form";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import AlertConfigStore from "../../store/local/AlertConfigStore";
import { useTranslation } from "react-i18next";
import AccountStore from "../../store/global/AccountStore";
import ProductStore from "../../store/local/ProductStore";
import MonitorStore from "../../store/global/MonitorStore";

export default observer(function EditAlertConfig() {
	const { t } = useTranslation();

	const form = useForm(t);

	const list = MonitorStore.monitorInfoList.map((e) => e.name);
	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("editAlertTitle")} />
			</div>

			<div className="card">
				<div className="card-body">
					<form>
						<span style={{ color: "#4a5568" }}>
							<TextInput label={<span className="fw-600">ID</span>} id={"idInput"} {...form.idInput} disabled={true} />
						</span>
						<SelectInput
							label={<span className="fw-600">{t("geocode")}</span>}
							id={"geotextInput"}
							valueList={AccountStore.getGeotextList()}
							{...form.geotextInput}
						/>
						{/* <SelectInput label={t("productid")} id={"productIdInput"} valueList={form.productIdList} {...form.productIdInput} /> */}
						<SelectInput
							label={<span className="fw-600">{t("productid")}</span>}
							id={"productIdInput"}
							valueList={list}
							{...form.productIdInput}
						/>
						<SelectInput
							label={<span className="fw-600">{t("alertType")}</span>}
							id={"typeInput"}
							valueList={["Connection", "NH3", "H2S", "Indoles", "Acid"]}
							{...form.typeInput}
						/>
						<TextInput label={<span className="fw-600">{t("warningValue")}</span>} id={"warnInput"} {...form.warnInput} />
						<TextInput label={<span className="fw-600">{t("dangerValue")}</span>} id={"errInput"} {...form.errInput} />
						<SelectInput
							label={<span className="fw-600">{t("status")}</span>}
							id={"setupInput"}
							valueList={["on", "off"]}
							{...form.setupInput}
						/>
						<SwitchInput label={<span className="fw-600">환기팬</span>} id={"onWebInput"} />
						<SwitchInput label={<span className="fw-600">거품도포기</span>} id={"onSmsInput"} />
						<div className="row">
							<div className="col-12 col-md-2 mb-md-0 mb-2">
								<button type="button" className="btn btn-primary btn-block" onClick={form.onSave}>
									{t("save")}
								</button>
							</div>

							<div className="col-12 col-md-2 mb-md-0 mb-2 offset-md-6">
								<button type="button" className="btn btn-danger btn-block" onClick={form.onRemove}>
									{t("delete")}
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
	/**@type {{id?: string}} */
	const { id } = useParams();
	const productList = useRef({});
	const [productIdList, setProductIdList] = useState([]);

	let [alertConfigStore] = useState(new AlertConfigStore());
	const history = useHistory();
	const idInput = useInput(id);
	const geotextInput = useInput("");
	const productIdInput = useInput("");
	const typeInput = useInput("");
	const warnInput = useInput("");
	const errInput = useInput("");
	const setupInput = useInput("");

	useEffect(() => {
		new ProductStore().getProductList().then(({ data }) => {
			let list = [];
			for (let record of data) {
				productList.current[record.id] = record;
				list.push(record.id);
			}

			setProductIdList(list);
		});
	}, []);

	useEffect(() => {
		alertConfigStore.getAlertConfigInfo(Number(id)).then(({ data }) => {
			idInput.setValue(data.id.toString());
			geotextInput.setValue(data.geocode);
			productIdInput.setValue(data.productid);
			typeInput.setValue(data.type);
			warnInput.setValue(data.warn);
			errInput.setValue(data.err);
			setupInput.setValue(data.setup);
		});
	}, []);

	let onSave = useCallback(async () => {
		let geocode = _.trim(geotextInput.value);
		let productid = _.trim(productIdInput.value);
		let type = _.trim(typeInput.value);
		let warn = _.trim(warnInput.value);
		let err = _.trim(errInput.value);
		let setup = _.trim(setupInput.value);

		if (!geocode || !productid || !type || !warn || !err || !setup) {
			return alert(t("alertNotCorrectInput")); //입력된 값이 올바르지 않습니다.
		}

		if (!confirm(t("saveConfirmDescription"))) {
			//변경사항을 저장하시겠습니까?
			return;
		}

		let params = {
			id: Number(id),
			geocode,
			productid,
			type,
			warn,
			err,
			setup,
		};

		let { status } = await alertConfigStore.editAlertConfig(params);
		if (status != 200) {
			return;
		}

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/alert/config");
		}
	}, [idInput, geotextInput, productIdInput, typeInput, warnInput, errInput, setupInput]);

	let onRemove = useCallback(async () => {
		if (!confirm(t("deleteConfirmDescription"))) {
			//정말로 삭제하시겠습니까?
			return;
		}

		let { status } = await alertConfigStore.reomveAlertConfig(Number(id));

		if (status != 200) {
			return;
		}

		alert(t("alertRemoved")); //삭제되었습니다

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/alert/config");
		}
	}, []);

	let onCancel = useCallback(() => {
		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/alert/config");
		}
	}, []);

	return {
		productIdList,
		idInput,
		geotextInput,
		productIdInput,
		typeInput,
		warnInput,
		errInput,
		setupInput,
		onSave,
		onRemove,
		onCancel,
	};
}
