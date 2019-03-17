import React from 'react';
import List from './List';

export default ({ data }) => (
  <section>
    <h3>OSS Projects</h3>
    {List({
      data,
      getTitle: e => e.name,
      getSubtitle: e => `${e.description} ★ ${e.stargazers_count}/${e.forks_count}`,
      getLink: e => e.html_url,
    })}
  </section>
);
