/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import StackedBarChartFilterForm from './components/StackedBarChartFilterForm';
import OverviewChart from './components/OverviewChart';
import Spinner from './components/Spinner';

class Overview extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      overviewStats: null,
      loading: false,
      query: {},
      width: 0,
      height: 0
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    const { location } = this.props;
    let query = queryString.parse(location.search);
    if (Object.entries(query).length === 0) {
      query = { lastSeen: 14, minLevel: 10 };
    }
    this.setState({ query });
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.getOverviewStats(query);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  // Retrieves the list of items from the Express app
  getOverviewStats = (query, cb) => {
    this.setState({ loading: true });
    const qs = queryString.stringify(query);
    window
      .fetch(`/api/stats/overview?${qs}`)
      .then(res => res.json())
      .then(overviewStats => {
        this.setState({
          overviewStats,
          loading: false
        });
        if (cb) cb(overviewStats);
      });
  };

  handleFilterChange = query => {
    const { history } = this.props;
    const qs = queryString.stringify(query);
    history.push({
      pathname: '/overview',
      search: qs
    });
    this.setState({ query });
    this.getOverviewStats(query);
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    const { overviewStats, query, width, height, loading } = this.state;

    function LoadingPanel(props) {
      if (props.loading) return <Spinner width={300} height={300} color="#fff" />;
      return <div />;
    }

    const description =
      'Gives an overview about the faction balance through all WoW TBC Realms';
    const title = 'Realm faction balance overview - Wow Classic Pop census project';

    return (
      <div className="App">
        <Helmet>
          <meta name="description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
          <title>{title}</title>
        </Helmet>
        <h1>Overview of faction balance</h1>
        <StackedBarChartFilterForm onChange={this.handleFilterChange} />
        <LoadingPanel loading={loading} />
        {overviewStats === null || loading ? (
          <div />
        ) : (
          <OverviewChart width={width} query={query} overviewStats={overviewStats} />
        )}
      </div>
    );
  }
}

export default withRouter(Overview);
