import React from "react";
import PropTypes from "prop-types";

// import { Gauge, useGradient } from "../../../../components/Gauge";
import CustomTinyAreaChart from "./CustomTinyAreaChart";
// import GaugeChart from "./GaugeChart";
// import CustomTinyBarChart from "./CustomTinyBarChart";

export default function CustomGuage({ title, min, max, value, threshold, unit, stokeColor, fillColor }) {
	if (!value) return <></>;
	let currentValue = value[0];
	let ratio = (currentValue / (max - min)) * 100;
	let thresholdRatio = (threshold / (max - min)) * 100;
	let barColor = ratio < thresholdRatio ? "#0BCF0F" : ratio < 50 ? "#FFC000" : ratio < 75 ? "#FF7C2A" : "#FF0000";
	// let displayValue = parseFloat(currentValue).toFixed(2);

	return (
		<div className="card">
			<div className="card-body" style={{ padding: "15px" }}>
				<div className="row">
					<div className="col-6">
						<div className="d-flex justify-content-between align-items-center">
							<h5 className="card-title" style={{ fontWeight: 500, color: "#4a5568" }}>
								{title}
							</h5>
						</div>

						<div className="d-flex justify-content-between align-items-center">
							<h3 className="card-title" style={{ fontWeight: 500, color: "#4a5568" }}>
								{currentValue}
							</h3>
						</div>
						<div className="d-flex justify-content-between align-items-center">
							<h5 style={{ fontWeight: 300, color: "#4a5568" }}>{unit}</h5>
						</div>
					</div>

					<div className="col-6">
						<div className="progress progress-bar-vertical">
							<div
								className="progress-bar progress-bar-striped progress-bar-animated"
								role="progressbar"
								aria-valuemin="0"
								aria-valuemax="100"
								style={{ height: ratio + "%", backgroundColor: barColor }}
							>
								{/* <span className="sr-only">30% Complete</span> */}
							</div>
						</div>
					</div>
				</div>

				{/* <Gauge
					height="100%"
					width="100%"
					min={min}
					max={max}
					value={currentValue}
					minAngle={-90}
					maxAngle={90}
					disabled={false}
					pointerLabel={String(currentValue)}
					tickCount={11}
					uom={currentValue + unit}
					uomProps={{
						offsetText: -15,
					}}
					labelProps={{
						offsetText: -7,
					}}
					arcSegments={[
						{
							min: 0,
							max: +threshold / (+min + +max),
							color:"rgb(181,230,29)",
						},
						{
							min: +threshold / (+min + +max),
							max: 1,
							...useGradient("orange", "rgba(255,0,0,1)", "redFade-randomkey"),
						},
					]}
				/> */}
				{/* <GaugeChart
				/> */}
			</div>

			<div className="ml-2 mr-2 mb-2">
				<CustomTinyAreaChart strokeColor={stokeColor} fillColor={fillColor} data={value} />
			</div>

			{/* <div className="ml-3 mr-3 mb-3">
				<CustomTinyBarChart strokeColor={stokeColor} fillColor={fillColor} data={value} />
			</div> */}
		</div>
	);
}

CustomGuage.propTypes = {
	title: PropTypes.string,
	min: PropTypes.number,
	max: PropTypes.number,
	value: PropTypes.array,
	threshold: PropTypes.number,
	unit: PropTypes.string,
	stokeColor: PropTypes.any,
	fillColor: PropTypes.any,
};
