import { autoComplete } from '../src';

const list = [
  { value: 100, label: '100' },
  { value: 200, label: '200' },
  { value: 300, label: '300' },
];

autoComplete({
  list,
  onSubmit: matches => matches.map(match => match.label),
})
  .then(results => {
    console.log(results);
  })
  .catch((error: Error) => {
    console.error(error);
  });

// this.message = dim(' filter ›');

// renderOption({ label }, isFocused, isStart, isEnd) {
//   const prefix = dim('›');
//   const scrollIndicator = isStart ? ' ↑' : isEnd ? ' ↓' : '';
//   const content = isFocused ? bgYellow().black(label) : highlight(this.input, label);
//
//   return ` ${prefix}${scrollIndicator} ${content}`;
// }

// formatBody(body) {
//     return `\n${body || 'No matches found'}`;

// if (this.filteredList.length && this.filteredList.length > this.limit) {
//   this.outputText += `\n\n ${gray(`Matched ${this.filteredList.length} files`)}`;
// }
// }

// suggestion(item) {
//     // if (this.input === '') return true;
//
//     return mm.contains(item.label, this.input);
//
//
//
//     return item.label.includes(this.input);
// }

// export function highlight(input = '', label = ''): string {
//     input = input.trim();
//     if (input.length === 0) return dim(label);
//
//     // by default, it's a white color text.
//     if (isGlob(input)) return label;
//
//     const matchedIndexes = getMatchedIndexes(label, input);
//     if (matchedIndexes.length === 0) return dim(label);
//
//     return dimUnmatchedStrings(label, matchedIndexes);
// }
