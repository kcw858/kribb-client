/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { HeaderMain } from "../../components/HeaderMain";
import { TextInput, useInput } from "../../../components/Form";
import { observer } from "mobx-react-lite";
import MonitorStore from "../../../store/global/MonitorStore";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import DeviceStore from "../../../store/local/DeviceStore";
import AccountStore from "../../../store/global/AccountStore";
import WsApi from "../../../store/wsApi";
import { useTranslation } from "react-i18next";

function EditCapture({ id, value, close }) {
	const { t } = useTranslation();
	const [deviceInfo, setDeviceInfo] = useState(null);
	const deviceStore = new DeviceStore();
	const autoprocInput = useInput(value);

	useEffect(() => {
		const init = async () => {
			let response = await deviceStore.getDeviceInfo(id);
			setDeviceInfo(response.data);
		};

		init();
	}, [id]);

	let onSave = async () => {
		WsApi.autoSampleLv(AccountStore.userid, id, autoprocInput.value);
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
			<Modal.Body style={{ backgroundColor: "#3c3c3c" }}>
				<div className="container-fluid">
					<div className="row ml-0 title-mb">
						<HeaderMain title={t("autoCapture")} />
					</div>

					<div className="card">
						<div className="card-body">
							<form>
								<TextInput
									key={"autoproc"}
									label={t("ordor")}
									labelWidth={4}
									id={"autoprocInput"}
									{...autoprocInput}
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

EditCapture.propTypes = {
	id: PropTypes.string,
	close: PropTypes.func,
};

export default observer(EditCapture);
