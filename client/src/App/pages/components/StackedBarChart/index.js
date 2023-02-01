import React, { Component } from 'react';
import * as d3 from 'd3';
import tip from 'd3-tip';
import './index.css';

class StackedBarChart extends Component {
  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate(prevProps) {
    const { data, width, id } = this.props;
    if (prevProps.data !== data || prevProps.width !== width) {
      d3.select(`#${id}`)
        .selectAll('svg')
        .remove();
      this.drawChart();
    }
  }

  drawChart() {
    const { id, data, width } = this.props;

    const height = data.length * 20;

    const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 140
    };

    const svg = d3
      .select(`#${id}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const toolTip = tip()
      .attr('class', 'd3-tip')
      .direction('n')
      .offset([-10, 0])
      .html(d => {
        const percent = ((d[1] - d[0]) * 100).toFixed(1);
        let faction = d[0] === 0 ? 'Alliance' : 'Horde';
        let absolute = d[0] === 0 ? d.data.alliance : d.data.horde;
        if (d[0] === 0 && d[1] === 1) {
          faction = d.data.horde === 0 ? 'Alliance' : 'Horde';
          absolute = d.data.horde === 0 ? d.data.alliance : d.data.horde;
        }
        return `<div>
        <p>${faction}: ${absolute}</p>
        <p>${percent}%</p>
      </div>`;
      });
    svg.call(toolTip);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3
      .scaleBand()
      .rangeRound([0, height])
      .padding(0.1)
      .align(0.1);

    const x = d3.scaleLinear().rangeRound([width - margin.left - margin.right, 0]);

    const z = d3.scaleOrdinal().range(['#235', '#833']);

    const stack = d3.stack().offset(d3.stackOffsetExpand);

    y.domain(data.map(d => d.realm));
    z.domain(['alliance', 'horde']);

    const serie = g
      .selectAll('.serie')
      .data(stack.keys(['alliance', 'horde'])(data))
      .enter()
      .append('g')
      .attr('class', 'serie')
      .attr('fill', d => z(d.key));

    serie
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('y', d => y(d.data.realm))
      .attr('x', d => x(d[1]))
      .attr('width', d => x(d[0]) - x(d[1]))
      .attr('height', y.bandwidth())
      .on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y));

    serie
      .append('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        d => `translate(${(x(d[0][0]) + x(d[0][1])) / 2}, ${y(d[0].data.State) - y.bandwidth()})`
      );
  }

  render() {
    const { id } = this.props;
    return <div id={id} />;
  }
}

export default StackedBarChart;
