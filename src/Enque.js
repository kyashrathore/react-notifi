import { notifier } from './notifier';

let __snackId = 1e9;

export class EnqueNotifi {
  constructor(p) {
    // not destructuring - avoiding es6 as much as I can because it increases bundle size.
    const props = p || {};

    Object.assign(this, props, {
      _wrapper: props.wrapper,
      _maxSnack: props.maxSnack || 3,
      _position: props.position || 'bottomLeft',
      _autoHideDuration: props.autoHideDuration || 3e3,
      _snacks: [],
      _queue: [],
      _timer: null,
    });
  }

  close(id) {
    // user action - don't wait for timeout remove oldest
    clearTimeout(this._timer);
    this._hideSnack(id);
  }

  enqueue(message, o) {
    clearTimeout(this._timer);
    let options = o || {};
    if (options.preventDuplicate && this._snacks.find(s => s.id === options.id)) return;
    const id = options.id || ++__snackId;
    const currentSnack = Object.assign(options, {
      id,
      _message: message,
      _position: options.position || this._position,
      _wrapper: this._wrapper,
      close: () => this.close(id),
    });
    if (this._snacks.length < this._maxSnack) {
      this._snacks.push(currentSnack);
    } else {
      this._queue.push(currentSnack);
      this._hideOldest();
    }
    this._syncWithReact();
    this._tick();
  }

  _hideOldest() {
    const oldest = this._snacks[0];
    if (oldest) {
      this._hideSnack(oldest.id);
    } else {
      //sync the state to react after last snack's detach call.
      this._syncWithReact();
    }
  }
  _hideSnack(id) {
    // return if any snack is detaching(transitioning)
    if (this._snacks.filter(s => s.open === false).length) return;
    this._snacks = this._snacks.map(snack => {
      if (snack.id === id) {
        return Object.assign(snack, {
          // don't remove the snack from state (delay unmounting for exit animation),
          // just indicate the snack itself that you
          // gonna be fired soon better transit out on your on.
          open: false,
          // when done transitioning snack can remove itself by calling this function
          _detach: () => {
            this._snacks = this._snacks.filter(snack => snack.id !== id);
            this._proceedQueue();
          },
        });
      }
      return snack;
    });
    this._syncWithReact();
  }

  _proceedQueue() {
    if (this._queue.length && this._snacks.length < this._maxSnack) {
      const nextFromQueue = this._queue.shift();
      this._snacks.push(nextFromQueue);
    }
    this._syncWithReact();

    clearTimeout(this._timer);
    // since this is the last function called
    // lets start the timer
    this._tick();
  }
  _tick() {
    this._timer = setTimeout(() => this._hideOldest(), this._autoHideDuration);
  }
  _syncWithReact() {
    notifier._dispatch(this._snacks);
  }
}
