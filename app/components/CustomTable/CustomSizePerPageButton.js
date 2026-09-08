import React from "react";
import PropTypes from "prop-types";
import { map } from "lodash";
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "..";

export const CustomSizePerPageButton = ({ options, currSizePerPage, onSizePerPageChange, ...ddProps }) => {
	return (
		<UncontrolledButtonDropdown {...ddProps}>
			<DropdownToggle size="sm" color="link" className="text-decoration-none dashboardText">
				{currSizePerPage}
				<i className="fa fa-angle-down ml-2" />
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem header>Page Size</DropdownItem>
				{map(options, (option) => (
					<DropdownItem
						key={"option_" + option.text}
						onClick={() => onSizePerPageChange(option.page)}
						active={option.page === currSizePerPage}
					>
						{option.text}
					</DropdownItem>
				))}
			</DropdownMenu>
		</UncontrolledButtonDropdown>
	);
};
