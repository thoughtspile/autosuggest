import React from 'react';
import Autocomplete from './Autocopmlete';
import suggestService from '../services/suggest';

const describeBook = b => `${b.item.title} by ${b.item.author}, ${b.item.year}`;

export default class App extends React.Component {
  constructor(p, c) {
    super(p, c);
    this.state = { submitted: null };
  }

  search(search) {
    this.setState({ search });
    suggestService.search(search).then(() => this.forceUpdate());
  }
  
  render() {
    const { search, submitted } = this.state;
    return <div style={{ width: '500px' }}>
      <Autocomplete
        value={search}
        items={suggestService.cache[search]}
        loading={suggestService.loading[search]}
        suggest={qs => this.search(qs)}
        onSubmit={qs => this.setState({ submitted: qs })}
        getText={describeBook}
      />
      {(submitted != null) && <div style={{ textAlign: 'center', fontSize: '20px', marginTop: '20px' }}>
        Search results for {submitted}
      </div>}
    </div>;
  }
}
