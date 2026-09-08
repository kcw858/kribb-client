import React from "react";
import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
} from "../../../../components/recharts";

import colors from './../../../../colors';

export default function CustomTinyBarChart({ strokeColor, fillColor, data }) {
  let chartData = [];
  for (let record of data) {
    chartData.push({ pv: record });
  }

  return (
    <ResponsiveContainer height={50}>
      <BarChart data={chartData}>
        <Bar dataKey="pv" stroke={strokeColor} fill={fillColor} />
      </BarChart>
    </ResponsiveContainer>
  );
}

CustomTinyBarChart.propTypes = {
  strokeColor: PropTypes.string,
  fillColor: PropTypes.string,
  data: PropTypes.array,
};

CustomTinyBarChart.defaultProps = {
  strokeColor: colors['primary'],
  fillColor: colors['primary-04'],
};