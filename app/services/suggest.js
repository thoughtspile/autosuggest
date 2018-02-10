import React from 'react';
import db from './data';

export default {
  search(qs) {
    if (this.cache[qs]) return this.cache[qs];
    const res = db.filter(e => e[0].includes(qs));
    this.cache[qs] = res;
  },
  cache: {}
};
