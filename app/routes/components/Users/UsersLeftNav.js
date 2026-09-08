import React from 'react';

import { 
    Nav,
    NavItem,
    NavLink,
    Badge
} from './../../../components';

const UsersLeftNav = () => (
    <React.Fragment>
        { /* START Left Nav  */}
        {/* <div className="mb-4">
            <Nav pills vertical>
                <NavItem>
                    <NavLink href="#" active>
                        All Contacts
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="#">
                        Favorites
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="#">
                        Private
                    </NavLink>
                </NavItem>
            </Nav>
        </div> */}
        { /* END Left Nav  */}
        { /* START Left Nav  */}
        <div className="mb-4">
            <div className="small mb-3">
                Tags
            </div>
            <Nav pills vertical>
                {/* <NavItem>
                    <NavLink href="#" className="d-flex">
                        <i className="fa fa-fw fa-circle text-primary align-self-center mr-2"></i>
                        일반사용자
                        <Badge color="secondary" pill className="ml-auto align-self-center">
                            212
                        </Badge>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="#" className="d-flex">
                        <i className="fa fa-fw fa-circle text-info align-self-center mr-2"></i>
                        농장주
                        <Badge color="secondary" pill className="ml-auto align-self-center">
                            67
                        </Badge>
                    </NavLink>
                </NavItem> */}
                <NavItem>
                    <NavLink href="#" className="d-flex">
                        <i className="fa fa-fw fa-circle text-success align-self-center mr-2"></i>
                        일반사용자(서버단위)
                        <Badge color="secondary" pill className="ml-auto align-self-center">
                            27
                        </Badge>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="#" className="d-flex">
                        <i className="fa fa-fw fa-circle text-warning align-self-center mr-2"></i>
                        관리자(서버단위)
                        <Badge color="secondary" pill className="ml-auto align-self-center">
                            5
                        </Badge>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="#" className="d-flex">
                        <i className="fa fa-fw fa-circle text-danger align-self-center mr-2"></i>
                        전체관리자(전체서버)
                        <Badge color="secondary" pill className="ml-auto align-self-center">
                            1
                        </Badge>
                    </NavLink>
                </NavItem>
                {/* <NavItem>
                    <NavLink href="#">
                        <i className="fa fa-fw fa-plus mr-2"></i>
                        Add New Label
                    </NavLink>
                </NavItem> */}
            </Nav>
        </div>
        { /* END Left Nav  */}
    </React.Fragment>
)

export { UsersLeftNav };
