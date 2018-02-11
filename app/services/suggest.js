import React from 'react';
import db from './data';
import Fuse from 'fuse.js';

const service = {
  search(qs) {
    return new Promise(resolve => {
      if (this.cache[qs]) return resolve();
      this.loading[qs] = true;
      setTimeout(() => {
        const suggestions = this.searcher.search(qs)
        .filter(m => m.matches.length);
        this.loading[qs] = false;
        this.cache[qs] = suggestions.map(m => { 
          const item = m.item;
          const match = m.matches[0];
          return { item, highlight: { key: match.key, range: match.indices[0] } };
        });
        resolve();
      }, 50);
    });
  },
  searcher: new Fuse(db, {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: [
      'author',
      'country',
      'title'
    ]
  }),
  popular: db
    .filter(() => Math.random() < .2)
    .map(item => ({ item, highlight: { key: '', range: [] } })),
  cache: {},
  loading: {}
};

export default service;