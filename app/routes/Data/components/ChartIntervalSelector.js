import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import MediaQuery from "react-responsive";

export default function ChartIntervalSelector({ value, onChange }) {
	const { t } = useTranslation();

	return (
		<div>
			<MediaQuery minWidth={411}>
				<div className="btn-group" role="group" aria-label="Basic example">
					<button
						type="button"
						className={`btn btn-white-border btn-${value == "rt" ? "primary" : "secondary"} `}
						onClick={() => onChange("rt")}
					>
						{t("daily")}
					</button>
					<button
						type="button"
						className={`btn btn-${value == "10m" ? "primary" : "secondary"} btn-white-border`}
						onClick={() => onChange("10m")}
					>
						{t("weekly")}
					</button>
					<button
						type="button"
						className={`btn btn-${value == "1h" ? "primary" : "secondary"} btn-white-border`}
						onClick={() => onChange("1h")}
					>
						{t("monthly")}
					</button>
					<button
						type="button"
						className={`btn btn-${value == "1d" ? "primary" : "secondary"} btn-white-border`}
						onClick={() => onChange("1d")}
					>
						{t("yearly")}
					</button>
				</div>
			</MediaQuery>
			<MediaQuery maxWidth={410}>
				<div style={{ width: "100%" }}>
					<button
						type="button"
						className={`btn btn-white-border btn-${value == "rt" ? "primary" : "secondary"}`}
						onClick={() => onChange("rt")}
						style={{ width: "50%", border: "1px solid #fff" }}
					>
						{t("daily")}
					</button>
					<button
						type="button"
						className={`btn btn-${value == "10m" ? "primary" : "secondary"}`}
						onClick={() => onChange("10m")}
						style={{ width: "50%", border: "1px solid #fff" }}
					>
						{t("weekly")}
					</button>
				</div>
				<div style={{ width: "100%" }}>
					<button
						type="button"
						className={`btn btn-${value == "1h" ? "primary" : "secondary"}`}
						onClick={() => onChange("1h")}
						style={{ width: "50%", border: "1px solid #fff" }}
					>
						{t("monthly")}
					</button>
					<button
						type="button"
						className={`btn btn-${value == "1d" ? "primary" : "secondary"}`}
						onClick={() => onChange("1d")}
						style={{ width: "50%", border: "1px solid #fff" }}
					>
						{t("yearly")}
					</button>
				</div>
			</MediaQuery>
		</div>
	);
}

ChartIntervalSelector.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
};
