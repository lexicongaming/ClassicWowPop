import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="App">
      <h1>About</h1>
      <div className="box-wrapper normal">
        <h2>Why?</h2>
        <p>
          We are collecting WoW TBC Classic population information to help understand trends within the servers. Character information such as Name, Guild, Level, Class and race, help us determin when players are playing, guild growths, Server activity, and other things we haven't even thought of us. Since many Wow TBC servers change in population with such frequency, undertanding that may help us as players(maybe even the developers) know what servers to play on, or move to/from.
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
          At this time, I am the only person working on this project. However, I would LOVE for help in building this into somthing amazing! You can find our discord below, or Find me (Statichands) on the Atiesh TBC Server on alliance.
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
