import { observer } from "mobx-react-lite";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import MonitorStore from '../../../store/global/MonitorStore';
import "../../../styles/components/dashboards/dashboards.css";

export default observer(function DeviceDateList() {
	const data = MonitorStore.monitorInfoList.map((e)=>(e));
    const nowTime = moment(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [pass,setPass] = useState("");
    const [enter,setEnter] = useState(""); 

    const superpass = (e) =>
    {
        setPass(e.target.value);
    } 

    const enterList = () =>
    {
        if(pass !== "dldpsxl")
        {
            alert("비밀번호가 올바르지 않습니다.");
            return;
        }
        setEnter(pass);
    } 

    const table = () =>{
        return(
            enter !==  "dldpsxl"? 
                <div className='d-flex'>
                    <div className='pr-2 pt-1'>비밀번호</div>
                    <input 
                        type={'password'}
                        onChange={superpass} 
                        onKeyPress={(e) => {
								if (e.key === "Enter") {
									enterList();
								}
							}}/>
                    <div className='pl-2'>
                        <button style={{ width: "50px", height:"30px" }} onClick={enterList}>Enter</button>
                    </div>
                </div>
            :
            <>
                <div><span>※ 초록: 60분 이내 데이터</span></div>
                <div><span>※ 파랑: 24시간 이내 데이터</span></div>
                <div><span>※ 빨강: 1개월 이내 데이터 </span></div>
                <br/>
                <div><span>※ 1개월동안 데이터가 들어오지 않은 장비는 표시 X</span></div>
                <br/>
                <table className='table-bordered w-100'>
                    <tr>
                        <th style={{height:"50px", fontSize:"16pt", textAlign:"center"}}>소속</th>
                        <th style={{height:"50px", fontSize:"16pt", textAlign:"center"}}>장비명</th>
                        <th style={{height:"50px", fontSize:"16pt", textAlign:"center"}}>마지막 들어온 데이터 경과</th>
                    </tr>
                    {data.map((e)=>(
                            <tr>
                                {/* 현재시각과 마지막 들어온 데이터 시간의 차이가 60분일 경우 붉은색 처리 */}
                                <td style={{
                                    color:moment.duration(nowTime.diff(e.sensingDt)).asMinutes() < 60 && "green",
                                    display: moment.duration(nowTime.diff(e.sensingDt)).asDays() > 30 && "none"}}
                                >
                                    {e.depart}
                                </td>
                                <td style={{
                                    display: moment.duration(nowTime.diff(e.sensingDt)).asDays() > 30 && "none"}}
                                >
                                    {e.name}
                                </td>
                                <td style={{
                                    display: moment.duration(nowTime.diff(e.sensingDt)).asDays() > 30 && "none"}}
                                >
                                    {Math.floor(moment.duration(nowTime.diff(e.sensingDt)).asMinutes()) < 60 ?
                                        (<span style={{color:"green", fontWeight:600}}>
                                            {Math.floor(moment.duration(nowTime.diff(e.sensingDt)).asMinutes())}분
                                        </span>) :
                                            (Math.floor(moment.duration(nowTime.diff(e.sensingDt)).asHours()) < 24 ? 
                                                (<span style={{color:"blue", fontWeight:600}}>
                                                    {Math.floor(moment.duration(nowTime.diff(e.sensingDt)).asHours())}시간
                                                </span>) :
                                                    (<span style={{color:"red", fontWeight:600}}>
                                                        {Math.floor(moment.duration(nowTime.diff(e.sensingDt)).asDays())}일
                                                    </span>))}</td>
                            </tr>
                    ))}
                </table>
                <table className='table-bordered w-100'>
                    <tr>
                        <th style={{height:"50px", fontSize:"16pt", textAlign:"center"}}>MAC주소</th>
                        <th style={{height:"50px", fontSize:"16pt", textAlign:"center"}}>장비명</th>
                        <th style={{height:"50px", fontSize:"16pt", textAlign:"center"}}>소속</th>
                    </tr>
                    {data.map((e)=>(
                        <tr>
                            <td>{e.id}</td>
                            <td>{e.name}</td>
                            <td>{e.depart}</td>
                        </tr>
                    ))}
                </table> 
            </>
        )
    }

	return (
		<div className="container-fluid">
           {table()}
		</div>
	);
});
