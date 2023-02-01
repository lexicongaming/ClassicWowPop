import React, { Component } from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LineChartFilterForm from './components/LineChartFilterForm';
import getRealmList from './helper/getRealmList';
import ActivityChart from './components/ActivityChart';
import Spinner from './components/Spinner';

class Activity extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      activityStats: null,
      realmOptions: null,
      loading: false,
      query: {},
      width: 0,
      height: 0
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    const { location } = this.props;
    const query = queryString.parse(location.search);
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    if (Object.entries(query).length !== 0) {
      this.getActivityStats(query);
    }
    getRealmList(realms => {
      this.setState({
        realmOptions: realms,
        query
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  // Retrieves the list of items from the Express app
  getActivityStats = (query, cb) => {
    this.setState({ loading: true });
    const qs = queryString.stringify(query);
    window
      .fetch(`/api/stats/activity?${qs}`)
      .then(res => res.json())
      .then(activityStats => {
        this.setState({
          activityStats,
          loading: false
        });
        if (cb) cb(activityStats);
      });
  };

  handleFilterChange = query => {
    const { history } = this.props;
    const qs = queryString.stringify(query);
    history.push({
      pathname: '/activity',
      search: qs
    });
    this.setState({ query });
    this.getActivityStats(query);
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    const { activityStats, realmOptions, query, width, height, loading } = this.state;

    let filterPanel;
    if (realmOptions !== null) {
      filterPanel = (
        <LineChartFilterForm realmOptions={realmOptions} onChange={this.handleFilterChange} />
      );
    }

    function LoadingPanel(props) {
      if (props.loading) return <Spinner width={300} height={300} color="#fff" />;
      return <div />;
    }

    const description =
      'Realm activity gives an overview about the active players concurrently online on Wow Wotlk Classic realms in chart form';
    const title = 'Population activity overview - Wow Classic Pop census project';
    const keywords = 'World of warcraft population, Wow population, warcraft census, wow census, censusplusWotlk, censusplusclassic,wowclassicpopulation.com';

    return (
      <div className="App">
        <Helmet>
          <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
          <meta name="twitter:description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
          <title>{title}</title>
        </Helmet>
        <h1>Activity</h1>
        {filterPanel}
        <LoadingPanel loading={loading} />
        {activityStats === null ? (
          <div />
        ) : (
          <ActivityChart
            width={width}
            height={height}
            query={query}
            activityStats={activityStats}
          />
        )}
        <p className="intro" style={{ marginTop: '10px' }}>
          The activity charts can give you a good idea about the active Wow Classic Population and
          how many people are playing WoW Classic. Currently there is census data from the most Wow
          Classic realms but this project aims to provide data from all the realms as well. Keep in
          mind that the data is only as good, as of how many people are uploading their data. You
          maybe need to select a specific time frame to get more meaningful results.
        </p>
      </div>
    );
  }
}

export default withRouter(Activity);
