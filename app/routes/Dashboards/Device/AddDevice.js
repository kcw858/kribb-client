/* eslint-disable react/prop-types */
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { SelectInput, TextInput, useInput } from "../../../components/Form";
import AccountStore from "../../../store/global/AccountStore";
import MonitorStore from "../../../store/global/MonitorStore";
import DeviceStore from "../../../store/local/DeviceStore";
import ProductStore from "../../../store/local/ProductStore";
import { HeaderMain } from "../../components/HeaderMain";
import ExpressionSelector from "./components/ExpressionSelector";

export default function AddDevice() {
	const { t } = useTranslation();
	const form = useForm(t);
	// @ts-ignore
	const { lat, lng } = useParams();

	useEffect(() => {
		form.latiInput.setValue(lat || "");
		form.longiInput.setValue(lng || "");
	}, []);

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("addDevice")} />
			</div>

			<div className="card">
				<div className="card-body">
					<form>
						<SelectInput
							label={<span className="fw-600">{t("productid")}</span>}
							id={"productIdInput"}
							valueList={form.productIdList}
							{...form.productIdInput}
						/>
						<TextInput label={<span className="fw-600">{t("deviceid")}</span>} id={"idInput"} {...form.idInput} />
						<span style={{ color: "#4a5568" }}>
							<SelectInput
								label={<span className="fw-600">{t("manufacturer")}</span>}
								id={"companyInput"}
								valueList={["insys", "jtron"]}
								{...form.companyInput}
								disabled={true}
							/>
						</span>
						<TextInput label={<span className="fw-600">{t("deviceName")}</span>} id={"nameInput"} {...form.nameInput} />
						<TextInput label={<span className="fw-600">{t("macAddress")}</span>} id={"macaddrInput"} {...form.macaddrInput} />
						<TextInput label={<span className="fw-600">{t("proprietor")}</span>} id={"departInput"} {...form.departInput} />
						<TextInput
							label={<span className="fw-600">{t("emplacement")}</span>}
							id={"addrInput"}
							placeholder="행정구역 (도/시/군)을 제외한 주소만 적으세요."
							{...form.addrInput}
						/>
						<SelectInput
							label={<span className="fw-600">{t("geocode")}</span>}
							id={"geotextInput"}
							valueList={AccountStore.getGeotextList()}
							{...form.geotextInput}
						/>
						<TextInput label={<span className="fw-600">{t("latitude")}</span>} id={"latiInput"} {...form.latiInput} />
						<TextInput label={<span className="fw-600">{t("longitude")}</span>} id={"longiInput"} {...form.longiInput} />
						<TextInput label={<span className="fw-600">{"Firmware"}</span>} id={"firmwareInput"} {...form.firmwareInput} />
						<TextInput label={<span className="fw-600">{t("serverIP")}</span>} id={"serveripInput"} {...form.serveripInput} />
						<TextInput
							label={<span className="fw-600">{t("serverPort")}</span>}
							id={"serverportInput"}
							{...form.serverportInput}
						/>
						<TextInput label={<span className="fw-600">{t("memo")}</span>} id={"memoInput"} {...form.memoInput} />
						<TextInput label={<span className="fw-600">{t("controlDevice")}</span>} id={"controlInput"} {...form.controlInput} />
						<span style={{ color: "#4a5568" }}>
							<SelectInput
								label={<span className="fw-600">{t("status")}</span>}
								id={"statusInput"}
								valueList={["on", "off"]}
								{...form.statusInput}
								disabled={true}
							/>
						</span>
						<SelectInput
							label={<span className="fw-600">{"on_nh3"}</span>}
							id={"on_nh3Input"}
							valueList={["true", "false"]}
							{...form.on_nh3Input}
						/>
						<SelectInput
							label={<span className="fw-600">{"on_h2s"}</span>}
							id={"on_h2sInput"}
							valueList={["true", "false"]}
							{...form.on_h2sInput}
						/>
						<SelectInput
							label={<span className="fw-600">{"on_odor"}</span>}
							id={"on_odorInput"}
							valueList={["true", "false"]}
							{...form.on_odorInput}
						/>
						<SelectInput
							label={<span className="fw-600">{"on_voc"}</span>}
							id={"on_vocInput"}
							valueList={["true", "false"]}
							{...form.on_vocInput}
						/>
						<SelectInput
							label={<span className="fw-600">{"on_indol"}</span>}
							id={"on_indolInput"}
							valueList={["true", "false"]}
							{...form.on_indolInput}
						/>
						<SelectInput
							label={<span className="fw-600">{"on_temp"}</span>}
							id={"on_tempInput"}
							valueList={["true", "false"]}
							{...form.on_tempInput}
						/>
						<SelectInput
							label={<span className="fw-600">{"on_humi"}</span>}
							id={"on_humiInput"}
							valueList={["true", "false"]}
							{...form.on_humiInput}
						/>
						<SelectInput
							label={<span className="fw-600">{"on_sen1"}</span>}
							id={"on_sen1Input"}
							valueList={["true", "false"]}
							{...form.on_sen1Input}
						/>
						<SelectInput
							label={<span className="fw-600">{"on_sen2"}</span>}
							id={"on_sen2Input"}
							valueList={["true", "false"]}
							{...form.on_sen2Input}
						/>
						<SelectInput
							label={<span className="fw-600">{"on_sen3"}</span>}
							id={"on_sen3Input"}
							valueList={["true", "false"]}
							{...form.on_sen3Input}
						/>

						{form.companyInput.value == "insys" && (
							<>
								<TextInput label={"measect"} id={"measectInput"} {...form.measectInput} />
								<TextInput label={"meacycle"} id={"meacycleInput"} {...form.meacycleInput} />
								<TextInput label={"flushsect"} id={"flushsectInput"} {...form.flushsectInput} />
								<TextInput label={"restsect"} id={"restsectInput"} {...form.restsectInput} />
								<TextInput label={"multiple"} id={"multipleInput"} {...form.multipleInput} />
								<TextInput label={"ratio"} id={"ratioInput"} {...form.ratioInput} />
								<TextInput label={"constant"} id={"constantInput"} {...form.constantInput} />
								<TextInput label={"resolution"} id={"resolutionInput"} {...form.resolutionInput} />
								<TextInput label={"deci"} id={"deciInput"} {...form.deciInput} />
							</>
						)}
						{form.companyInput.value == "jtron" && (
							<>
								<ExpressionSelector label={"NH3"} expressionValueInput={form.rex_nh3Input} />
								<ExpressionSelector label={"H2S"} expressionValueInput={form.rex_h2sInput} />
								<ExpressionSelector label={"ODOR"} expressionValueInput={form.rex_odorInput} />
								<ExpressionSelector label={"VOC"} expressionValueInput={form.rex_vocInput} />
								<ExpressionSelector label={"OU"} expressionValueInput={form.rex_ouInput} />
								<TextInput label={"min1"} id={"min1Input"} {...form.min1Input} />
								<TextInput label={"min2"} id={"min2Input"} {...form.min2Input} />
								<TextInput label={"min3"} id={"min3Input"} {...form.min3Input} />
								<TextInput label={"min4"} id={"min4Input"} {...form.min4Input} />
								<TextInput label={"min5"} id={"min5Input"} {...form.min5Input} />
								<TextInput label={"rsvtime"} id={"rsvtimeInput"} {...form.rsvtimeInput} />
								<TextInput label={"rsvproc"} id={"rsvprocInput"} {...form.rsvprocInput} />
								<TextInput label={"odorlev"} id={"odorlevInput"} {...form.odorlevInput} />
								<TextInput label={"autoproc"} id={"autoprocInput"} {...form.autoprocInput} />
							</>
						)}

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
}

function useForm(t) {
	const history = useHistory();

	const productList = useRef({});
	const [productIdList, setProductIdList] = useState([]);

	const productIdInput = useInput("");
	const idInput = useInput("");
	const companyInput = useInput("");
	const nameInput = useInput("");
	const macaddrInput = useInput("");
	const departInput = useInput("");
	const addrInput = useInput("");
	const geotextInput = useInput("");
	const latiInput = useInput("");
	const longiInput = useInput("");
	const firmwareInput = useInput("");
	const serveripInput = useInput("");
	const serverportInput = useInput("");
	const memoInput = useInput("");
	const controlInput = useInput("");
	const statusInput = useInput("on");
	const on_nh3Input = useInput("on");
	const on_h2sInput = useInput("on");
	const on_odorInput = useInput("on");
	const on_vocInput = useInput("on");
	const on_indolInput = useInput("on");
	const on_tempInput = useInput("on");
	const on_humiInput = useInput("on");
	const on_sen1Input = useInput("on");
	const on_sen2Input = useInput("on");
	const on_sen3Input = useInput("on");

	//insys
	const measectInput = useInput("");
	const meacycleInput = useInput("");
	const flushsectInput = useInput("");
	const restsectInput = useInput("");
	const multipleInput = useInput("");
	const ratioInput = useInput("");
	const constantInput = useInput("");
	const resolutionInput = useInput("");
	const deciInput = useInput("");

	//jtron
	const rex_nh3Input = useInput("0.1 * exp( 0.2 * x )");
	const rex_h2sInput = useInput("0.2* LN( x + 0.2)");
	const rex_odorInput = useInput("2.2 * 10 * 0.3 * POW( x , 0.4)");
	const rex_vocInput = useInput("2.2 * 10 * 0.3 * POW( x , 2)");
	const rex_ouInput = useInput("2.2 * 10 * 0.3 * POW( x , 2)");
	const min1Input = useInput("6");
	const min2Input = useInput("4");
	const min3Input = useInput("5");
	const min4Input = useInput("6");
	const min5Input = useInput("7");
	const rsvtimeInput = useInput("8");
	const rsvprocInput = useInput("9");
	const odorlevInput = useInput("10");
	const autoprocInput = useInput("11");

	useEffect(() => {
		if (productList.current[productIdInput.value]) {
			companyInput.setValue(productList.current[productIdInput.value].company);
		} else {
			companyInput.setValue("");
		}
	}, [productIdInput]);

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

	let onSave = async () => {
		if (!confirm(t("saveConfirmDescription"))) {
			return;
		}

		let params = {
			productid: _.trim(productIdInput.value),
			id: _.trim(idInput.value),
			company: _.trim(companyInput.value),
			name: _.trim(nameInput.value),
			macaddr: _.trim(macaddrInput.value),
			depart: _.trim(departInput.value),
			addr: _.trim(addrInput.value),
			geocode: AccountStore.getGeocodeByGeotext(geotextInput.value),
			lati: _.trim(latiInput.value),
			longi: _.trim(longiInput.value),
			firmware: _.trim(firmwareInput.value),
			serverip: _.trim(serveripInput.value),
			serverport: _.trim(serverportInput.value),
			memo: _.trim(memoInput.value),
			control: _.trim(controlInput.value),
			status: _.trim(statusInput.value),
			on_nh3: _.trim(on_nh3Input.value) == "true" ? true : false,
			on_h2s: _.trim(on_h2sInput.value) == "true" ? true : false,
			on_odor: _.trim(on_odorInput.value) == "true" ? true : false,
			on_voc: _.trim(on_vocInput.value) == "true" ? true : false,
			on_indol: _.trim(on_indolInput.value) == "true" ? true : false,
			on_temp: _.trim(on_tempInput.value) == "true" ? true : false,
			on_humi: _.trim(on_humiInput.value) == "true" ? true : false,
			on_sen1: _.trim(on_sen1Input.value) == "true" ? true : false,
			on_sen2: _.trim(on_sen2Input.value) == "true" ? true : false,
			on_sen3: _.trim(on_sen3Input.value) == "true" ? true : false,
			measect: _.trim(measectInput.value),
			meacycle: _.trim(meacycleInput.value),
			flushsect: _.trim(flushsectInput.value),
			restsect: _.trim(restsectInput.value),
			multiple: _.trim(multipleInput.value),
			ratio: _.trim(ratioInput.value),
			constant: _.trim(constantInput.value),
			resolution: _.trim(resolutionInput.value),
			deci: _.trim(deciInput.value),
			rex_nh3: _.trim(rex_nh3Input.value),
			rex_h2s: _.trim(rex_h2sInput.value),
			rex_odor: _.trim(rex_odorInput.value),
			rex_voc: _.trim(rex_vocInput.value),
			rex_ou: _.trim(rex_ouInput.value),
			min1: _.trim(min1Input.value),
			min2: _.trim(min2Input.value),
			min3: _.trim(min3Input.value),
			min4: _.trim(min4Input.value),
			min5: _.trim(min5Input.value),
			rsvtime: _.trim(rsvtimeInput.value),
			rsvproc: _.trim(rsvprocInput.value),
			odorlev: _.trim(odorlevInput.value),
			autoproc: _.trim(autoprocInput.value),
		};

		for (let key in params) {
			if (_.isNil(params[key]) && key != "id") {
				return alert(t("alertNotCorrectInput") + `(${key})`);
			}
		}

		await new DeviceStore().addDevice(params);
		await MonitorStore.getMonitorList();

		alert(t("alertRegistered"));

		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/dashboards/device");
		}
	};

	let onCancel = () => {
		if (history.length > 0) {
			history.goBack();
		} else {
			history.push("/dashboards/device");
		}
	};

	return {
		productIdList,
		productIdInput,
		idInput,
		companyInput,
		nameInput,
		macaddrInput,
		departInput,
		addrInput,
		geotextInput,
		latiInput,
		longiInput,
		firmwareInput,
		serveripInput,
		serverportInput,
		memoInput,
		controlInput,
		statusInput,
		on_nh3Input,
		on_h2sInput,
		on_odorInput,
		on_vocInput,
		on_indolInput,
		on_tempInput,
		on_humiInput,
		on_sen1Input,
		on_sen2Input,
		on_sen3Input,
		measectInput,
		meacycleInput,
		flushsectInput,
		restsectInput,
		multipleInput,
		ratioInput,
		constantInput,
		resolutionInput,
		deciInput,
		rex_nh3Input,
		rex_h2sInput,
		rex_odorInput,
		rex_vocInput,
		rex_ouInput,
		min1Input,
		min2Input,
		min3Input,
		min4Input,
		min5Input,
		rsvtimeInput,
		rsvprocInput,
		odorlevInput,
		autoprocInput,
		onSave,
		onCancel,
	};
}
