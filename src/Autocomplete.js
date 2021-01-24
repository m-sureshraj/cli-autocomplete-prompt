const {
  eraseLine,
  cursorLeft,
  cursorUp,
  cursorForward,
  eraseLines,
  cursorDown
} = require('ansi-escapes');
const stripAnsi = require('strip-ansi');
const { bgYellow, dim } = require('kleur');

const Prompt = require('./Prompt');
const { getScrollPosition, getMatchedIndexes, dimUnmatchedStrings } = require('./util');

const identity = item => item;

class Autocomplete extends Prompt {
  constructor(options = {}) {
    super(options);

    // options
    this.list = options.list || [];
    this.limit = options.limit || 10;
    this.onSubmit = typeof options.onSubmit === 'function' ? options.onSubmit : identity;
    this.promptLabel = options.promptLabel || 'filter › ';

    this.input = '';
    this.firstRender = true;
    this.cursor = 0;
    this.focusedItemIndex = null;
    this.filteredList = [];

    // to pass following methods as a callback
    this.suggestion = this.suggestion.bind(this);
    this.renderOption = this.renderOption.bind(this);

    this.render();
  }

  onKeypress(str) {
    if (typeof str === 'undefined') return;

    this.input += str;
    this.cursor++;

    this.resetFocusedItem();
    this.render();
  }

  delete() {
    // To prevent deleting the prompt message.
    if (this.cursor === 0) return this.bell();

    this.cursor--;
    this.input = this.input.slice(0, this.cursor);

    this.resetFocusedItem();
    this.render();
  }

  down() {
    // do nothing when the filtered list is empty
    if (!this.filteredList.length) return;

    // do nothing when the last element is focused
    if (this.focusedItemIndex === this.filteredList.length - 1) return;

    if (this.focusedItemIndex === null) {
      this.focusedItemIndex = 0;
    } else {
      this.focusedItemIndex++;
    }

    this.render();
  }

  up() {
    // do nothing when there is no focused item, or when the filtered list is empty
    if (this.focusedItemIndex === null || this.filteredList.length === 0) return;

    // reset the focus when the first item is focused
    if (this.focusedItemIndex === 0) {
      this.resetFocusedItem();
    } else {
      this.focusedItemIndex--;
    }

    this.render();
  }

  submit() {
    const matches = Number.isInteger(this.focusedItemIndex)
      ? [this.filteredList[this.focusedItemIndex]]
      : this.filteredList;

    if (!matches.length) {
      this.bell();
      return;
    }

    this.emit('submit', this.onSubmit(matches));
    this.cleanup();
  }

  resetFocusedItem() {
    this.focusedItemIndex = null;
  }

  updateFilterList() {
    if (this.input === '') {
      this.filteredList = this.list.map(identity);
    } else {
      this.filteredList = this.list.filter(this.suggestion);
    }
  }

  highlight(input = '', label = '') {
    input = input.trim();
    if (input.length === 0) return dim(label);

    const matchedIndexes = getMatchedIndexes(label, input);
    if (matchedIndexes.length === 0) return dim(label);

    return dimUnmatchedStrings(label, matchedIndexes);
  }

  renderOption({ label }, isFocused, isStart, isEnd) {
    const scrollIndicator = isStart ? '↑ ' : isEnd ? '↓ ' : '';
    const content = isFocused ? bgYellow().black(label) : this.highlight(this.input, label);

    return `${scrollIndicator}${content}`;
  }

  suggestion(item) {
    return item.label.includes(this.input);
  }

  formatBody(body) {
    return `\n${body || 'No matches found'}`;
  }

  render() {
    if (!this.firstRender) {
      // clear the previous output
      const rows = this.outputText.split('\n').length;
      this.out.write(cursorDown(rows) + eraseLines(rows + 1));
    }

    this.updateFilterList();

    const [startIndex, endIndex] = getScrollPosition(
      this.focusedItemIndex,
      this.filteredList.length,
      this.limit
    );

    const header = `${this.promptLabel}${this.input}`;

    const suggestions = this.filteredList
      .slice(startIndex, endIndex)
      .map((item, index) => {
        return this.renderOption(
          item,
          this.focusedItemIndex === index + startIndex,
          index === 0 && startIndex > 0,
          index + startIndex === endIndex - 1 && endIndex < this.filteredList.length
        );
      })
      .join('\n');

    const body = this.formatBody(suggestions);
    this.outputText = header + body;

    // calculate the cursor x,y position
    const headerLength = stripAnsi(header).length;
    let cursorX = cursorLeft;
    if (headerLength) {
      cursorX += cursorForward(headerLength);
    }

    const cursorY = cursorUp(body.split('\n').length - 1);

    this.out.write(eraseLine + cursorLeft + this.outputText + cursorX + cursorY);

    this.firstRender = false;
  }
}

module.exports = Autocomplete;
