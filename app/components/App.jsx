import React from 'react';
import Autocomplete from './Autocopmlete';
import suggestService from '../services/suggest';

export default class App extends React.Component {
  constructor(p, c) {
    super(p, c);
    this.state = { search: '' };
  }

  search(search) {
    this.setState({ search });
    suggestService.search(search);
  }
  
  render() {
    const { search } = this.state;
    return <Autocomplete 
      value={search} 
      items={suggestService.cache[search]} 
      suggest={qs => this.search(qs)}
    />;
  }
}
