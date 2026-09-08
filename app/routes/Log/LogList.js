import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { HeaderMain } from "../components/HeaderMain";
import CustomRemoteTable from "../../components/CustomTable/CustomRemoteTable";
import LogStore from "../../store/local/LogStore";
import { useTranslation } from "react-i18next";

export default observer(function LogList() {
	const { t } = useTranslation();

	let [logStore] = useState(new LogStore());

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("logListTitle")} />
			</div>

			<div className="row">
				<div className="col">
					<CustomRemoteTable
						keyField="id"
						columns={columns(t)}
						data={logStore.logList}
						page={logStore.page}
						sizePerPage={logStore.sizePerPage}
						totalSize={logStore.totalSize}
						datepicker={true}
						updateData={(params) => {
							logStore.getLogList(params);
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
		text: t("id"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "server",
		text: t("serverName"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "geocode",
		text: t("geocode"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "userid",
		text: t("userid"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "part",
		text: t("part"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "level",
		text: t("level"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "content",
		text: t("description"),
		align: "center",
		headerAlign: "center",
		sort: true,
		style: {
			maxWidth: "600px",
			overflowWrap: "break-word",
		},
	},
	{
		dataField: "times",
		text: t("timestamp"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
];
