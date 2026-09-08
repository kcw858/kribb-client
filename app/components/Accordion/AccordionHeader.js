import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CardHeader from './../CardHeader';

import { Consumer } from './context';
import classes from './AccordionHeader.scss';

export const AccordionHeader = (props) => (
        <Consumer>
        {
            ({ onToggle }) => (          
                <CardHeader
                    className={
                        classNames(
                            props.className,
                            classes.header
                        )
                    }
                    style={{ paddingLeft: "10px", paddingRight: "10px", height:"20px", paddingTop:"0px"}}
                    onClick={ onToggle}
                >
                    { props.children }
                </CardHeader>
            )   
        }
        </Consumer>
);
AccordionHeader.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string
};
