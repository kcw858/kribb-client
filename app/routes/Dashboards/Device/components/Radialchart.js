import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default function RadialChart(title,value) {
    
        const state = {
            series: [value],
            options: {
                title: {
                    text: `${title}`,
                    align: 'center',
                    offsetY: 15,
                    style: {
                        color: "#718096",
                        fontWeight: 'bold',
                    }
                },
                states: {
                    normal: {
                        filter: {
                            type: 'none',
                            value: 0,
                        }
                    },
                    hover: {
                        filter: {
                            type: 'darken',
                            value: 1,
                        }
                    },
                    active: {
                        allowMultipleDataPointsSelection: false,
                        filter: {
                            type: 'darken',
                            value: 1,
                        }
                    },
                },
                chart: {
                    type: 'radialBar',
                    sparkline: {
                        enabled: true
                    }
                },
                plotOptions: {
                    radialBar: {
                        startAngle: -92,
                        endAngle: 92,
                        track: {
                            background: "#e7e7e7",
                            strokeWidth: '97%',
                            margin: 5, // margin is in pixels
                            dropShadow: {
                                enabled: true,
                                top: 2,
                                left: 0,
                                color: '#999',
                                opacity: 1,
                                blur: 2
                            }
                        },
                        dataLabels: {
                            name: {
                                color: '#CBD5E0',
                                show: true,
                                fontSize:"14px",
                            },
                            value: {
                                formatter: function (val) {
                                    return (val);
                                },
                                offsetY: -30,
                                fontSize: '20px',
                            },
                        }
                    }
                },
                grid: {
                    padding: {
                        top: 0
                    }
                },
                labels: `${title}`==="ACID" ? ['mA'] : (`${title}`==="INDOLES" ? ['mA'] : ['ppm']),
            },
        };
    

    return (
        <div id="chart">
            <ReactApexChart options={state.options} series={state.series} type="radialBar" height={180} />
        </div>
    );
}
    