import React, { useEffect, useState } from "react";
import { setDefaultLocale } from 'react-datepicker';
import { useHistory } from "react-router";
import { CardBody,Card,Accordion,Button, ButtonGroup } from '../../../../components';
import AccountStore from '../../../../store/global/AccountStore';
import MonitorStore from '../../../../store/global/MonitorStore';
import { CSVLink } from "react-csv";

export default function DeviceCardTable() {

    let history = useHistory();
    const data = MonitorStore.monitorInfoList
    const bb = [];
    const [searchTerm, setSearchTerm] = useState("");
    const [onlineBtn, setOlineBtn] = useState("ALL");

    data.map((e)=>(bb.push(e)));

    const search = (bb.filter((note)=> note.name !== null && note.name.includes(`${searchTerm}`))).filter
        ((onBtn)=> onBtn.status !== null && onBtn.status.includes(`${onlineBtn === "ALL" ? "" : (onlineBtn === "ON" ? "on" : "off")}`));
    //const onlineB = search.filter((onBtn)=> onBtn.status !== null && onBtn.status.includes(`${onlineBtn}`));

    const deviceCards = () => {
        const result = [];
            for (let i = 0; i < search.length; i++) {
                result.push(
                    <div className='p-2' style={{width:"400px"}}>
                        <Accordion>
                            <Card>
                                <CardBody>
                                    <div>
                                        <div className='d-flex justify-content-between pb-2'>
                                            <div className='w-75' style={{height:"20px"}}>      
                                                <b><span style={{fontSize:"10pt"}}>{search[i].depart}</span></b>
                                            </div> 
                                            <div className='d-flex justify-content-between' style={{width:"110px"}}>                                
                                                <div style={{
                                                    border:`1px solid ${search[i].status === "on" ? "green" : "red"}`,
                                                    borderRadius:"30px",
                                                    width:"40px",
                                                    textAlign:"center",
                                                    }}>
                                                    {search[i].status}
                                                </div>
                                                <div style={{height:"23px", border:"1px solid black" }}>   
                                                    <Accordion.Header>
                                                        <Accordion.Indicator/>
                                                        {/* <i className={"fa fa-fw fa-chevron-down"}/> */}
                                                    </Accordion.Header>
                                                </div>
                                            </div>  
                                        </div>
                                        <Accordion.Body>
                                            <div 
                                                className='p-3' 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (AccountStore.role == "super" || AccountStore.role == "admin") {
                                                    history.push(`/dashboards/device/info/${search[i].id}`);
                                                    }}}>
                                            
                                                <div className='pb-1'>
                                                    <span>장비명 : {search[i].name}</span>
                                                </div>
                                                <div>
                                                    <span>NH3 {search[i].nh3List[0]}  H2s {search[i].h2sList[0]} CO2 {search[i].co2List[0]} VOC {search[i].vocList[0]} Indol {search[i].indolList[0]}</span>
                                                </div>
                                                <div className="hr-text pb-2"/>
                                                <div className='d-flex justify-content-between'>
                                                    <span>&uarr;</span>
                                                    <span>{search[i].windspeed}m/s</span>
                                                    <span>{search[i].temperature}℃</span>
                                                    <span>{search[i].humidity}%</span>
                                                </div>
                                                <div className="hr-text"/>
                                            </div>
                                        </Accordion.Body>
                                    </div>
                                </CardBody>
                            </Card>
                        </Accordion>
                    </div>
                )
            }
        return result
    }

	return (	
        <>
            <div>
                <div className="d-flex justify-content-end align-items-center mt-4 mb-2">
                <div>
                    <input
                        type="texy"
                        placeholder="Search"
                        onChange={(e) => {
                        setSearchTerm(e.target.value);
                        }}
                    />
                </div>
                    <ButtonGroup> 
                        <Button className="btn-cancel" size="sm" outline onClick={()=>(setOlineBtn("ALL"))} style={{ color: "#4a5568", borderRight: "1px solid #F7FAFC" }}>
                            ALL
                        </Button>
                        <Button className="btn-cancel" size="sm" outline onClick={()=>(setOlineBtn("ON"))} style={{ color: "#4a5568", borderRight: "1px solid #F7FAFC" }}>
                            ONLINE  
                        </Button>
                        <Button className="btn-cancel" size="sm" outline onClick={()=>(setOlineBtn("OFF"))} style={{ color: "#4a5568", borderRight: "1px solid #F7FAFC" }}>
                            OFFLINE
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
            
            <div className='container-fluid row pl-2 pr-2 w-auto'>
                {deviceCards()}
            </div>	
        </>
);
}