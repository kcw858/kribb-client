// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import CoordOverlay from "./components/CoordOverlay";
import OrdorColorLegend from "./components/OdorColorLegend";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { Map, MapMarker, CustomOverlayMap, ZoomControl, MapTypeId } from "react-kakao-maps-sdk";
import AccountStore from "../../../store/global/AccountStore";
import "../../../styles/components/mapview/mapview.css";
import MediaQuery from "react-responsive";

//pig 단계별 아이콘 정의
const pig_1 = require("./../../../images/makers/pig/pig-0.png");
const pig_2 = require("./../../../images/makers/pig/pig-1.png");
const pig_3 = require("./../../../images/makers/pig/pig-2.png");
const pig_4 = require("./../../../images/makers/pig/pig-3.png");

//카카오맵
export default function MapView(props) {
	//=====================================내 위치 찾기(HTTPS필요)==============================================
	//const [gps_use,setGps_use] = useState(null);
	//const [coordsx, setCoordsx] = useState();
	//const [coordsy, setCoordsy] = useState();

	// function gps_check(){
	// 	if (navigator.geolocation) {
	// 		var options = {timeout:60000};
	// 		navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
	// 	} else {
	// 		alert("GPS_추적이 불가합니다.");
	// 		setGps_use(false);
	// 	}
	// }

	// function showLocation(position) {
	// 	setGps_use(true);
	// 	setCoordsy(position.coords.latitude);
	// 	setCoordsx(position.coords.longitude);
	// }

	// // error발생 시 에러의 종류를 알려주는 함수.
	// function errorHandler(error) {
	// 	if(error.code == 1) {
	// 		alert("http 접근이 제한되었습니다.");
	// 	} else if( err.code == 2) {
	// 		alert("위치를 반환할 수 없습니다.");
	// 	}
	// 	setGps_use(false);
	// }
	//=====================================내 위치 찾기(HTTPS필요)==============================================

	//coordsx:경도 coordsy:위도
	const [coordsx, setCoordsx] = useState();
	const [coordsy, setCoordsy] = useState();
	const [searchAddress, SetSearchAddress] = useState();
	//input값을 가져와서 경도와 위도 좌표로 바꿔준다.
	const SearchMap = () => {
		const geocoder = new kakao.maps.services.Geocoder();
		geocoder.addressSearch(`${searchAddress}`, function (result, status) {
			if (status === kakao.maps.services.Status.OK) {
				const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
				setCoordsx(coords.La);
				setCoordsy(coords.Ma);
			} else {
				alert("찾을 수 없는 주소입니다.");
			}
		});
	};
	const handleSearchAddress = (e) => {
		SetSearchAddress(e.target.value);
	};

	//계정 권한
	const role = AccountStore.role;
	//번역기능
	const { t } = useTranslation();

	const MARKER_WIDTH = 10; // 기본, 클릭 마커의 너비
	const MARKER_HEIGHT = 10; // 기본, 클릭 마커의 높이

	let positions = [];

	for (var record of props.list) {
		// 마커를 생성합니다
		let marker = {
			id: record.id,
			title: record.name,
			latlng: { lat: record.lati, lng: record.longi },
			//단계별 이미지 적용
			// src: record.nh3 < 5 ? pig_1 :
			// 		// markerInfo[i].value<10?pig_2:
			// 		record.nh3 < 20 ? pig_3 :
			// 		// markerInfo[i].value<20?pig_4:
			// 		record.nh3 < 30 ? pig_4 : pig_5
			// 5초마다 데이타 갱신되는 것을 확인하기 위해 임시로 랜덤 그림 표기
			src: Math.random() < 0.25 ? pig_1 : Math.random() < 0.5 ? pig_2 : Math.random() < 0.75 ? pig_3 : pig_4,
		};
		positions.push(marker);
	}

	let geoRecord = { lati: 35.81346488630303, longi: 127.11835443815023, level: 4 };

	try {
		let savedGeoRecord = JSON.parse(window.localStorage.getItem("geoRecord"));
		geoRecord.lati = Number(savedGeoRecord.lati || geoRecord.lati);
		geoRecord.longi = Number(savedGeoRecord.longi || geoRecord.longi);
		//전국은 멀리서보게 그 외 지역은 확대level을 11로 고정
		geoRecord.level =
			savedGeoRecord.metro == "전국"
				? Number(savedGeoRecord.measure.replace(/z/gi, "") || geoRecord.level)
				: Number(11 || geoRecord.level);
	} catch (error) {
		console.error(error);
	}

	// @ts-ignore
	window.reactHistory = useHistory();

	let center = { lat: geoRecord.lati, lng: geoRecord.longi };
	let level = geoRecord.level;

	const [newDevice, setNewDevice] = useState();
	const [draggable, setDraggable] = useState(false);
	const [bgColor, setBgColor] = useState("");
	const [textColor, setTextColor] = useState("");
	const [borderLine, setBorderLine] = useState("");
	const [scroll, setScroll] = useState(true);
	const onoff = () => {
		if (scroll) {
			setBgColor("#44a3ec");
			setTextColor("#fff");
			setBorderLine("1px solid #44a3ec");
			setScroll(!scroll);
		} else {
			setBgColor("");
			setTextColor("");
			setBorderLine("");
			setScroll(!scroll);
		}
	};
	const CustomOverlayContent = () => <CoordOverlay lat={newDevice.lat} lng={newDevice.lng} />;

	// const [map, setMap] = useState()

	// useEffect(() => {
	//   if(map) map.relayout()
	// }, [Number(window.localStorage.getItem("splitPos"))?Number(window.localStorage.getItem("splitPos")):930])

	return (
		<>
			<div>
				{/* =========주소 검색 PC화면(super계정만 보임)======== */}
				{/* <div className="ml-auto mr-0 mb-3 d-none d-lg-block">
						<div className="input-group" style={{ height: "36.39px", display: role !== "super" ? "none" : "" }}>
							<span style={{ paddingRight: "17px" }} className="pl-0 input-group-text search-geo-text">
								{t("searchGeo")}
							</span>
							<input
								className="search-geo-input bg-white form-control"
								onChange={handleSearchAddress}
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										SearchMap();
									}
								}}
							/>
							<div className="input-group-prepend">
								<button style={{ width: "50px" }} className="fa fa-search fa-fw btn-cancel search-geo-btn" onClick={SearchMap} />
							</div>
						</div>
					</div> */}
				<MediaQuery minWidth={401}>
					<div className="pc-search-box">
						<div className="mr-0 mb-3">
							<div className="input-group search-box" style={{ display: role !== "super" ? "none" : "" }}>
								<span style={{ paddingRight: "17px" }} className="pl-0 input-group-text search-geo-text">
									{t("searchGeo")}
								</span>
								<input
									className="search-geo-input bg-white form-control"
									onChange={handleSearchAddress}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											SearchMap();
										}
									}}
									style={{ maxWidth: "140px", width: "40%" }}
								/>
								<button className="fa fa-search fa-fw btn-cancel search-geo-btn mr-2" onClick={SearchMap} />
							</div>
						</div>
						<div className="ml-auto pb-3">
							<button
								style={{
									backgroundColor: bgColor,
									color: textColor,
									border: borderLine,
								}}
								onClick={() => {
									setDraggable(!draggable), onoff();
								}}
								className="btn-map-onoff"
							>
								지도 스크롤 {draggable ? "ON" : "OFF"}
							</button>
						</div>
					</div>
				</MediaQuery>
				{/* =========주소 검색 모바일 화면(super계정만 보임)======== */}
				{/* <div className="ml-auto mr-0 mb-3 d-lg-none" style={{ display: role !== "super" ? "none" : "" }}>
						<div className="input-group" style={{ height: "36.39px" }}>
							<span className="pr-2 pl-0 input-group-text search-geo-text">{t("searchGeo")}</span>
							<input onChange={handleSearchAddress} className="search-geo-input" />
							<div className="input-group-prepend">
								<button style={{ width: "40px" }} className="fa fa-search fa-fw btn-cancel search-geo-btn" onClick={SearchMap} />
							</div>
						</div>
					</div> */}
				<MediaQuery maxWidth={400}>
					<div className="col-12 mb-3 px-0" style={{ display: role !== "super" ? "none" : "" }}>
						<div className="input-group search-box">
							<span className="col-2 pr-2 pl-0 input-group-text search-geo-text">{t("searchGeo")}</span>
							<div className="col-10 px-0 d-flex justify-content-end">
								<input onChange={handleSearchAddress} className="search-geo-input" />
								<button className="fa fa-search fa-fw btn-cancel search-geo-btn" onClick={SearchMap} />
							</div>
						</div>
					</div>
					<div className="pb-3 col px-0">
						<button
							style={{
								backgroundColor: bgColor,
								color: textColor,
								border: borderLine,
							}}
							onClick={() => {
								setDraggable(!draggable), onoff();
							}}
							className="btn-map-onoff"
						>
							지도 스크롤 {draggable ? "ON" : "OFF"}
						</button>
					</div>
				</MediaQuery>
			</div>
			<div className="container-fluid map-bg">
				<div className="row mb-2">
					{/* 악취강도 범례 */}
					<div className="ml-auto mr-2 odor-color-legend" style={{ right: 7 }}>
						<OrdorColorLegend />
					</div>
					<Map
						center={center}
						level={level}
						style={{ width: "100%", height: window.innerHeight * props.hRatio }}
						onRightClick={(_t, mouseEvent) =>
							setNewDevice({
								lat: mouseEvent.latLng.getLat(),
								lng: mouseEvent.latLng.getLng(),
							})
						}
						zoomable={draggable}
						draggable={draggable}
						// onCreate={setMap}
					>
						{/* 지도 컨트롤 */}
						<MediaQuery minWidth={351}>
							<ZoomControl position={kakao.maps.ControlPosition.LEFT} />
						</MediaQuery>
						<MediaQuery maxWidth={350}>
							<ZoomControl position={kakao.maps.ControlPosition.BOTTOMLEFT} />
						</MediaQuery>

						{/* <MapTypeControl position={kakao.maps.ControlPosition.TOPRIGHT}/> */}
						{/* 지도에 지형정보를 표시하도록 지도타입을 추가합니다 */}
						<MapTypeId type={kakao.maps.MapTypeId.ROADMAP} />
						{/* 마우스 우클릭 - 지도 위치에 새로운 장비 등록창 이벤트 처리 */}
						{newDevice && (
							<CustomOverlayMap // 커스텀 오버레이를 표시할 Container
								// 커스텀 오버레이가 표시될 위치입니다
								position={newDevice}
								// 커스텀 오버레이가에 대한 확장 옵션
								xAnchor={0.3}
								yAnchor={0.91}
							>
								<CustomOverlayContent />
							</CustomOverlayMap>
						)}

						{/* 장비들의 위치에 마커 표시 */}
						{positions.map((position, index) => (
							<MapMarker
								key={`${position.title}-${position.latlng}`}
								clickable={true}
								onClick={() => {
									window.reactHistory.push("/dashboards/device/info/" + position.id);
								}}
								position={position.latlng} // 마커를 표시할 위치
								image={{
									src: position.src,
									size: {
										width: MARKER_WIDTH,
										height: MARKER_HEIGHT,
									}, // 마커이미지의 크기입니다
								}}
								title={position.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
							/>
						))}
						{/* 입력한 주소를 지도에 표시 */}
						<MapMarker
							position={{ lat: coordsy, lng: coordsx }}
							title={`위도:${coordsy}\n경도:${coordsx}`} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
							//마커를 클릭하면 해당 좌표로 장비등록
							onClick={() =>
								setNewDevice({
									lat: coordsy,
									lng: coordsx,
								})
							}
						/>
					</Map>
				</div>
			</div>
		</>
	);
}

MapView.propTypes = {
	hRatio: PropTypes.number,
	list: PropTypes.array,
};
MapView.defaultProps = {
	hRatio: 0.9,
	list: [],
};
