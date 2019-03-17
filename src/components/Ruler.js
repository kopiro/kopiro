import React from 'react';

const Ruler = () => (
  <div id="ruler">
    {new Array(135).fill(0).map((_, i) => (
      <span>{i + 1}</span>
    ))}
  </div>
);

export default Ruler;
