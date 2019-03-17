import React from 'react';

function Story({ data }) {
  return <section id="story" dangerouslySetInnerHTML={{ __html: data }} />;
}

export default Story;
