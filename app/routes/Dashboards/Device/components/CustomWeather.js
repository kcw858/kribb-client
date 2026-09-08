/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { WiCloudyGusts, WiHumidity, WiThermometer } from "weather-icons-react";
import Arrow from "@elsdoerfer/react-arrow";
import { degreeToDirection } from "../../../../utilities";
import MediaQuery from "react-responsive";
export default function CustomWeather({ temperature, humidity, windDegree, windSpeed }) {
	let windDirection = degreeToDirection(windDegree);

	return (
		<div className="row align-items-center">
			<MediaQuery minWidth={405}>
				<div className="card my-4" style={{ minWidth: "100%", maxWidth: "370px", borderRadius: "0.3rem" }}>
					<div className="card-body d-flex justify-content-center" style={{ padding: "5px" }}>
						<div className="d-flex justify-content-between align-items-center">
							{/* <WeatherIcon>
							<WiThermometer size={40} />
						</WeatherIcon> */}
							<div id="weather" style={{ fontSize: 19 }} className="my-2 ml-3 fw-600">
								<span style={{ color: "#44a3ec" }}>{temperature}</span>
								<span style={{ fontSize: 17, fontWeight: 600, color: "#A0Aec0" }}> ℃</span>
							</div>
						</div>
						<div className="d-flex justify-content-between align-items-center">
							{/* <WeatherIcon>
							<WiHumidity size={40} />
						</WeatherIcon> */}
							<div id="weather" style={{ fontSize: 19 }} className="my-2 fw-600">
								<span style={{ color: "#44a3ec" }}>{humidity}</span>
								<span style={{ fontSize: 17, fontWeight: 700, color: "#A0Aec0" }}> %</span>
							</div>
						</div>
						<div className="d-flex justify-content-between align-items-center">
							{/* <WeatherIcon>
							<WiCloudyGusts size={40} />
						</WeatherIcon> */}
							<div id="weather" style={{ fontSize: 19 }} className="my-2 fw-600">
								<span style={{ color: "#44a3ec" }}>{windSpeed}</span>
								<span style={{ fontSize: 17, color: "#A0Aec0" }}> m/s</span>
							</div>
						</div>
						<div className="d-flex justify-content-between align-items-center">
							{/* <WeatherIcon windDegree={windDegree}>
						</WeatherIcon> */}
							<div style={{ fontSize: 19, color: "#44a3ec" }} className="my-2 mr-2">
								<i className="fa fa-fw fa-long-arrow-up" />
							</div>
						</div>
					</div>
				</div>
			</MediaQuery>
			<MediaQuery maxWidth={404}>
				<div className="card mb-4" style={{ minWidth: "100%", maxWidth: "250px", borderRadius: "0.3rem" }}>
					<div className="card-body d-flex justify-content-center" style={{ padding: 0 }}>
						<table>
							<tr>
								<td className="d-flex justify-content-center">
									<div className="mt-2 mb-2">
										<span style={{ color: "#44a3ec", fontSize: 19, fontWeight: 600 }}>{temperature}</span>
										<span style={{ fontSize: 17, fontWeight: 600, color: "#A0Aec0" }}> ℃</span>
									</div>
								</td>
								<td id="weather" style={{ fontSize: 19 }} className="mt-2 mb-2 fw-600"></td>
								<td className="d-flex justify-content-center">
									<div className="mt-2 mb-2">
										<span style={{ color: "#44a3ec", fontSize: 19, fontWeight: 600 }}>{humidity}</span>
										<span style={{ fontSize: 17, fontWeight: 700, color: "#A0Aec0" }}> %</span>
									</div>
								</td>
							</tr>
							<tr>
								<td className="d-flex justify-content-center">
									<div className="mt-2 mb-2">
										<span style={{ color: "#44a3ec", fontSize: 19, fontWeight: 600 }}>{windSpeed}</span>
										<span style={{ fontSize: 17, color: "#A0Aec0", fontWeight: 600 }}> m/s</span>
									</div>
								</td>
								<td id="weather" style={{ fontSize: 19 }} className="mt-2 mb-2 fw-600"></td>
								<td className="d-flex justify-content-center">
									<div style={{ fontSize: 19, color: "#44a3ec" }} className="mt-2 mb-2">
										<i className="fa fa-fw fa-long-arrow-up" />
									</div>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</MediaQuery>
		</div>
	);
}

function WeatherIcon(props) {
	const inactive = "#8493A5";
	const active = "#00a8f7";
	let [color, setColor] = useState(inactive);

	return (
		<div style={{ color }} onMouseOver={() => setColor(active)} onMouseLeave={() => setColor(inactive)}>
			<div className="d-flex align-items-center justify-content-center">
				{props.windDegree != null ? (
					<Arrow
						angle={props.windDegree}
						lineWidth={2}
						length={28}
						color={color}
						style={{
							width: "40px",
							height: "40px",
						}}
					/>
				) : (
					""
				)}
				{props.children}
			</div>
		</div>
	);
}

CustomWeather.propTypes = {
	temperature: PropTypes.number,
	humidity: PropTypes.number,
	windDegree: PropTypes.number,
	windSpeed: PropTypes.number,
};
