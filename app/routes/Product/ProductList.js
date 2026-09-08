import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HeaderMain } from "../components/HeaderMain";
import CustomTable from "../../components/CustomTable";
import ProductStore from "../../store/local/ProductStore";
import { useTranslation } from "react-i18next";

export default observer(function ProductList() {
	const { t } = useTranslation();

	let history = useHistory();
	let [productStore] = useState(new ProductStore());

	useEffect(() => {
		productStore.getProductList();
	}, []);

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("productListTitle")} />
			</div>

			<div className="row">
				<div className="col">
					<CustomTable
						keyField={"id"}
						columns={columns(t)}
						data={productStore.productList}
						paginationSize={10}
						onClickRow={(e, row) => {
							e.preventDefault();
							history.push(`/product/info/${row.id}`);
						}}
						onClickAdd={(e) => {
							e.preventDefault();
							history.push("/product/add");
						}}
					/>
				</div>
			</div>
		</div>
	);
});

const columns = (t) => [
	{
		// 제작사에 해당하는 것이 회사이름 company 임.
		dataField: "company",
		text: t("manufacturer"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "id",
		text: t("productid"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "name",
		text: t("productName"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "regist",
		text: t("registeredDate"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "release",
		text: t("releasedDate"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "purpose",
		text: t("purpose"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "note",
		text: t("note"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
];
