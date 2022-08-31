import React, { Component } from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import BarChartFilterForm from './components/BarChartFilterForm';
import CharacterChart from './components/CharacterChart';
import getRealmList from './helper/getRealmList';
import Spinner from './components/Spinner';

class Characters extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      realmOptions: null,
      query: null,
      characterStats: null,
      loading: false
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    const { location } = this.props;
    const query = queryString.parse(location.search);
    if (Object.entries(query).length !== 0) {
      this.getCharacterStats(query);
    }
    getRealmList(realms => {
      this.setState({
        realmOptions: realms
      });
    });
  }

  // Retrieves the list of items from the Express app
  getCharacterStats = (query, cb) => {
    this.setState({ loading: true });
    const qs = queryString.stringify(query);
    window
      .fetch(`/api/stats/characters?${qs}`)
      .then(res => res.json())
      .then(characterStats => {
        this.setState({
          characterStats,
          loading: false
        });
        if (cb) cb(characterStats);
      });
  };

  handleFilterChange = query => {
    const { history } = this.props;
    const qs = queryString.stringify(query);
    history.push({
      pathname: '/characters',
      search: qs
    });
    this.setState({ query });
    this.getCharacterStats(query);
  };

  render() {
    const { characterStats, realmOptions, query, loading } = this.state;

    let filterPanel;

    if (realmOptions !== null) {
      filterPanel = (
        <BarChartFilterForm realmOptions={realmOptions} onChange={this.handleFilterChange} />
      );
    }

    function LoadingPanel(props) {
      if (props.loading) return <Spinner width={300} height={300} color="#fff" />;
      return <div />;
    }

    const description =
      'Character statistics give an overview about the the class, race and level distribution accross all Wow Wotlk Classic realms';
    const title =
      'Character statistics - Class / Race / Level distribution - Wow Classic Pop census project';
    const keywords =
      'World of warcraft population, Wow population, warcraft census, wow census, censusplusWotlk, censusplusclassic,wowclassicpop.com';

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
        <h1>Characters</h1>
        {filterPanel}
        <LoadingPanel loading={loading} />
        {characterStats === null || loading ? (
          <div />
        ) : (
          <div>
            <CharacterChart
              realmOptions={realmOptions}
              characterStats={characterStats}
              query={query}
            />
          </div>
        )}
        <p className="intro" style={{ marginTop: '10px' }}>
          The character charts can give you a good idea about the Wow Wotlk Classic Population
          especially regarding to the balance of factions on a realm as well as about race, class
          and level distribution. Currently there is census data from the most Wow Wotlk Classic
          realms but this project aims to provide data from all the realms as well. Keep in mind
          that the data is only as good, as of how many people are uploading their data. You can use
          the filter options to get an even deeper insight if you wanna take a look into something
          special.
        </p>
      </div>
    );
  }
}

export default withRouter(Characters);
