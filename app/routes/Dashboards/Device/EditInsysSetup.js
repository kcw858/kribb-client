/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { HeaderMain } from "../../components/HeaderMain";
import { TextInput, useInput } from "../../../components/Form";
import { observer } from "mobx-react-lite";
// import MonitorStore from "../../../store/global/MonitorStore";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import DeviceStore from "../../../store/local/DeviceStore";
import AccountStore from "../../../store/global/AccountStore";
import WsApi from "../../../store/wsApi";
import { useTranslation } from "react-i18next";

function EditInsysSetup({ id, measure, flush, rest, cycle, close }) {
	const { t } = useTranslation();
	const [deviceInfo, setDeviceInfo] = useState(null);
	const deviceStore = new DeviceStore();
	const measectInput = useInput(measure);
	const flushsectInput = useInput(flush);
	const restsectInput = useInput(rest);
	const meacycleInput = useInput(cycle);

	useEffect(() => {
		const init = async () => {
			let response = await deviceStore.getDeviceInfo(id);
			setDeviceInfo(response.data);
		};

		init();
	}, [id]);

	let onSave = async () => {
		WsApi.setup(AccountStore.userid, id, measectInput.value, flushsectInput.value, restsectInput.value, meacycleInput.value);
		// await deviceStore.editDevice({ ...deviceInfo, autoproc: autoprocInput.value });
		// await MonitorStore.getMonitorList();
		close();
	};

	let onCancel = () => {
		close();
	};

	if (!deviceInfo) {
		return <></>;
	}

	return (
		<Modal show={true}>
			<Modal.Body style={{ backgroundColor: "#F9FAFC" }}>
				<div className="container-fluid">
					<div className="row ml-0 title-mb">
						<HeaderMain title={t("setup")} />
					</div>

					<div className="card">
						<div className="card-body">
							<form>
								<TextInput
									key={"measect"}
									label={t("insideTime")}
									labelWidth={6}
									id={"measectInput"}
									{...measectInput}
									disabled={false}
								/>
								<TextInput
									key={"flushsect"}
									label={t("outsideTime")}
									labelWidth={6}
									id={"flushsectInput"}
									{...flushsectInput}
									disabled={false}
								/>
								<TextInput
									key={"restsect"}
									label={t("restTime")}
									labelWidth={6}
									id={"restsectInput"}
									{...restsectInput}
									disabled={false}
								/>
								<TextInput
									key={"meacycle"}
									label={t("dataInterval")}
									labelWidth={6}
									id={"meacycleInput"}
									{...meacycleInput}
									disabled={false}
								/>

								<div className="row">
									<div className="col-12 col-md-4  mb-md-0 mb-2 offset-md-4">
										<button type="button" className="btn btn-primary btn-block" onClick={onSave}>
											{t("edit")}
										</button>
									</div>

									<div className="col-12 col-md-4  mb-md-0 mb-2">
										<button type="button" className="btn btn-outline-secondary btn-block" onClick={onCancel}>
											{t("cancel")}
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
}

EditInsysSetup.propTypes = {
	id: PropTypes.string,
	close: PropTypes.func,
};

export default observer(EditInsysSetup);
