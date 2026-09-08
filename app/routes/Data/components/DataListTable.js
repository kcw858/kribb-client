import React from "react";
import PropTypes from "prop-types";
import CustomTable from "../../../components/CustomTable";
import _ from "lodash";
import { useTranslation } from 'react-i18next';

export default function DataListTable({ data }) {
	const { t } = useTranslation();

	const columns = (t, attrOptionList, attrList) => {
		let tableData = [
			{
				dataField: "name",
				text: t("deviceName"),
				align: "center",
				headerAlign: "center",
				sort: true,
			},
			{
				dataField: "date",
				text: t("hour"),
				align: "center",
				headerAlign: "center",
				sort: true,
			},
		]; 

		if( (attrList != null) || (attrList !=undefined)) {
			for (let attr of attrList) {
				tableData.push({
					dataField: attr,
					text: _.find(attrOptionList, ["value", attr]).label,
					align: "center",
					headerAlign: "center",
					sort: true,
				});
			}
		}

		return tableData;
	};
		
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col">
					<CustomTable columns={columns(t)} data={data} paginationSize={10} />
				</div>
			</div>
		</div>
	);
}

DataListTable.propTypes = {
	data: PropTypes.array,
	attrOptionList: PropTypes.array,
	attrList: PropTypes.array,
};
