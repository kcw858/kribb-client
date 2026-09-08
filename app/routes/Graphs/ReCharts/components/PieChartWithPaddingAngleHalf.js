import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "./../../../../components/recharts";
import colors from "./../../../../colors";

const COLORS = ["#6aade0", "#e2e8f0"];
export const PieChartWithPaddingAngleHalf = (props) => (
	<ResponsiveContainer width="100%" aspect={6.0 / 3.0}>
		<PieChart margin={{ top: 60 }}>
			<Pie
				data={[
					{ name: "deviceOn", value: props.useable },
					{ name: "deviceOff", value: props.unuseable },
				]}
				dataKey="value"
				innerRadius={50}
				outerRadius={80}
				startAngle={180}
				endAngle={0}
				paddingAngle={0}
			>
				<Cell key={0} fill={COLORS[0 % COLORS.length]} />
				<Cell key={1} fill={COLORS[1 % COLORS.length]} />
			</Pie>
		</PieChart>
	</ResponsiveContainer>
);
