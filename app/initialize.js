import ReactDOM from 'react-dom';
import React from 'react';
import App from 'components/App';

import PureAutocomplete from 'components/PureAutocomplete';
import suggestService from 'services/suggest';
const describeBook = b => `${b.item.title} by ${b.item.author}, ${b.item.year}`;
const bookTemplate = ({ item }) => `
  <div class="book-card">
    <div class="book-card__title">${item.title}</div>
    <div class="book-card__info">
      ${item.author}
      <span class="book-card__year">${item.year}</span>
    </div>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.querySelector('#app'));
  
  const pureForm = document.getElementById('pure-form');
  const pureOutput = document.getElementById('pure-output');
  new PureAutocomplete(pureForm, {
    loadOptions: (qs) => {
      return suggestService.search(qs).then(() => suggestService.cache[qs]);
    },
    onSubmit: (qs) => {
      pureOutput.innerHTML = `Search results for ${qs}`;
    },
    getText: describeBook,
    itemTemplate: bookTemplate
  });
});
