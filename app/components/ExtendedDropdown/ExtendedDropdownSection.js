import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ExtendedDropdownSection = (props) => {
    const { children, list, className, tag, ...otherProps } = props;
    const sectionClass = classNames(
        "extended-dropdown__section", className, {
            "extended-dropdown__section--list": list
        }
    );
    const Tag = tag;

    return (
        <Tag className={ sectionClass } { ...otherProps }>
            { children }
        </Tag>
    );
};

ExtendedDropdownSection.defaultProps = {
    tag: "div"
};

export { ExtendedDropdownSection };