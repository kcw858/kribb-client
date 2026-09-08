import React from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";

// const odorLevelColors = ["#5db900", "#a2ba01", "#e4af07", "#fb8e13", "#ff4819", "#e81327"];
const odorLevelColors = ["#0bcf0b", "#ffc000", "#ff7c2a", "#ff0000"];

const getOdorLevelColor = (value) => odorLevelColors[Math.round(value)] || _.last(odorLevelColors);

export { odorLevelColors, getOdorLevelColor };

export default function OrdorColorLegend() {
	const { t } = useTranslation();

	return (
		<div className="container">
			<div className="row" style={{ borderLeft: "2px solid #fff", borderBottom: "2px solid #fff" }}>
				{odorLevelColors.map((color, index) => (
					<div key={color} style={{ backgroundColor: color, color: "white" }} className={`col-3 p-0 text-center`}>
						{index}
					</div>
				))}
			</div>
		</div>
	);
}
