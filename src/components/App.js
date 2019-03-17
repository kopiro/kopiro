import React from 'react';

import Story from './Story';
import Medium from './Medium';
import Github from './Github';
import Projects from './Projects';
import Ruler from './Ruler';

import { config } from '../../package.json';

const App = ({
  story, medium, github, projects,
}) => (
  <React.Fragment>
    <Ruler />
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
    <img id="avatar" src="https://gravatar.com/avatar/6a46c3623a8bb6e3e641eca16450bd83.jpg?s=600" />
  </React.Fragment>
);

export default App;
