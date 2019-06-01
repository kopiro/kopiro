import React from 'react';

import Story from './Story';
import Medium from './Medium';
import Github from './Github';
import Projects from './Projects';

import { config } from '../../package.json';

const App = ({
  story, medium, github, projects,
}) => (
  <React.Fragment>
    <div id="app">
      <Story data={story} />
      <Medium data={medium} />
      <Github data={github} />
      <Projects data={projects} />
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://pgp.mit.edu/pks/lookup?op=get&search=${config.gpgKey}`}
        >
          {`GPG: ${config.gpgKey}`}
        </a>
      </div>
    </div>
  </React.Fragment>
);

export default App;
