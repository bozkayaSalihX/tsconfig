import cp from 'child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'readline';

type Color = 'yellow' | 'blue' | 'green' | 'cyan' | 'red' | 'magenta';
interface Opts {
  question: string;
  options: string[];
  answers: string[];
  pointer: string;
  color: Color;
}

class Select {
  private opts: Opts;
  private input: number;
  private _color: Color;
  private cursorLocs: {
    x: number;
    y: number;
  };
  constructor(
    opts: Opts = {
      question: '',
      options: [],
      answers: [],
      pointer: '>',
      color: 'blue',
    }
  ) {
    this.opts = opts;
    this.cursorLocs = { x: 0, y: 0 };
    this._color = opts.color;
    this.input = 0;
  }

  public start() {
    process.stdout.write(this.opts.question + '\n');
    for (let opt = 0; opt < this.opts.options.length; opt++) {
      this.opts.options[opt] = this.opts.pointer + ' ' + this.opts.options[opt];

      this.opts.options[opt] += '\n';
      if (opt === 0) {
        this.input = 0;
        process.stdout.write(this.color(this.opts.options[opt], this._color));
      } else {
        process.stdout.write(this.opts.options[opt]);
      }
      this.cursorLocs.y = opt + 1;
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');
    this.hideCursor();
    process.stdin.on('data', this.pn(this));
  }

  private hideCursor() {
    process.stdout.write('\x1B[?25l'); // for the hiding cursor;
  }

  private pn(self: Select) {
    return (command: string) => {
      switch (command) {
        case '\u0004': // ctrl-D;
        case '\r':
        case '\n':
          return self.enter();
        case '\u0003': // ctrl-C;
          return self.ctrlc();
        case '\u001b[A':
          return self.upArrow();
        case '\u001b[B':
          return self.downArrow();
      }
    };
  }

  private upArrow() {
    let y = this.cursorLocs.y;
    readline.cursorTo(process.stdout, 0, y + 1);
    process.stdout.write(this.opts.options[y - 1]);
    if (this.cursorLocs.y == 1) {
      // on the first option
      this.cursorLocs.y = this.opts.options.length;
    } else {
      this.cursorLocs.y--;
    }
    y = this.cursorLocs.y;
    readline.cursorTo(process.stdout, 0, y + 1);
    process.stdout.write(this.color(this.opts.options[y - 1], this._color));
    this.input = y - 1;
  }

  private downArrow() {
    let y = this.cursorLocs.y;
    readline.cursorTo(process.stdout, 0, y + 1);
    process.stdout.write(this.opts.options[y - 1]);
    if (this.cursorLocs.y === this.opts.options.length) {
      // on the last one
      this.cursorLocs.y = 1;
    } else {
      this.cursorLocs.y++;
    }
    y = this.cursorLocs.y;
    readline.cursorTo(process.stdout, 0, y + 1);
    process.stdout.write(this.color(this.opts.options[y - 1], this._color));
    this.input = y - 1;
  }

  private color(str: string, colorName: Color = 'yellow') {
    const colors = {
      yellow: [33, 89],
      blue: [34, 89],
      green: [32, 89],
      cyan: [35, 89],
      red: [31, 89],
      magenta: [36, 89],
    };

    const _color = colors[colorName];
    const start = '\x1b[' + _color[0] + 'm';
    const stop = '\x1b[' + _color[1] + 'm\x1b[0m';
    return start + str + stop;
  }

  private enter() {
    process.stdin.removeListener('data', this.pn);
    process.stdin.setRawMode(false);
    process.stdin.pause();
    this.showCursor();
    readline.cursorTo(process.stdout, 0, this.opts.options.length + 1);
    const answer = this.opts.answers[this.input];
    this.configs(answer);
  }

  private ctrlc() {
    process.stdin.removeListener('data', this.pn);
    process.stdin.setRawMode(false);
    process.stdin.pause();
    this.showCursor();
  }

  private showCursor() {
    // that code will show the cursor;
    process.stdout.write('\x1B[?25h');
  }

  private rootDir() {
    const cmd = 'git rev-parse --show-toplevel';
    const dir = cp.execSync(cmd, { encoding: 'utf-8' });
    return dir.replace(/\n|\r/, '');
  }

  private configs(answer: string, dir = './configs') {
    const configDir = path.resolve(__dirname, dir);
    const parentPath = this.rootDir();
    try {
      const files = fs.readdirSync(configDir, {
        encoding: 'utf-8',
        withFileTypes: true,
      });
      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx];
        if (file.isFile()) {
          const type = file.name.split('.')[0];
          if (type == answer) {
            try {
              fs.unlinkSync(path.resolve(parentPath, 'tsconfig.json'));
              const data = fs.readFileSync(path.resolve(configDir, file.name), {
                encoding: 'utf-8',
              });
              fs.writeFileSync(
                path.resolve(parentPath, 'tsconfig.json'),
                data,
                'utf-8'
              );
              break;
            } catch (err) {
              throw new Error(JSON.stringify(err));
            }
          }
        }
      }
    } catch (err) {
      console.log('error', err);
      throw new Error(JSON.stringify(err));
    }
  }
}

const select = new Select({
  question: 'Choose type of configuration ?',
  options: ['Node', 'React', 'React Native'],
  answers: ['node', 'react', 'react_native'],
  pointer: '->',
  color: 'blue',
});

select.start();
