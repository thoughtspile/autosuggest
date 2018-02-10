import React from 'react';

export default ({ value, suggest, items = [] }) => (
  <div>
    <input value={value} onChange={e => suggest(e.target.value)}></input>
    {value && <ul>
      {items.map(([q, name]) => <li key={q}>{q} —{name}</li>)}
    </ul>}
  </div>
);
