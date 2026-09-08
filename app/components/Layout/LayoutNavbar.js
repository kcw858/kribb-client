import React from 'react';
import PropTypes from 'prop-types';

const LayoutNavbar = (props) => {
    const navbar = React.Children.only(props.children);

    return (
        //상단 메뉴 바 색상
        <div className="layout__navbar" style={{backgroundColor: '#F7Fafc'}}> 
        {
            React.cloneElement(navbar, { fixed: null })
        }
        </div>
    );
};

LayoutNavbar.propTypes = {
    children: PropTypes.node
};
LayoutNavbar.layoutPartName = "navbar";

export {
    LayoutNavbar
};
