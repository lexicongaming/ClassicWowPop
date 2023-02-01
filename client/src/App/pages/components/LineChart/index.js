/* eslint-disable func-names */
import React, { Component } from 'react';
import * as d3 from 'd3';
import { onlyTurningPoints, notTooCloseToMinOrMaxInStack } from './Helper';
import './index.css';

class LineChart extends Component {
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
    const { data, width, height, margin } = this.props;
    const { id } = this.props;

    const combined = [].concat(...data);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const dateMin = d3.min(combined, d => new Date(d.date));
    const dateMax = d3.max(combined, d => new Date(d.date));

    const onlineTotalMax = d3.max(combined, d => d.onlineTotal);

    const xScale = d3
      .scaleTime()
      .domain([dateMin, dateMax])
      .range([0, chartWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, onlineTotalMax])
      .range([chartHeight, 0]);

    const line = d3
      .line()
      .x(d => xScale(new Date(d.date)))
      .y(d => yScale(d.onlineTotal))
      .curve(d3.curveMonotoneX);

    const svg = d3
      .select(`#${id}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg
      .append('g')
      .attr('class', 'line-container')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('class', d => `line-group ${d[0].name}`)
      .on('mouseover', function(d) {
        svg
          .append('text')
          .attr('class', `title-text ${d[0].name}`)
          .text(d[0].label)
          .attr('text-anchor', 'middle')
          .attr('x', (width - margin.left - margin.right) / 2)
          .attr('y', 5);
      })
      .on('mouseout', function() {
        svg.select('.title-text').remove();
      })
      .append('path')
      .attr('class', d => `line ${d[0].name}`)
      .attr('d', line)
      .on('mouseover', function() {
        d3.selectAll('.line').style('opacity', 0.2);
        d3.select(this)
          .style('opacity', 1)
          .style('stroke-width', '2.5px');
      })
      .on('mouseout', function() {
        d3.selectAll('.line').style('opacity', 0.5);
        d3.select(this)
          .style('opacity', 0.5)
          .style('stroke-width', '1.5px');
      });

    svg
      .append('g')
      .attr('class', 'circle-container')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('class', d => `circle-group ${d[0].name}`)
      .selectAll('circle')
      .data(d =>
        d
          .map(el => {
            const temp = { ...el };
            temp.onlineTotalVal = Math.floor(el.onlineTotal);
            temp.onlineTotal = yScale(el.onlineTotal);
            temp.date = xScale(new Date(el.date));
            return temp;
          })
          .filter(onlyTurningPoints)
          .filter(notTooCloseToMinOrMaxInStack)
      )
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('cx', d => d.date)
      .attr('cy', d => d.onlineTotal)
      .attr('r', 2)
      .on('mouseover', function(d) {
        d3.selectAll('.line').style('opacity', 0.2);
        d3.selectAll('.circle').style('opacity', 0.3);
        svg
          .append('text')
          .attr('class', `circle-text ${d.name}`)
          .text(d.onlineTotalVal)
          .attr('x', d.date + 5)
          .attr('y', d.onlineTotal - 10);
        d3.select(this)
          .transition()
          .duration(250)
          .style('opacity', 1)
          .attr('r', 4);
      })
      .on('mouseout', function() {
        d3.selectAll('.line').style('opacity', 0.5);
        d3.selectAll('.circle').style('opacity', 0.85);
        svg.select('.circle-text').remove();
        d3.select(this)
          .transition()
          .duration(250)
          .attr('r', 2);
      });

    const legendElement = svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom - 10})`)
      .attr('class', 'legend')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * 70}, 0)`);

    legendElement
      .append('circle')
      .attr('class', d => `circle-legend ${d[0].name}`)
      .attr('r', 5);

    legendElement
      .append('text')
      .text(d => d[0].label)
      .attr('dy', '.32em')
      .attr('dx', 8)
      .style('font-size', '12px');

    svg
      .append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale));

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale));
  }

  render() {
    const { id, className } = this.props;
    return <div id={id} className={className} />;
  }
}

LineChart.defaultProps = {
  scale: 'linear',
  gap: 5,
  iconSize: 0
};

export default LineChart;
