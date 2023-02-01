import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from './LineChart';

const ActivityChart = props => {
  const { activityStats, query, width, height } = props;

  let chartHeight = 550;
  let chartWidth = 700;

  const chartMargin = { top: 50, right: 50, bottom: 50, left: 50 };

  if (width < 600) {
    chartWidth = width <= 360 ? 360 * 0.96 : width * 0.96;
    chartHeight = chartWidth / 1.5;
    chartMargin.right = 10;
  } else {
    chartWidth = width * 0.96;
    if (height > 800) {
      chartHeight = height - 400;
    }
  }

  let headline = 'All realms';
  if (Object.prototype.hasOwnProperty.call(query, 'realm')) {
    console.log(query);
    if (Array.isArray(query.realm)) {
      headline =
        query.realm.length > 0
          ? query.realm.map(realm => realm.match(/_(.*)/)[1]).join(', ')
          : headline;
    } else {
      // eslint-disable-next-line prefer-destructuring
      headline = query.realm.match(/_(.*)/)[1];
    }
  }

  const dateFrom = Object.prototype.hasOwnProperty.call(query, 'dateFrom') ? query.dateFrom : false;
  const dateTo = Object.prototype.hasOwnProperty.call(query, 'dateTo') ? query.dateTo : false;

  let subHeadline = 'All time';
  if (dateFrom && dateTo) {
    subHeadline = `From ${dateFrom} to ${dateTo}`;
  } else if (dateFrom && !dateTo) {
    subHeadline = `From ${dateFrom} until now`;
  } else if (!dateFrom && dateTo) {
    subHeadline = `From big bang to ${dateTo}`;
  }

  let realmName;
  if (query && query.realm) {
    realmName = (
      <span>
        on
        <strong>&nbsp;{query.realm}</strong>
      </span>
    );
  }

  return (
    <div>
      {activityStats.length === 0 ? (
        <div className="box-wrapper normal">
          <p>No data found for this selection</p>
          <h2 className="highlight">Your help is wanted!</h2>
          <p>
            If you&apos;re playing World of Warcraft: Classic {realmName} you could start collecting
            data and upload it to our database
          </p>
          <p>
            Look at the <Link to="./contribute">Instructions</Link> if you need help getting it
            started.
          </p>
        </div>
      ) : (
        <div className="activity-wrapper">
          <h2>{headline}</h2>
          <h3>{subHeadline}</h3>
          <p>(Players online concurrently)</p>
          <LineChart
            id="activity-chart"
            width={chartWidth}
            height={chartHeight}
            margin={chartMargin}
            className="chart-container box-wrapper"
            data={activityStats}
            query={query}
          />
        </div>
      )}
    </div>
  );
};

export default ActivityChart;
