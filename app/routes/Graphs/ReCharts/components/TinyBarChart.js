import React from "react";
import _ from "lodash";
import { ResponsiveContainer, BarChart, Bar } from "./../../../../components/recharts";

import colors from "./../../../../colors";

const data = _.times(40, () => ({ pv: Math.random() * 100 }));

const TinyBarChart = () => (
	<ResponsiveContainer width="100%" height={40}>
		{/* <BarChart data={data}>
            <Bar dataKey='pv' fill={ colors['#576574'] } barSize={5} />
        </BarChart> */}
		{/* 일별 알림 수 */}
		<BarChart data={data}>
			<Bar dataKey="pv" fill="#6aade0" barSize={5} />
		</BarChart>
	</ResponsiveContainer>
);

export { TinyBarChart };
