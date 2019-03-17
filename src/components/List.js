import React from 'react';

function List({
  data, getLink, getTitle, getSubtitle,
}) {
  return (
    <ul>
      {data.map((e, i) => (
        <li key={String(i)}>
          <a target="_blank" rel="noopener noreferrer" href={getLink(e)}>
            <b>{getTitle(e)}</b>
          </a>
          <div>{getSubtitle(e)}</div>
        </li>
      ))}
    </ul>
  );
}

export default List;
