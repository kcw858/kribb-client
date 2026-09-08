/* eslint-disable react/prop-types */
import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import PropTypes, { any } from "prop-types";

import { Button, ButtonGroup } from "..";
import { CustomSearch } from "./CustomSearch";
import { CustomPaginationPanel } from "./CustomPaginationPanel";
import { CustomSizePerPageButton } from "./CustomSizePerPageButton";
import { withTranslation } from "react-i18next";

const sortCaret = (order) => {
	if (!order) return <i className="fa fa-fw fa-sort text-muted"></i>;
	if (order) return <i className={`fa fa-fw text-muted fa-sort-${order}`}></i>;
};

class I18NCustomTable extends React.Component {
	static propTypes = {
		keyField: PropTypes.string,
		columns: PropTypes.array,
		data: PropTypes.array,
		paginationSize: PropTypes.number,
		onClickAdd: PropTypes.func,
		onClickRow: PropTypes.func,
	};

	render() {
		const { t } = this.props;

		let { keyField, columns, data, paginationSize, onClickRow, onClickAdd,onLine } = this.props;
		onClickRow = onClickRow || (() => {});
		for (let record of columns) {
			if (record.sort) {
				record.sortCaret = sortCaret;
			}
		}
		const paginationDef = paginationFactory({
			paginationSize: Number(paginationSize),
			showTotal: true,
			pageListRenderer: (props) => (
				<CustomPaginationPanel {...props} size="sm" className="ml-md-auto mt-2 mt-md-0 dashboardText" />
			),
			// @ts-ignore
			sizePerPageRenderer: (props) => <CustomSizePerPageButton {...props} />,
			paginationTotalRenderer: (from, to, size) => (
				<span className="small ml-2 dashboardText" id="total">
					{/* showing {from} to {to} of {size} Results */}
					{t("total")} {size} {t("num")}
				</span>
			),
		});

		return (
			<div className="row justify-content-center">
				<div className="col">
					<ToolkitProvider keyField={keyField || "id"} data={data} columns={columns} search exportCSV>
						{(props) => (
							<React.Fragment>
								<div className="d-flex justify-content-end align-items-center mt-4 mb-2">
									<div className="d-flex ml-auto">
										
										<CustomSearch className="mr-2" {...props.searchProps} />
										{window["mode"] == "desktop" && (
											<>
												<ButtonGroup>
													{onClickAdd ? (
														<Button
															size="sm"
															outline
															onClick={onClickAdd}
															style={{ color: "#4a5568", borderRight: "1px solid #F7FAFC" }}
															className="btn-cancel"
														>
															<i className="fa fa-fw fa-plus" style={{ color: "#4a5568" }}></i>
															&nbsp;{t("add")}
														</Button>
													) : (
														""
													)}
													
													<Button
														size="sm"
														outline={true}
														onClick={() => {
															props.csvProps.onExport();
														}}
														style={{ color: "#4a5568" }}
														className="btn-cancel btn-cancel-white-border"
													>
														CSV {t("save")}
													</Button>
												</ButtonGroup>
											</>
										)}
									</div>
								</div>
								<div>
									<BootstrapTable
										// classes="table-responsive-lg"
										// headerClasses="thead-dark"
										rowEvents={{
											onClick: onClickRow,
										}}
										rowStyle= {onLine? onLine : {color:"#4a5568"}}
										// classes="table-responsive"					
										pagination={paginationDef}
										// @ts-ignore
										bordered={false}
										{...props.baseProps}
									/>
								</div>
							</React.Fragment>
						)}
					</ToolkitProvider>
				</div>
			</div>
		);
	}
}

export const CustomTable = withTranslation()(I18NCustomTable);
