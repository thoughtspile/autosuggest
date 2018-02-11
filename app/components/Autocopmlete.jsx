import React from 'react';
import withClickOutside from 'react-click-outside';


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

const stopEvent = fn => e => {
  e.stopPropagation();
  e.preventDefault();
  fn(e);
};

const EmptyWarning = () => <div>Nothing found</div>;

class Autocomplete extends React.PureComponent {
  constructor(p, c) {
    super(p, c);
    this.state = {
      activeHintIndex: -1,
      showHints: false
    };
  }

  disableHints() {
    this.setState({ showHints: false });
  }

  applyHint(index, submit) {
    const item = this.props.items[index];
    this.props.suggest(this.props.getText(item));
    this.setState({ showHints: false });
    if (submit) {
      this.submitItem(item);
    }
  }

  activateHint(index) {
    this.setState({ activeHintIndex: index % this.props.items.length });
  }

  submitItem(item) {
    this.props.onSubmit(this.props.getText(item), item);
  }

  handleKey(e) {
    const { activeHintIndex } = this.state;
    const opCount = this.props.items.length;

    if (e.key === "ArrowDown") {
      this.activateHint(activeHintIndex + 1);
      e.stopPropagation();
    } else if (e.key === "ArrowUp") {
      this.activateHint(activeHintIndex === -1 ? opCount - 1 : activeHintIndex - 1);
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "Enter") {
      if (this.state.showHints) {
        this.applyHint(activeHintIndex, true);
      } else {
        this.props.onSubmit(this.props.value);
      }
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "Escape" && this.hintsActive()) {
      this.activateHint(-1);
      e.stopPropagation();
    } else {
      this.setState({ showHints: true });
    }
  }

  handleClickOutside() {
    this.setState({ showHints: false });
  }

  render() {
    const { value, suggest, items = [], fallback, isLoading, onSubmit } = this.props;
    const { showHints, activeHintIndex } = this.state;

    return (<form className="suggest" onSubmit={stopEvent(() => onSubmit(this.props.value, null))}>
      <div className={['suggest__search', showHints ? 'suggest__search--active' : ''].join(' ')}>
        <input
          className='suggest__search__input'
          value={value}
          onChange={e => suggest(e.target.value)}
          onFocus={() => this.setState({ showHints: true })}
          onKeyUp={e => this.handleKey(e)} />
        <button className="suggest__search__submit">
          Search
        </button>
      </div>
      <div className="popup__content">
        {showHints && (<div className="suggest__content">
          <ul className="suggest__items">
            {(items.length === 0 && !isLoading) && (<li key="$empty" className="suggest-item suggest-item--empty">
              <EmptyWarning />
            </li>)}
            {items.map((item, i) => (
              <li
                key={item.item.id}
                className={["suggest-item", activeHintIndex === i ? 'suggest-item--selected' : ''].join(' ')}
                onMouseEnter={() => this.activateHint(i)}
                onClick={stopEvent(() => this.applyHint(i, true))}
              >
                <span className="suggest2-item__text">
                  <Item item={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>)}
      </div>
    </form>);
  }
}

Autocomplete.defaultProps = {
  items: [],
  value: ''
};

export default withClickOutside(Autocomplete);