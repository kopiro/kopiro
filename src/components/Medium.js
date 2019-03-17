import React from 'react';
import List from './List';

export default ({ data }) => (
  <section>
    <h3>Press</h3>
    {List({
      data,
      getTitle: e => e.title,
      getSubtitle: e => e.content.subtitle,
      getLink: e => `https://medium.com/@{process.env.MEDIUM_USERNAME}/${e.uniqueSlug}`,
    })}
  </section>
);
