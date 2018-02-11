import React from 'react';
import Autocomplete from './Autocopmlete';
import suggestService from '../services/suggest';

const describeBook = b => `${b.item.title} by ${b.item.author}, ${b.item.year}`;

const Highlight = ({ text, range }) => {
  if (!range) {
    return <span>{text}</span>;
  }
  return (<span>
    {text.slice(0, range[0])}
    <b>{text.slice(range[0], range[1] + 1)}</b>
    {text.slice(range[1] + 1)}
  </span>); 
};

const Item = ({ item }) => {
  const field = key => (<Highlight
    text={item.item[key]}
    range={key === item.highlight.key ? item.highlight.range : null}
  />);
  return (<div>
    {field('title')} by {field('author')}, {item.item.year}
  </div>);
};

export default class BookSelector extends React.Component {
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
    const { fallback } = this.props;
    
    const found = suggestService.cache[search];
    const useFallback = fallback && (!found || found.length === 0);
    const itemsTitle = useFallback ? 'Nothing found, try our suggestions:' : null;
    const items = useFallback ? suggestService.popular : found;

    return <div className="showcase-block">
      <Autocomplete
        value={search}
        items={items}
        itemsTitle={itemsTitle}
        loading={suggestService.loading[search]}
        suggest={qs => this.search(qs)}
        onSubmit={qs => this.setState({ submitted: qs })}
        getText={describeBook}
        Item={Item}
        {...this.props}
      />
      {(submitted != null) && <div className="search-results">
        Search results for {submitted}
      </div>}
    </div>;
  }
}
