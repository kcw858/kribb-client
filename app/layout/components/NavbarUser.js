import React from "react";
import PropTypes from "prop-types";

import AccountStore from "../../store/global/AccountStore";
import { useTranslation } from "react-i18next";
import { result } from "lodash-es";

const NavbarUser = (props) => {
	const { t } = useTranslation();

	return	(
		<button style={{color: '#868e96'}} className="btn nav-link" onClick={() => AccountStore.setLockScreen()} >
			<i className="fa fa-sign-out" ></i><span className='ml-2'>{t("menuSignout")}</span>
		</button>
	);
};

NavbarUser.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
};

export { NavbarUser };
