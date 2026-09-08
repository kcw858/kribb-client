import React from 'react';
import Lock from '../../Auth/Lock';
import {
    Button,
    Sidebar,
    UncontrolledPopover,
    PopoverBody
} from './../../../components';

import { FooterAuth } from '../Pages/FooterAuth';
import { FooterText } from '../FooterText';
import { VersionSelector } from '../VersionSelector';

import AccountStore from "../../../store/global/AccountStore";
import { SidebarMenu, SidebarMenuItem } from "./../../../components";
import { useTranslation } from "react-i18next";

const SidebarBottomA = () => {
    const { t } = useTranslation();

    const goout  = require('./../../../images/sideIcons/goout.png');
    
    return (
    <React.Fragment>
        {/* 사이드바 하단 영역 */}
        <div style={{height: '100px'}}>

        </div>
        <div onClick={() => AccountStore.setLockScreen()}>
            <SidebarMenu>
                <SidebarMenuItem icon={<i><img src={goout} alt="나가기" /></i>} title={t("menuSignout")} />
            </SidebarMenu>
        </div>
        
        { /* START Desktop */ }
        {/* <Sidebar.HideSlim > */}          
            {/* <Sidebar.Section className="pb-0">
                <VersionSelector sidebar dashboard="Airframe" />
            </Sidebar.Section>
            <Sidebar.Section>
                <FooterAuth className="text-muted" />
            </Sidebar.Section> */}
        {/* </Sidebar.HideSlim> */}
        { /* END Desktop */ }

        { /* START Slim Only */ }
        {/* <Sidebar.ShowSlim > */}
            {/* <Sidebar.Section className="text-center" > */}
                { /* Slim Version Selector */ }
                {/* <VersionSelector
                    dashboard="Airframe"
                    sidebar
                    compact
                    render={() => (
                        <i className="fa fa-fw fa-toggle-on"></i>
                    )}
                /> */}

                { /* Footer Text as Tooltip */ }
                {/* <Button
                    id="UncontrolledSidebarPopoverFooter"
                    color="link"
                    className="sidebar__link p-0 mt-3"
                >
                    <i className="fa fa-fw fa-question-circle-o"></i>
                </Button>
                <UncontrolledPopover placement="left-end" target="UncontrolledSidebarPopoverFooter">
                    <PopoverBody>
                        <FooterText />
                    </PopoverBody>
                </UncontrolledPopover> */}
            {/* </Sidebar.Section> */}
        {/* </Sidebar.ShowSlim> */}
        { /* END Slim Only */ }
    </React.Fragment>
)};

export { SidebarBottomA };
