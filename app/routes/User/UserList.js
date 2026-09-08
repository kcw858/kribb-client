import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HeaderMain } from "../components/HeaderMain";
import CustomTable from "../../components/CustomTable";
import AccountStore from "../../store/global/AccountStore";
import UserStore from "../../store/local/UserStore";
import { useTranslation } from "react-i18next";

export default observer(function UserList() {
	const { t } = useTranslation();

	let history = useHistory();
	let [userStore] = useState(new UserStore());

	useEffect(() => {
		userStore.getUserList();
	}, []);

	return (
		<div className="container-fluid">
			<div className="row ml-0 title-mb">
				<HeaderMain title={t("userManagementTitle")} />
			</div>

			<div className="row">
				<div className="col">
					<CustomTable
						keyField={"userid"}
						columns={columns(t, AccountStore.geocodeList)}
						data={userStore.userList}
						paginationSize={10}
						onClickRow={(e, row) => {
							e.preventDefault();
							if (window["mode"] == "desktop") {
								history.push(`/user/edit/${row.userid}`);
							}
						}}
						onClickAdd={(e) => {
							e.preventDefault();
							history.push("/user/add");
						}}
					/>
				</div>
			</div>
		</div>
	);
});

// function DropdownButton({}) {
// 	let [visible, setVisible] = useState(false);

// 	return (
// 		<div className="dropdown">
// 			<button
// 				className="btn btn-secondary dropdown-toggle"
// 				type="button"
// 				id="dropdownMenuButton"
// 				data-toggle="dropdown"
// 				aria-haspopup="true"
// 				aria-expanded="false"
// 				onClick={() => setVisible(!visible)}
// 				onBlur={(() => setVisible(false))}
// 			>
// 				수정
// 			</button>
// 			<div className={`dropdown-menu ${visible ? "show" : ""}`} aria-labelledby="dropdownMenuButton">
// 				<button className="dropdown-item">비밀번호 초기화</button>
// 				<button className="dropdown-item">권한 변경</button>
// 				<button className="dropdown-item">계정 삭제</button>
// 			</div>
// 		</div>
// 	);
// }

/**
 *
 * @param {import("../../store/global/AccountStore").geocode[]} geocodeList
 */
const columns = (t, geocodeList) => [
	{
		dataField: "userid",
		text: t("userid"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "username",
		text: t("userName"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "depart",
		text: t("company"),
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
		formatter: function format(cell) {
			let record = _.find(geocodeList, ["id", cell]);
			if (!record) {
				return "";
			} else {
				if (`${record.metro}` === `${record.name}`) {
					return `${record.metro}`;
				} else {
					return `${record.metro} ${record.name}`;
				}
			}
		},
	},
	{
		dataField: "position",
		text: t("position"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "email",
		text: t("email"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "phone",
		text: t("phoneNumber"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	{
		dataField: "role",
		text: t("rank"),
		align: "center",
		headerAlign: "center",
		sort: true,
	},
	// ,{
	// 	dataField: "action",
	// 	text: "action",
	// 	align: "center",
	// 	headerAlign: "center",
	// 	formatter: () => {
	// 		return <DropdownButton />;
	// 	},
	// },
];
