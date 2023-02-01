import React, { Component } from 'react';
import * as d3 from 'd3';
import './index.css';

class PieChart extends Component {
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
    const {
      data: { total, factions },
      id,
      width,
      height
    } = this.props;

    const factionData = factions.map(faction => ({
      name: faction.name,
      count: faction.count,
      safeName: faction.name.toLowerCase()
    }));

    const radius = Math.min(width, height) / 2;

    const arc = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const labelArc = d3
      .arc()
      .outerRadius(radius / 2)
      .innerRadius(radius / 2);

    const pie = d3
      .pie()
      .sort(null)
      .value(d => d.count);

    const svg = d3
      .select(`#${id}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const g = svg
      .selectAll('.arc')
      .data(pie(factionData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .attr('class', d => `faction-pie ${d.data.safeName}`);

    const iconGroup = g.append('g').attr('transform', d => `translate(${labelArc.centroid(d)})`);

    iconGroup
      .append('text')
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .attr('class', d => `faction-pie text ${d.data.safeName}`)
      .attr('dy', radius / 4 + 16)
      .attr('dx', radius / 8)
      .text(d => d.data.name);

    iconGroup
      .append('text')
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('dy', -16)
      .attr('dx', radius / 8)
      .text(d => d3.format('.0%')(d.data.count / total));

    iconGroup
      .append('image')
      .attr('xlink:href', d => `images/icons/factions_${d.data.safeName}.png`)
      .attr('width', radius / 4)
      .attr('height', radius / 4);
  }

  render() {
    const {
      id,
      data: { total, countAll }
    } = this.props;
    return (
      <div id={id}>
        <h2>Active chars (last 14 days): {total.toLocaleString()}</h2>
        <h4>(Total chars recorded: {countAll.toLocaleString()})</h4>
      </div>
    );
  }
}

export default PieChart;
