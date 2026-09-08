import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import ProductStore from "../../store/local/ProductStore";
import { HeaderMain } from "../components/HeaderMain";
import { useTranslation } from "react-i18next";
import AttribsTable from "./components/AttribsTable";
import MediaQuery from "react-responsive";

export default function ProductInfo() {
	const { t } = useTranslation();

	/**@type {{id?: string}} */
	const { id } = useParams();
	/**@type {[product: import("../../store/local/ProductStore").product, setProduct: any]} state */
	let [product, setProduct] = useState(null);
	const history = useHistory();

	useEffect(() => {
		new ProductStore().getProductInfo(id).then(({ data }) => {
			setProduct({
				id: data.id,
				name: data.name,
				regist: data.regist,
				release: data.release,
				purpose: data.purpose,
				note: data.note,
			});
		});
	}, []);

	if (!product) {
		return <></>;
	}

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("productInfoTitle")} />
			</div>

			<div className="row mb-1">
				<div className="col">
					<table className="table">
						<tbody>
							{/* <tr>
								<td>{t("manufacturer")}</td>
								<td>{product.company}</td>
							</tr> */}
							<tr>
								<td className="border-right" style={{ backgroundColor: "#edf2f7", color: "#718096" }}>
									{t("productid")}
								</td>
								<td className="pl-4">{product.id}</td>
							</tr>
							<tr>
								<td className="border-right" style={{ backgroundColor: "#edf2f7", color: "#718096" }}>
									{t("productName")}
								</td>
								<td className="pl-4">{product.name}</td>
							</tr>
							{window["mode"] == "desktop" && (
								<tr>
									<td colSpan={2}>
										<div className="row">
											<MediaQuery minWidth={769}>
												<div className="col-12 col-md-2">
													<Link to={`/product/edit/${id}`} className="btn btn-primary btn-block text-white">
														{t("editProductTitle")}
													</Link>
												</div>
											</MediaQuery>
											<MediaQuery maxWidth={768}>
												<div className="col-12 col-md-2 mb-2">
													<Link to={`/product/edit/${id}`} className="btn btn-primary btn-block text-white">
														{t("editProductTitle")}
													</Link>
												</div>
											</MediaQuery>

											<div className="col-12 col-md-2">
												<button
													type="button"
													className="btn btn-danger btn-block"
													onClick={async () => {
														if (!confirm(t("deleteConfirmDescription"))) {
															return;
														}

														await new ProductStore().removeProduct(id);
														alert(t("alertRemoved"));

														if (history.length > 0) {
															history.goBack();
														} else {
															history.push("/product");
														}
													}}
												>
													{t("removeProduct")}
												</button>
											</div>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<AttribsTable id={id} />
		</div>
	);
}
