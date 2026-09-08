import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import CustomTable from "../../../components/CustomTable";
import AccountStore from "../../../store/global/AccountStore";
import AttribsStore from "../../../store/local/AttribsStore";

// eslint-disable-next-line react/prop-types
export default function SensorTable({ id }) {
	const history = useHistory();

	/**@type [attrList: Array<import("../../../store/local/AttribsStore").attribs>, setAttrList: any] state */
	let [attrList, setAttrList] = useState(null);

	useEffect(() => {
		new AttribsStore().getAttribsList(id).then(({ data }) => setAttrList(data));
	}, []);

	if (!attrList) {
		return <></>;
	}

	return (
		<div className="row">
			<div className="col">
				<CustomTable
					keyField="id"
					columns={columns}
					data={attrList}
					paginationSize={10}
					onClickRow={(e, /** @type {import("../../../store/local/AttribsStore").attribs} row */ row) => {
						e.preventDefault();
						if (AccountStore.role == "super" || AccountStore.role == "admin") {
							history.push(`/product/${id}/edit/${row.id}`);
						}
					}}
					onClickAdd={(e) => {
						e.preventDefault();
						if (AccountStore.role == "super" || AccountStore.role == "admin") {
							history.push(`/product/${id}/add`);
						}
					}}
				/>
			</div>
		</div>
	);
}

const columns = [
	{ dataField: "id", text: "ID", align: "center", headerAlign: "center", sort: true },
	// { dataField: "productid", text: "productid", align: "center", headerAlign: "center", sort: true },
	{ dataField: "type", text: "TYPE", align: "center", headerAlign: "center", sort: true },
	{ dataField: "alias", text: "ALIAS", align: "center", headerAlign: "center", sort: true },
	{ dataField: "name", text: "NAME", align: "center", headerAlign: "center", sort: true },
	{ dataField: "onoff", text: "ON/OFF", align: "center", headerAlign: "center", sort: true },
	{ dataField: "label", text: "LABEL", align: "center", headerAlign: "center", sort: true },
	{ dataField: "spec", text: "SPEC", align: "center", headerAlign: "center", sort: true },
	{ dataField: "chemiunit", text: "CHEMIUNIT", align: "center", headerAlign: "center", sort: true },
	{ dataField: "threshold", text: "THRESHOLD", align: "center", headerAlign: "center", sort: true },
	{ dataField: "min", text: "MIN", align: "center", headerAlign: "center", sort: true },
	{ dataField: "max", text: "MAX", align: "center", headerAlign: "center", sort: true },
	{ dataField: "elecunit", text: "ELECUNIT", align: "center", headerAlign: "center", sort: true },
	{ dataField: "note", text: "NOTE", align: "center", headerAlign: "center", sort: true },
];
