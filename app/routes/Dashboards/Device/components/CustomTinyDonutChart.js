/* eslint-disable react/prop-types */
import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Badge } from "../../../../components";

export default function CustomTinyDonutChartBig({
  title,
  label,
  value,
  unit,
  color,
}) {
  if (!value) {
    return <div />;
  }

  let rateA = Math.round((+value[0] / (+value[0] + +value[1])) * 100);
  let rateB = Math.round((+value[1] / (+value[0] + +value[1])) * 100);

  return (
    <div>
      <div className="mb-3 text-center">
        <h6 className="mb-1">{title}</h6>
        <Badge style={{ backgroundColor: color }} pill>
          {rateA}%
        </Badge>
      </div>
      <div className="mb-0 text-center">
        <h2 className="mb-0">
          {value[0]} <small>{unit}</small>
        </h2>
      </div>
      <PieChart className={"mx-auto"} width={130} height={160}>
        <Pie
          data={[
            { name: label[0], value: value[0] },
            { name: label[1], value: value[1] },
          ]}
          dataKey="value"
          innerRadius={58}
          outerRadius={65}
          fill={"#dee2e6"}
        >
          <Cell fill={color} />
        </Pie>
      </PieChart>
      <div className="d-flex justify-content-center">
        <div className="text-left">
          <div className="small mb-2">
            <i className="fa fa-circle fa-fw" style={{ color: color }}></i>{" "}
            {label[0]}
          </div>
          <h6 className="mb-0">{value[0]}</h6>
          <span>{rateA}%</span>
        </div>
        <div className="text-left ml-2">
          <div className="small mb-2">
            <i className="fa fa-circle fa-fw" style={{ color: "#dee2e6" }}></i>{" "}
            {label[1]}
          </div>
          <h6 className="mb-0">{value[1]}</h6>
          <span>{rateB}%</span>
        </div>
      </div>
    </div>
  );
}
