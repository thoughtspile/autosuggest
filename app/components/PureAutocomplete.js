const stopEvent = fn => e => {
  e.stopPropagation();
  e.preventDefault();
  fn(e);
};

const emptyWarningTmpl = () => '<div>Nothing found</div>';

class PureAutocomplete {
  constructor(_element, props) {
    this.state = {
      activeHintIndex: -1,
      showHints: false
    };
    this.props = Object.assign({ items: [] }, props);

    this._element = _element;
    this._input = _element.getElementsByTagName('input')[0];
    this._input.autocomplete = 'off';
    this._input.spellcheck = 'off';
    this._inputWrapper = _element.getElementsByClassName('suggest__search')[0];

    this._element.addEventListener('submit', stopEvent(() => this.submitText(this._input.value)));
    this._input.addEventListener('focus', () => this.setState({ showHints: true }));
    this._input.addEventListener('mousedown', (e) => {
      this.setState({ showHints: !this.state.showHints });
    });
    this._input.addEventListener('keydown', (e) => this.handleKey(e));
    this._input.addEventListener('input', e => this.handleChange(e.target.value));

    this._popup = document.createElement('div');
    this._popup.className = 'suggest__popup';
    this._content = document.createElement('div');
    this._content.className = 'suggest__content';
    this._popup.appendChild(this._content);
    this._itemList = document.createElement('ul');
    this._itemList.className = 'suggest__items';
    this._content.appendChild(this._itemList);
    this._element.appendChild(this._popup);

    this.render();
  }

  handleChange(qs) {
    this.props.value = qs;
    this.props.loadOptions(qs).then((items = []) => {
      if (qs !== this.props.value) return;

      this.props.items = items;
      this.render();
    });
  }

  setState(patch) {
    Object.assign(this.state, patch);
    this.render();
  }

  applyHint(index, submit) {
    const item = this.props.items[index];
    this._input.value = this.props.getText(item);
    if (submit) {
      this.submitItem(item);
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

  render() {
    const { value, suggest, items = [], fallback, inputProps, Item, itemsTitle } = this.props;
    const { showHints, activeHintIndex } = this.state;
    const hintsVisible = showHints && (items.length > 0 || value);

    this._inputWrapper.className = ['suggest__search', hintsVisible ? 'suggest__search--active' : ''].join(' ');
    this._popup.style.display = hintsVisible ? null : 'none';
    this._itemList.innerHTML = '';

    if (showHints) {
      if (items.length === 0 && value)  {
        const el = document.createElement('li');
        el.className = 'suggest-item suggest-item--empty';
        el.innerHTML = 'No items found';
        this._itemList.appendChild(el);
      }
      if (itemsTitle) {
        const el = document.createElement('li');
        el.className = 'suggest-item suggest-item--empty';
        el.innerHTML = itemsTitle;
        this._itemList.appendChild(el);
      }
      items.forEach((item, i) => {
        const el = document.createElement('li');
        el.className = 'suggest-item';
        if (activeHintIndex === i) {
          el.className += ' suggest-item--selected';
        }
        el.addEventListener('mouseenter', () => this.activateHint(i));
        el.addEventListener('mouseup', () => this.applyHint(i, true));
        el.innerHTML = `<span class="suggest-item__text">
          ${this.props.itemTemplate(item)}
        </span>`;
        this._itemList.appendChild(el);
      });
    }
  }
}

export default PureAutocomplete;