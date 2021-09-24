import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="App">
      <h1>About</h1>
      <div className="box-wrapper normal">
        <h2>What is the project about?</h2>
        <p>
          I&apos;m collecting character data from the WoW Classic realms. This data includes
          character name, realm, faction, race, class, level, guild and an activity snapshot that
          captures how many people were concurrently online at a specific time. This data is
          funneled into an online database, so that some fancy charts can be generated out of it so
          that everyone can have an easy look on it.
        </p>
        <h2>How did you get the numbers?</h2>
        <p>
          CenusPlusTBC is an addon that automatically chains /who request in an intelligent
          way, so that it can collect as much characters as possible that are currently online on a
          realm. The addon saves all this data in a *.lua file that then can be uploaded on this
          website where it gets aggregated with the collected data of all other people.
        </p>
        <h2>Who made this website?</h2>
        <p>
          Currently I&apos;m working alone on this project and I&apos;ve collected the initial
          character data samples by myself, but more and more people start collecting and submitting
          data and I would really appreciate it if even more people would join, so that we can grow
          an adequate sample size.
        </p>
        <h2>What is the goal</h2>
        <p>
At the moment, it simply to provide an area for Wow players, guild master/recruiters, and such to help determin what kind of Race/Class they can look to get, to help better their raid teams.
        </p>
        <h2>How can I contribute</h2>
        <p>
          It is highly appriciated that you install
          the{' '}
          <a href="https://discord.gg/DjcXKtKr88">CensusPlusTBC Addon</a>{' '}
          and <Link to="./contribute">upload your collected data</Link> to the website. Besides if
          you find any bugs or have some suggestions, feel free to join the project{' '}
          <a href="https://discord.gg/DjcXKtKr88">Discord</a> and post them there.
        </p>
        <h2>How can I contact you?</h2>
        <p>
          The best way to contact me is <a href="https://twitter.com/scarecr0w12">Twitter</a> or in
          the project <a href="https://discord.gg/DjcXKtKr88">Discord</a>.
        </p>
      </div>
    </div>
  );
};

export default About;
