import React from 'react';

function List({
  data, getLink, getTitle, getSubtitle,
}) {
  return (
    <ul>
      {data.map((e, i) => (
        <li key={String(i)}>
          <a target="_blank" rel="noopener noreferrer" href={getLink(e)}>
            {getTitle(e)}
          </a>
          {' '}
          -
          {' '}
          {getSubtitle(e)}
        </li>
      ))}
    </ul>
  );
}

export default List;
