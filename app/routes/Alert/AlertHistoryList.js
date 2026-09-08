import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { HeaderMain } from "../components/HeaderMain";
import CustomRemoteTable from "../../components/CustomTable/CustomRemoteTable";
import AlertHistoryStore from "../../store/local/AlertHistoryStore";
import { useTranslation } from "react-i18next";

export default observer(function AlertList() {
	const { t } = useTranslation();

	let [alertHistoryStore] = useState(new AlertHistoryStore());

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("alertListTitle")} />
			</div>

			<div className="row">
				<div className="col">
					<CustomRemoteTable
						keyField="id"
						columns={columns(t)}
						data={alertHistoryStore.alertHistoryList}
						page={alertHistoryStore.page}
						sizePerPage={alertHistoryStore.sizePerPage}
						totalSize={alertHistoryStore.totalSize}
						datepicker={true}
						updateData={(params) => {
							alertHistoryStore.getAlertHistoryList(params);
						}}
					/>
				</div>
			</div>
		</div>
	);
});

const columns = (t) => [
	{ dataField: "id", text: t("index"), align: "center", headerAlign: "center", sort: true },
	{
		dataField: "type",
		text: t("type"),
		align: "left",
		headerAlign: "center",
		style: {
			width: 100,
		},
		sort: true,
		formatter: function format(cell) {
			switch (cell) {
				case "warn":
					return (
						<>
							<i className="fa fa-fw fa-warning text-warning"></i> Warning
						</>
					);
				case "error":
					return (
						<>
							<i className="fa fa-fw fa-warning text-danger"></i> Error
						</>
					);
				case "fatal":
					return (
						<>
							<i className="fa fa-fw fa-ban text-danger"></i> Fatal
						</>
					);
				default:
					return <>{cell}</>;
			}
		},
	},
	{ dataField: "name", text: t("deviceName"), align: "center", headerAlign: "center", sort: true },
	{ dataField: "kind", text: t("alertType"), align: "center", headerAlign: "center", sort: true },
	{ dataField: "content", text: t("description"), align: "center", headerAlign: "center", sort: true },
	{ dataField: "value", text: t("value"), align: "center", headerAlign: "center", sort: true },
	{ dataField: "times", text: t("timestamp"), align: "center", headerAlign: "center", sort: true },
	// {
	// 	dataField: "status",
	// 	text: t("resolvedStatus"),
	// 	align: "center",
	// 	headerAlign: "center",
	// 	sort: true,
	// },
];
