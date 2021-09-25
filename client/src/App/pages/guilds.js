/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MaterialTable from 'material-table';
import StatusFilterForm from './components/StatusFilterForm';
import Spinner from './components/Spinner';
import './Status.css';

class Overview extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      statusStats: null,
      loading: false,
      query: {}
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    const { location } = this.props;
    const query = queryString.parse(location.search);
    this.setState({ query });
    this.getStatusStats(query);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  // Retrieves the list of items from the Express app
  getStatusStats = (query, cb) => {
    this.setState({ loading: true });
    const qs = queryString.stringify(query);
    window
      .fetch(`/api/stats/status?${qs}`)
      .then(res => res.json())
      .then(statusStats => {
        this.setState({
          statusStats,
          loading: false
        });
        if (cb) cb(statusStats);
      });
  };

  handleFilterChange = query => {
    const { history } = this.props;
    const qs = queryString.stringify(query);
    history.push({
      pathname: '/guilds',
      search: qs
    });
    this.setState({ query });
    this.getStatusStats(query);
  };

  render() {
    const { statusStats, query, loading } = this.state;

    function LoadingPanel(props) {
      if (props.loading) return <Spinner width={300} height={300} color="#fff" />;
      return <div />;
    }

    const description = 'Shows how frequent realms got updates and when the last update was';
    const title = 'Realm update status - Wow Classic Pop census project';

    let activity = <h3>All time</h3>;
    if (query && query.lastDays) {
      activity = <h3>Last {query.lastDays} days</h3>;
    }

    return (
      <div className="App">
        <Helmet>
          <meta name="description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <title>{title}</title>
        </Helmet>
        <h1>Realm update status</h1>
        <StatusFilterForm onChange={this.handleFilterChange} />
        <LoadingPanel loading={loading} />
        {statusStats === null || loading ? (
          <div />
        ) : (
          <div style={{ marginTop: '15px' }}>
            {activity}
            <MaterialTable
              title="Census stats"
              columns={[
                { title: 'Guild', field: 'guild' },
                { title: 'Faction', field: 'faction' },
                { title: 'Census amount', field: 'count', type: 'numeric' },
                { title: 'Last census', field: 'last', type: 'datetime' }
              ]}
              data={statusStats}
              style={{
                marginTop: '10px',
                borderRadius: '15px',
                background: 'rgba(54, 164, 170,0.8)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderBottom: 'none'
              }}
              options={{
                pageSize: 10,
                pageSizeOptions: [10, 50, 100],
                sorting: true,
                headerStyle: {
                  background: 'rgba(24, 112, 117, 0.8)'
                },
                cellStyle: {
                  borderBottom: '1px solid rgba(24, 112, 117, 0.8)'
                },
                filterCellStyle: {
                  borderBottom: '1px solid rgba(24, 112, 117, 0.8)'
                }
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Overview);
