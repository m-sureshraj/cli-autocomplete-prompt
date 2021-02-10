import EventEmitter from 'events';
import readline from 'readline';

import { cursorShow, beep } from 'ansi-escapes';

import { getAction, Action, Key } from './util';

type Stdin = typeof process.stdin;
type Stdout = typeof process.stdout;

interface PromptOptions {
  stdin?: Stdin;
  stdout?: Stdout;
}

export class Prompt extends EventEmitter {
  in: Stdin;
  out: Stdout;
  cleanup: () => void;

  constructor(options: PromptOptions = {}) {
    super();

    this.in = options.stdin || process.stdin;
    this.out = options.stdout || process.stdout;

    const rl = readline.createInterface({
      input: this.in,
    });
    readline.emitKeypressEvents(this.in, rl);

    if (this.in.isTTY) this.in.setRawMode?.(true);
    this.in.write(cursorShow);

    const keypress = (str: string, key: Key) => {
      const action = getAction(key);

      if (!action) {
        this.bell();
        return;
      }

      if (action === Action.keypress) {
        this.keypress(str);
      } else if (typeof this[action] === 'function') {
        // specific actions (submit, abort, ...)
        this[action]();
      }
    };

    this.cleanup = () => {
      this.in.removeListener('keypress', keypress);
      this.in.setRawMode?.(false);
      rl.close();
    };

    this.in.on('keypress', keypress);
  }

  keypress(_str: string): void {}

  delete(): void {}

  down(): void {}

  up(): void {}

  submit(): void {}

  abort(): void {
    this.cleanup();
    this.out.write('\n');
  }

  bell(): void {
    this.out.write(beep);
  }
}
