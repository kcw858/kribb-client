import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HeaderMain } from "../components/HeaderMain";
import CustomTable from "../../components/CustomTable";
import AlertConfigStore from "../../store/local/AlertConfigStore";
import { useTranslation } from "react-i18next";

export default observer(function AlertConfigList() {
	const { t } = useTranslation();

	const history = useHistory();

	let [alertConfigStore] = useState(new AlertConfigStore());

	useEffect(() => {
		alertConfigStore.getAlertConfigList();
	}, []);
	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("alertConfigTitle")} />
			</div>

			<div className="row">
				<div className="col">
					<CustomTable
						keyField="idx"
						columns={columns(t)}
						data={alertConfigStore.alertConfigList}
						paginationSize={10}
						onClickRow={(e, /** @type {import("../../store/local/AlertConfigStore").alertConfig} row */ row) => {
							e.preventDefault();
							history.push(`/alert/config/edit/${row.id}`);
						}}
						onClickAdd={(e) => {
							e.preventDefault();
							history.push("/alert/config/add");
						}}
					/>
				</div>
			</div>
		</div>
	);
});

const columns = (t) => [
	{
		dataField: "id",
		text: "ID",
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "part",
		text: t("geocode"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "name",
		text: t("productid"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "type",
		text: t("alertType"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "warn",
		text: t("warningValue"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "err",
		text: t("dangerValue"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "setup",
		text: t("status"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
];
