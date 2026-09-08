/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useHistory } from "react-router";
import { HeaderMain } from "../components/HeaderMain";
import { TextInput, useInput, SelectInput, SwitchInput } from "../../components/Form";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import AlertConfigStore from "../../store/local/AlertConfigStore";
import { useTranslation } from "react-i18next";
import AccountStore from "../../store/global/AccountStore";
import ProductStore from "../../store/local/ProductStore";
import MonitorStore from "../../store/global/MonitorStore";

export default observer(function AddAlertConfig() {
	const { t } = useTranslation();

	const form = useForm(t);

	const list = MonitorStore.monitorInfoList.map((e) => e.name);

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("addAlertTitle")} />
			</div>

			<div className="card">
				<div className="card-body">
					<form>
						<SelectInput
							label={t("geocode")}
							id={"geotextInput"}
							valueList={AccountStore.getGeotextList()}
							{...form.geotextInput}
						/>
						{/* <SelectInput label={t("productid")} id={"productIdInput"} valueList={form.productIdList} {...form.productIdInput} /> */}
						<SelectInput label={t("productid")} id={"productIdInput"} valueList={list} {...form.productIdInput} />
						<SelectInput
							label={t("alertType")}
							id={"typeInput"}
							valueList={["Connection", "NH3", "H2S", "Odor", "VOC"]}
							{...form.typeInput}
						/>
						<TextInput label={t("warningValue")} id={"warnInput"} {...form.warnInput} />
						<TextInput label={t("dangerValue")} id={"errInput"} {...form.errInput} />
						<SelectInput label={t("status")} id={"setupInput"} valueList={["on", "off"]} {...form.setupInput} />
						<SwitchInput label={"환기팬"} id={"onWebInput"} />
						<SwitchInput label={"거품도포기"} id={"onSmsInput"} />
						<div className="row">
							<div className="col-12 col-md-2  mb-md-0 mb-2 offset-md-8">
								<button type="button" className="btn btn-primary btn-block" onClick={form.onSave}>
									{t("save")}
								</button>
							</div>

							<div className="col-12 col-md-2  mb-md-0 mb-2">
								<button type="button" className="btn btn-outline-warnary btn-block" onClick={form.onCancel}>
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
	const productList = useRef({});
	const [productIdList, setProductIdList] = useState([]);

	let [alertConfigStore] = useState(new AlertConfigStore());
	const history = useHistory();
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

	let onSave = useCallback(async () => {
		let geocode = _.trim(geotextInput.value);
		let productid = _.trim(productIdInput.value);
		let type = _.trim(typeInput.value);
		let warn = _.trim(warnInput.value);
		let err = _.trim(errInput.value);
		let setup = _.trim(setupInput.value);

		if (!geocode || !productid || !type || !warn || !err || !setup) {
			return alert("입력값이 올바르지 않습니다.");
		}

		if (!confirm("변경사항을 저장하시겠습니까?")) {
			return;
		}

		let params = {
			id: undefined,
			geocode,
			productid,
			type,
			warn,
			err,
			setup,
		};

		let { status } = await alertConfigStore.addAlertConfig(params);
		if (status != 200) {
			return;
		}

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/alert/config");
		}
	}, [geotextInput, productIdInput, typeInput, warnInput, errInput, setupInput]);

	let onCancel = useCallback(() => {
		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/alert/config");
		}
	}, []);

	return {
		productIdList,
		geotextInput,
		productIdInput,
		typeInput,
		warnInput,
		errInput,
		setupInput,
		onSave,
		onCancel,
	};
}
