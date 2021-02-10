import {
  eraseLine,
  cursorLeft,
  cursorUp,
  cursorForward,
  eraseLines,
  cursorDown,
} from 'ansi-escapes';
import { bgYellow, dim } from 'kleur';
import stripAnsi from 'strip-ansi';

import { Prompt } from './Prompt';
import { getScrollPosition, getMatchedIndexes, dimUnmatchedStrings } from './util';

const identity = <T>(item: T) => item;

interface ListItem {
  label: string;
  value: unknown;
}

export interface AutocompleteOptions {
  list?: ListItem[];
  limit?: number;
  onSubmit?: (matches: ListItem[]) => unknown;
  promptLabel?: string;
}

export class Autocomplete extends Prompt {
  input: string;
  firstRender: boolean;
  cursor: number;
  focusedItemIndex: number | null;
  filteredList: ListItem[];
  outputText: string;

  // options
  list: ListItem[];
  limit: number;
  promptLabel: string;
  onSubmit?: AutocompleteOptions['onSubmit'];

  constructor(options: AutocompleteOptions = {}) {
    super();

    // init options
    this.list = options.list || [];
    this.limit = options.limit || 10;
    this.promptLabel = options.promptLabel || 'filter › ';
    this.onSubmit = options.onSubmit;

    this.input = '';
    this.firstRender = true;
    this.cursor = 0;
    this.focusedItemIndex = null;
    this.filteredList = [];
    this.outputText = '';

    // to pass following methods as a callback
    this.suggestion = this.suggestion.bind(this);
    this.renderOption = this.renderOption.bind(this);

    this.render();
  }

  keypress(str?: string): void {
    if (typeof str === 'undefined') return;

    this.input += str;
    this.cursor++;

    this.resetFocusedItem();
    this.render();
  }

  delete(): void {
    // To prevent deleting the prompt message.
    if (this.cursor === 0) return this.bell();

    this.cursor--;
    this.input = this.input.slice(0, this.cursor);

    this.resetFocusedItem();
    this.render();
  }

  down(): void {
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

  up(): void {
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

  submit(): void {
    const matches = Number.isInteger(this.focusedItemIndex)
      ? [this.filteredList[this.focusedItemIndex as number]]
      : this.filteredList;

    if (!matches.length) {
      this.bell();
      return;
    }

    this.emit(
      'submit',
      typeof this.onSubmit === 'function' ? this.onSubmit(matches) : matches
    );

    this.cleanup();
  }

  resetFocusedItem(): void {
    this.focusedItemIndex = null;
  }

  updateFilterList(): void {
    if (this.input === '') {
      this.filteredList = this.list.map(identity);
    } else {
      this.filteredList = this.list.filter(this.suggestion);
    }
  }

  highlight(input = '', label = ''): string {
    input = input.trim();
    if (input.length === 0) return dim(label);

    const matchedIndexes = getMatchedIndexes(label, input);
    if (matchedIndexes.length === 0) return dim(label);

    return dimUnmatchedStrings(label, matchedIndexes);
  }

  renderOption(
    { label }: ListItem,
    isFocused: boolean,
    isStart: boolean,
    isEnd: boolean
  ): string {
    const scrollIndicator = isStart ? '↑ ' : isEnd ? '↓ ' : '';
    const content = isFocused
      ? bgYellow().black(label)
      : this.highlight(this.input, label);

    return `${scrollIndicator}${content}`;
  }

  suggestion(item: ListItem): boolean {
    return item.label.includes(this.input);
  }

  formatBody(body: string): string {
    return `\n${body || 'No matches found'}`;
  }

  render(): void {
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
      .map((item, index: number) => {
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
