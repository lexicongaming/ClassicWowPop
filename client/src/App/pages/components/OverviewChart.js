/* eslint-disable prefer-destructuring */
import React from 'react';
import StackedBarChart from './StackedBarChart';
import './CharacterChart.css';

const OverviewChart = props => {
  const { overviewStats, width, query } = props;

  let chartWidth;
  if (width < 700) {
    chartWidth = width <= 360 ? 360 * 0.96 : width * 0.96;
  } else {
    chartWidth = 700;
  }

  let minLevel = 1;
  let maxLevel = 70;

  if (Object.prototype.hasOwnProperty.call(query, 'minLevel')) {
    minLevel = query.minLevel;
  }

  if (Object.prototype.hasOwnProperty.call(query, 'maxLevel')) {
    maxLevel = query.maxLevel;
  }
  const levelLabel = (
    <h2>
      Level {minLevel}-{maxLevel}
    </h2>
  );

  let activity;
  if (query && query.lastSeen) {
    activity = <h3>Last {query.lastSeen} days</h3>;
  }

  return (
    <div className="character-chart">
      {overviewStats.length === 0 ? (
        <div className="box-wrapper normal">
          <p>No data found for this selection</p>
        </div>
      ) : (
        <div>
          {levelLabel}
          {activity}
          <StackedBarChart id="overview-chart" data={overviewStats} width={chartWidth} />
        </div>
      )}
    </div>
  );
};

export default OverviewChart;
