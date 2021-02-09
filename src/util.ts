import { dim } from 'kleur';

export enum Action {
  abort = 'abort',
  delete = 'delete',
  up = 'up',
  down = 'down',
  submit = 'submit',
  keypress = 'keypress',
}

export interface Key {
  ctrl: boolean;
  meta: boolean;
  name: string;
}

type MatchedIndex = [number, number];

export function getAction(key: Key): Action | void {
  if (key.meta) return;

  if (key.ctrl) {
    if (key.name === 'c') return Action.abort;
  }

  if (key.name === 'backspace') return Action.delete;
  if (key.name === 'up') return Action.up;
  if (key.name === 'down') return Action.down;
  if (key.name === 'return') return Action.submit;

  return Action.keypress;
}

export function getScrollPosition(
  cursor: number | null,
  total: number,
  limit: number
): [number, number] {
  const isInitialRender = cursor === null;
  const hasEnoughHeight = limit >= total;
  const halfScreenIndex = Math.floor(limit / 2);

  if (isInitialRender || hasEnoughHeight || (cursor as number) <= halfScreenIndex) {
    return [0, limit];
  }

  const startIndex = (cursor as number) - halfScreenIndex;
  const endIndex = startIndex + limit;

  if (endIndex > total) {
    return [total - limit, total];
  }

  return [startIndex, endIndex];
}

// purposely avoided using the `regexp.exec` method to extract start, end indexes
export function getMatchedIndexes(label = '', input = ''): [] | MatchedIndex[] {
  const regexp = new RegExp(input, 'ig');
  const matches = label.match(regexp) || [];

  if (matches.length === 0) return [];

  const indexes: MatchedIndex[] = [];
  let startIndex;
  let position: undefined | number;

  matches.forEach(match => {
    startIndex = label.indexOf(match, position === undefined ? 0 : position);

    indexes.push([startIndex, startIndex + match.length]);

    // next start position
    position = startIndex + 1;
  });

  return indexes;
}

export function dimUnmatchedStrings(
  label = '',
  matchedIndexes: [] | MatchedIndex[]
): string {
  if (matchedIndexes.length === 0) return label;

  const matches = [];
  let previousEnd = 0;

  (matchedIndexes as MatchedIndex[]).forEach(([start, end]) => {
    if (start !== previousEnd) {
      // unmatched string
      matches.push(dim(label.slice(previousEnd, start)));
    }

    // matched string
    matches.push(label.slice(start, end));
    previousEnd = end;
  });

  // remaining unmatched strings
  const [, end] = matchedIndexes[matchedIndexes.length - 1];
  if (end < label.length) {
    matches.push(dim(label.slice(end)));
  }

  return matches.join('');
}
