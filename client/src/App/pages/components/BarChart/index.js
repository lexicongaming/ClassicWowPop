import React, { Component } from 'react';
import * as d3 from 'd3';
import tip from 'd3-tip';
import './d3-tip.css';
import './wow-colors.css';

class BarChart extends Component {
  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate(prevProps) {
    const { data, id } = this.props;
    if (prevProps.data !== data) {
      d3.select(`#${id}`)
        .selectAll('svg')
        .remove();
      this.drawChart();
    }
  }

  drawChart() {
    const {
      id,
      selector,
      chartHeight,
      scale,
      gap,
      iconSize,
      maxWidth,
      hideIcons,
      showXAxis,
      hideText,
      data,
      data: { total }
    } = this.props;

    const axisHeight = showXAxis ? 20 : 0;
    const textHeight = !hideText ? 23 : 0;

    let { barWidth } = this.props;
    let barData = data[selector];
    barData = barData.map(el => {
      const temp = { ...el };
      temp.safeName = String(temp.name)
        .toLowerCase()
        .replace(' ', '_');
      temp.percent = d3.format('.0%')(temp.count / total);
      return temp;
    });
    const numDataPoints = barData.length;

    const padding = {
      top: 0,
      bottom: 10,
      left: 10,
      right: 10
    };

    if (maxWidth) {
      barWidth =
        (maxWidth - padding.left - padding.right - gap * (numDataPoints - 1)) / numDataPoints;
    }

    const xScale = d3
      .scalePoint()
      .domain(barData.map(d => d.name))
      .range([0, barWidth * numDataPoints + gap * (numDataPoints - 1)]);

    const xAxis = d3
      .axisBottom()
      .tickValues(
        barData
          .map(d => Number(d.name))
          .filter(
            (d, i, arr) => i !== arr.length - 2 && (d % 5 === 0 || i === arr.length - 1 || i === 0)
          )
      )
      .scale(xScale);

    const classMax = d3.max(barData, d => d.count);
    const heightValue = chartHeight;
    const height = heightValue - padding.top - padding.bottom;
    const iconOffset = iconSize < barWidth ? iconSize / 2 : 0;
    let yScale;
    switch (scale) {
      case 'pow':
        yScale = d3.scalePow().exponent(0.2);
        break;
      case 'linear':
        yScale = d3.scaleLinear();
        break;
      default:
        break;
    }
    yScale.domain([0, classMax]).range([height - iconSize - axisHeight - textHeight, 0]);

    const barHeight = d => yScale(0) - yScale(d.count);

    const pos = {
      x: (d, i) => barWidth * i + padding.left + gap * i,
      y: d => yScale(d.count) + padding.top + textHeight
    };

    const widthValue =
      barWidth * barData.length + padding.left + padding.right + gap * (barData.length - 1);

    const svg = d3
      .select(`#${id}`)
      .append('svg')
      .attr('width', widthValue)
      .attr('height', heightValue);

    const selectorSingular = selector
      .replace('factions', 'Faction')
      .replace('races', 'Race')
      .replace('classes', 'Class')
      .replace('levels', 'Level');

    const toolTip = tip()
      .attr('class', 'd3-tip')
      .direction('e')
      .offset([0, 10])
      .html(
        d => `<div>
        <p>${selectorSingular}: ${d.name}</p>
        <p>${d.count} (${d.percent})</p>
      </div>`
      );
    svg.call(toolTip);

    if (showXAxis) {
      svg
        .append('g')
        .attr(
          'transform',
          `translate(${padding.left}, ${heightValue - padding.bottom - axisHeight + 1})`
        )
        .call(xAxis);
    }

    // bars
    svg
      .selectAll('rect')
      .data(barData)
      .enter()
      .append('rect')
      .attr('class', d => `bar ${selector}_${d.safeName}`)
      .attr('x', pos.x)
      .attr('y', pos.y)
      .attr('width', barWidth)
      .attr('height', barHeight)
      .attr('fill', 'currentColor')
      .on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);

    const text = svg
      .selectAll('text')
      .data(barData)
      .enter();

    // text
    if (!hideText) {
      text
        .append('text')
        .attr('x', pos.x)
        .attr('y', pos.y)
        .attr('dx', barWidth / 2)
        .attr('dy', '-0.2em')
        .attr('text-anchor', 'middle')
        .text(d => d.percent)
        .attr('fill', 'black');
    }

    // images
    if (!hideIcons) {
      svg
        .selectAll('image')
        .data(barData)
        .enter()
        .append('image')
        .attr('x', (d, i) => pos.x(d, i) + iconOffset)
        .attr('y', d => pos.y(d) + barHeight(d) + 1)
        .attr('xlink:href', d => `images/icons/${selector}_${d.safeName}.png`)
        .attr('width', iconSize)
        .attr('height', iconSize);
    }
  }

  render() {
    const { id, selector } = this.props;
    const headLine = selector.charAt(0).toUpperCase() + selector.slice(1);
    return (
      <div id={id}>
        <h4>{headLine}</h4>
      </div>
    );
  }
}

BarChart.defaultProps = {
  scale: 'linear',
  gap: 5,
  iconSize: 0
};

export default BarChart;
