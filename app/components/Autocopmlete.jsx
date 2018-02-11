import React from 'react';
import withClickOutside from 'react-click-outside';

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

  applyHint(index, submit) {
    const item = this.props.items[index];
    this.props.suggest(this.props.getText(item));
    if (submit) {
      this.submitItem(item);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items[0] && this.state.activeHintIndex < 0) {
      this.setState({ activeHintIndex: 0 });
    }
  }

  activateHint(index) {
    this.setState({ activeHintIndex: index % this.props.items.length });
  }

  submitItem(item) {
    this.setState({ showHints: false });
    this.props.onSubmit(this.props.getText(item), item);
  }

  submitText(text) {
    this.setState({ showHints: false });
    this.props.onSubmit(text, null);
  }

  handleKey(e) {
    const { activeHintIndex, showHints } = this.state;
    const opCount = this.props.items.length;

    if (e.key === 'ArrowDown') {
      this.setState({ showHints: true });
      this.activateHint(activeHintIndex + 1);
      e.stopPropagation();
    } else if (e.key === 'ArrowUp') {
      this.setState({ showHints: true });
      this.activateHint(activeHintIndex === -1 ? opCount - 1 : activeHintIndex - 1);
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === 'Enter') {
      if (showHints && activeHintIndex >= 0) {
        this.applyHint(activeHintIndex, true);
      } else {
        this.submitText(this.props.value);
      }
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === 'Escape') {
      if (showHints) {
        this.setState({ showHints: false });
        e.stopPropagation();
      }
    } else if (e.key === 'Tab') {
      if (showHints) {
        this.setState({ showHints: false });
        e.stopPropagation();
      }
    } else {
      this.setState({ showHints: true });
    }
  }

  handleClickOutside() {
    this.setState({ showHints: false });
  }

  render() {
    const { value, suggest, items = [], fallback, inputProps, Item, itemsTitle } = this.props;
    const { showHints, activeHintIndex } = this.state;
    const hintsVisible = showHints && (items.length > 0 || value);
    const onSubmit = stopEvent(() => (showHints && activeHintIndex >= 0)
      ? this.applyHint(activeHintIndex, true)
      : this.submitText(value));

    return (<form className="suggest" onSubmit={onSubmit}>
      <div className={['suggest__search', hintsVisible ? 'suggest__search--active' : ''].join(' ')}>
        <input
          className='suggest__search__input'
          value={value}
          onChange={e => suggest(e.target.value)}
          onFocus={() => this.setState({ showHints: true })}
          onMouseDown={() => this.setState({ showHints: !showHints })}
          onKeyDown={e => this.handleKey(e)} 
          {...inputProps} />
        <button className="suggest__search__submit">
          Search
        </button>
      </div>
      {hintsVisible && (<div className="suggest__popup">
        <div className="suggest__content">
          <ul className="suggest__items">
            {(items.length === 0 && value) && (
              <li key="$empty" className="suggest-item suggest-item--empty">
                <EmptyWarning />
              </li>
            )}
            {(itemsTitle) && (
              <li key="$title" className="suggest-item suggest-item--empty">
                {itemsTitle}
              </li>
            )}
            {items.map((item, i) => (
              <li
                key={item.item.id}
                className={['suggest-item', activeHintIndex === i ? 'suggest-item--selected' : ''].join(' ')}
                onMouseEnter={() => this.activateHint(i)}
                onClick={stopEvent(() => this.applyHint(i, true))}
              >
                <span className="suggest2-item__text">
                  <Item item={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>)}
    </form>);
  }
}

const EMPTY_A = [];
const EMPTY_O = {};
Autocomplete.defaultProps = {
  items: EMPTY_A,
  inputProps: EMPTY_O,
  value: ''
};

export default withClickOutside(Autocomplete);