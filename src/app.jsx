import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import styles from './app.module.css';

import {HomePage} from './home/home-page';
import {TerminalPage} from './terminal/terminal-page';
import {PipesPage} from './pipes/pipes-page';

import {Footer} from './footer';
import {Typography} from './common/typography';

export function App() {
  return (
    <div className={styles.app}>
      <Typography type='h1'>utils.gg</Typography>
      <Typography type='h2'>Local only implementation of your favorite tools.</Typography>
      <div className={styles.pages}>
        <Router>
          <Switch>
            <Route path='/pipes' component={PipesPage} />
            <Route path='/terminal' component={TerminalPage} />
            <Route path='/' component={HomePage} />
          </Switch>
        </Router>
      </div>

      <Footer>
        Special thanks to <Typography type='a' href='https://www.netlify.com/'>Netlify</Typography> for powering the website.
      </Footer>
    </div>
  );
}
