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
	/**@type {{id?: string}} */
	const { id } = useParams();

	const { t } = useTranslation();
	const form = useForm(t);

	useEffect(() => {
		new DeviceStore().getDeviceInfo(id).then(({ data }) => {
			form.productIdInput.setValue(data.productid || "");
			form.idInput.setValue(data.id || "");
			form.companyInput.setValue(data.company || "");
			form.nameInput.setValue(data.name || "");
			form.macaddrInput.setValue(data.macaddr || "");
			form.departInput.setValue(data.depart || "");
			form.addrInput.setValue(data.addr || "");
			form.geotextInput.setValue(AccountStore.getGeotextBygeocode(data.geocode));
			form.latiInput.setValue(data.lati || "");
			form.longiInput.setValue(data.longi || "");
			form.firmwareInput.setValue(data.firmware || "");
			form.serveripInput.setValue(data.serverip || "");
			form.serverportInput.setValue(data.serverport || "");
			form.memoInput.setValue(data.memo || "");
			form.controlInput.setValue(data.control || "");
			form.statusInput.setValue(data.status || "");
			form.on_nh3Input.setValue(data.on_nh3?.toString() || "");
			form.on_h2sInput.setValue(data.on_h2s?.toString() || "");
			form.on_odorInput.setValue(data.on_odor?.toString() || "");
			form.on_vocInput.setValue(data.on_voc?.toString() || "");
			form.on_indolInput.setValue(data.on_indol?.toString() || "");
			form.on_tempInput.setValue(data.on_temp?.toString() || "");
			form.on_humiInput.setValue(data.on_humi?.toString() || "");
			form.on_sen1Input.setValue(data.on_sen1?.toString() || "");
			form.on_sen2Input.setValue(data.on_sen2?.toString() || "");
			form.on_sen3Input.setValue(data.on_sen3?.toString() || "");
			// 다음의 4가지 항목 measect, meacycle, flushsect, restsect는 제어항목(장비정보에서 장비설정)으로 이전함
			// form.measectInput.setValue(data.measect || "");
			// form.meacycleInput.setValue(data.meacycle || "");
			// form.flushsectInput.setValue(data.flushsect || "");
			// form.restsectInput.setValue(data.restsect || "");
			form.multipleInput.setValue(data.multiple || "");
			form.ratioInput.setValue(data.ratio || "");
			form.constantInput.setValue(data.constant || "");
			form.resolutionInput.setValue(data.resolution || "");
			form.deciInput.setValue(data.deci || "");
			form.rex_nh3Input.setValue(data.rex_nh3 || "");
			form.rex_h2sInput.setValue(data.rex_h2s || "");
			form.rex_odorInput.setValue(data.rex_odor || "");
			form.rex_vocInput.setValue(data.rex_voc || "");
			form.rex_ouInput.setValue(data.rex_ou || "");
			form.min1Input.setValue(data.min1 || "");
			form.min2Input.setValue(data.min2 || "");
			form.min3Input.setValue(data.min3 || "");
			form.min4Input.setValue(data.min4 || "");
			form.min5Input.setValue(data.min5 || "");
			form.rsvtimeInput.setValue(data.rsvtime || "");
			form.rsvprocInput.setValue(data.rsvproc || "");
			form.odorlevInput.setValue(data.odorlev || "");
			form.autoprocInput.setValue(data.autoproc || "");
		});
	}, []);

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("editDevice")} />
			</div>

			<div className="card">
				<div className="card-body">
					<form>
						<SelectInput label={t("productid")} id={"productIdInput"} valueList={form.productIdList} {...form.productIdInput} />
						<TextInput label={t("deviceid")} id={"idInput"} {...form.idInput} />
						<span style={{ color: "#4a5568" }}>
							<SelectInput
								label={t("manufacturer")}
								id={"companyInput"}
								valueList={["insys", "jtron"]}
								{...form.companyInput}
								disabled={true}
							/>
						</span>
						<TextInput label={t("deviceName")} id={"nameInput"} {...form.nameInput} />
						<TextInput label={t("macAddress")} id={"macaddrInput"} {...form.macaddrInput} />
						<TextInput label={t("proprietor")} id={"departInput"} {...form.departInput} />
						<TextInput label={t("emplacement")} id={"addrInput"} {...form.addrInput} />
						<SelectInput
							label={t("geocode")}
							id={"geotextInput"}
							valueList={AccountStore.getGeotextList()}
							{...form.geotextInput}
						/>
						<TextInput label={t("latitude")} id={"latiInput"} {...form.latiInput} />
						<TextInput label={t("longitude")} id={"longiInput"} {...form.longiInput} />
						<TextInput label={"Firmware"} id={"firmwareInput"} {...form.firmwareInput} />
						<TextInput label={t("serverIP")} id={"serveripInput"} {...form.serveripInput} />
						<TextInput label={t("serverPort")} id={"serverportInput"} {...form.serverportInput} />
						<TextInput label={t("memo")} id={"memoInput"} {...form.memoInput} />
						<TextInput label={t("controlDevice")} id={"controlInput"} {...form.controlInput} />
						<span style={{ color: "#4a5568" }}>
							<SelectInput
								label={t("status")}
								id={"statusInput"}
								valueList={["on", "off"]}
								{...form.statusInput}
								disabled={true}
							/>
						</span>
						<SelectInput label={"on_nh3"} id={"on_nh3Input"} valueList={["true", "false"]} {...form.on_nh3Input} />
						<SelectInput label={"on_h2s"} id={"on_h2sInput"} valueList={["true", "false"]} {...form.on_h2sInput} />
						<SelectInput label={"on_odor"} id={"on_odorInput"} valueList={["true", "false"]} {...form.on_odorInput} />
						<SelectInput label={"on_voc"} id={"on_vocInput"} valueList={["true", "false"]} {...form.on_vocInput} />
						<SelectInput label={"on_indol"} id={"on_indolInput"} valueList={["true", "false"]} {...form.on_indolInput} />
						<SelectInput label={"on_temp"} id={"on_tempInput"} valueList={["true", "false"]} {...form.on_tempInput} />
						<SelectInput label={"on_humi"} id={"on_humiInput"} valueList={["true", "false"]} {...form.on_humiInput} />
						<SelectInput label={"on_sen1"} id={"on_sen1Input"} valueList={["true", "false"]} {...form.on_sen1Input} />
						<SelectInput label={"on_sen2"} id={"on_sen2Input"} valueList={["true", "false"]} {...form.on_sen2Input} />
						<SelectInput label={"on_sen3"} id={"on_sen3Input"} valueList={["true", "false"]} {...form.on_sen3Input} />

						{form.companyInput.value == "insys" && (
							<>
								{/* // 다음의 4가지 항목 measect, meacycle, flushsect, restsect는 제어항목(장비정보에서 장비설정)으로 이전함
								<TextInput label={"measect"} id={"measectInput"} {...form.measectInput} />
								<TextInput label={"meacycle"} id={"meacycleInput"} {...form.meacycleInput} />
								<TextInput label={"flushsect"} id={"flushsectInput"} {...form.flushsectInput} />
								<TextInput label={"restsect"} id={"restsectInput"} {...form.restsectInput} /> */}
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
	// 다음의 4가지 항목 measect, meacycle, flushsect, restsect는 제어항목(장비정보에서 장비설정)으로 이전함
	// const measectInput = useInput("");
	// const meacycleInput = useInput("");
	// const flushsectInput = useInput("");
	// const restsectInput = useInput("");
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
			// 다음의 4가지 항목 measect, meacycle, flushsect, restsect는 제어항목(장비정보에서 장비설정)으로 이전함
			// measect: _.trim(measectInput.value),
			// meacycle: _.trim(meacycleInput.value),
			// flushsect: _.trim(flushsectInput.value),
			// restsect: _.trim(restsectInput.value),
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

		await new DeviceStore().editDevice(params);
		await MonitorStore.getMonitorList();

		alert(t("alertModified"));

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
		// 다음의 4가지 항목 measect, meacycle, flushsect, restsect는 제어항목(장비정보에서 장비설정)으로 이전함
		// measectInput,
		// meacycleInput,
		// flushsectInput,
		// restsectInput,
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
