import { gray, dim, bgYellow } from 'kleur';
import mm from 'micromatch';
import isGlob from 'is-glob';

import {
  Autocomplete,
  ListItem,
  AutocompleteOptions,
  dimUnmatchedStrings,
  getMatchedIndexes,
} from '../../src';

export class JestStyleAutocomplete extends Autocomplete {
  constructor(options: AutocompleteOptions) {
    super(options);
  }

  suggestion(item: ListItem): boolean {
    if (this.input === '') return true;

    return mm.contains(item.label, this.input);
  }

  highlight(input = '', label = ''): string {
    input = input.trim();
    if (input.length === 0) return dim(label);

    // by default, it's a white color text.
    if (isGlob(input)) return label;

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
    const prefix = dim('›');
    const scrollIndicator = isStart ? ' ↑' : isEnd ? ' ↓' : '';
    const content = isFocused
      ? bgYellow().black(label)
      : this.highlight(this.input, label);

    return ` ${prefix}${scrollIndicator} ${content}`;
  }

  formatBody(suggestions: string): string {
    if (this.filteredList.length > this.limit) {
      const matchCountText = `\n\n ${gray(`Matched ${this.filteredList.length} files`)}`;

      return [suggestions, matchCountText].join('');
    }

    return `\n\n${suggestions || ' No matches found'}`;
  }
}
