import { Component } from 'react'
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import React from 'react';

export default class AreaChart extends Component {
    constructor({value}) {
        super({value});
        this.state = {
            series: [{
                name:"ppm ",
                data: value
              }],
              options: {
                grid:{
                  borderColor: '#E2E8F0',
                },
                chart: {
                  type: 'area',
                  toolbar: {
                    show: false
                  },
                  zoom:{
                    enabled:false,
                  }
                },
                title:{
                    text:"",
                    align:"center",
                    offsetY: 10,
                    style:{
                      color:"#718096",
                      fontWeight:'bold',
                    }
                },
                dataLabels: {
                  enabled: false
                },
                stroke: {
                  curve: 'smooth',
                  width: 3,
                  },
                  xaxis: {
                      categories: value,
                    labels:{
                      show: false,
                      style:{
                        colors: "#c8cfca",
                      }
                    }
                  },
                  
                  yaxis:{
                    labels:{
                      show: false,
                      style:{
                        colors: "#c8cfca",
                      }
                    }
                  }
              },
            };
    }
    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={100} />
            </div>
        );
    }
}