/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Characters from './pages/Characters';
import Activity from './pages/Activity';
import Contribute from './pages/Contribute';
import About from './pages/About';
import Overview from './pages/Overview';
import Status from './pages/Status';
import Header from './components/Header';

class App extends Component {
  render() {
    const App = () => (
      <div className="main-container">
        <Header />
        <main>
          <div className="header-margin" />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/overview" component={Overview} />
            <Route path="/characters" component={Characters} />
            <Route path="/activity" component={Activity} />
            <Route path="/contribute" component={Contribute} />
            <Route path="/status" component={Status} />
            <Route path="/about" component={About} />
          </Switch>
          <footer>
            <ul>
              <li>
                <Link to="./status">Status</Link>
              </li>
            </ul>
            <p>
              WowClassicPop uses names and images from World of Warcraft, and data
              proprietary to Blizzard Entertainment, Inc. World of Warcraft, Warcraft and Blizzard
              Entertainment are trademarks or registered trademarks of Blizzard Entertainment, Inc.
              in the U.S. and/or other countries.
            </p>
            <p>
            WowClassicPop.com is a system rebuilt using the original script created by <a href="https://github.com/christophrus/">Christophrus</a>. The Current site is developed by <a href="https://github.com/scarecr0w12">Scarecr0w12</a>
            </p>
          </footer>
        </main>
      </div>
    );
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;
