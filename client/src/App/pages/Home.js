import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { Helmet } from 'react-helmet';
import PieChart from './components/PieChart';
import useWindowDimensions from './hooks/useWindowDimensions';
import Spinner from './components/Spinner';

const Home = () => {
  const [quickStats, setQuickstats] = useState(false);
  const { width } = useWindowDimensions();

  const getQuickStats = () => {
    window
      .fetch(`/api/stats/quick?lastSeen=14`)
      .then(res => res.json())
      .then(stats => {
        setQuickstats(stats);
      });
  };

  useEffect(() => {
    if (!quickStats) {
      getQuickStats();
    }
  });

  let FactionPieChart = <Spinner width={200} height={200} color="#442317" />;
  if (quickStats && quickStats.factions.length > 0) {
    let pieDimensions = 400;
    if (width < 500) {
      pieDimensions = width * 0.8;
    }
    FactionPieChart = (
      <PieChart
        id="faction-pie-chart"
        width={pieDimensions}
        height={pieDimensions}
        data={quickStats}
      />
    );
  }

  const description = 'A project with the goal to take a full census of active players on all World of Warcraft: Wotlk Classic realms';
  const title = 'Wow Classic Pop - A census project';
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
      <h1>Wow Classic Pop - A census project</h1>
      <p className="intro">
        We are collecting census data from the World of Warcraft: Wotlk Classic realms with the help of an
        ingame addon and visualizes it in some fancy, filterable charts.
		<br />
		<span><h4>Help support the site, <a href="https://github.com/sponsors/scarecr0w12">Sponsor us today!</a></h4></span>
      </p>
      <div className="box-wrapper normal">
        {FactionPieChart}
        <h2 className="highlight">Help from the community needed!</h2>
        <p>
          This project is highly dependant on community participation, because the statistics are
          only as good as of how many people have the{' '}
          <a
            href="https://www.curseforge.com/wow/addons/censusplusWotlk"
            target="_blank"
            rel="noopener noreferrer"
          >
            CensusPlusWotlk addon
          </a>{' '}
          installed and submit their collected data to the website. If you wanna participate in
          improving the significance of the samples, just start collecting data while you&apos;re
          playing.
          <br />
          <br />
		  <span><h4>Help support the site, <a href="https://github.com/sponsors/scarecr0w12">Sponsor us today!</a></h4></span>
        </p>
        <p>
          If you need help setting it up take a look at the{' '}
          <Link to="./contribute">Instructions page</Link>. Some convenient options like an
          automatic data uploader are in the making also.
        </p>
      </div>
      <div className="discord-cta">
        <a href="https://discord.gg/DjcXKtKr88" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon size="7x" icon={faDiscord} />
          <p>
            Join the <br /> project <br /> discord
          </p>
        </a>
      </div>
    </div>
  );
};

export default Home;
