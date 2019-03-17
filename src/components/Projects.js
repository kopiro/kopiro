import React from 'react';
import List from './List';

export default ({ data }) => (
  <section>
    <h3>Projects</h3>
    {List({
      data,
      getTitle: e => e.name,
      getSubtitle: e => e.description,
      getLink: e => e.url,
    })}
  </section>
);
