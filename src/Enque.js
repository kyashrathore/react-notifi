import { notifier } from "./miniStore";

let __snackId = 1234566543100;

export class EnqueNotifi {
  constructor(p) {
    // not destructuring - avoiding es6 as much as I can because it increases bundle size.
    const props = p || {};
    // all underscore prefixed properties can be minified,
    // we can use that for all private properties
    this._props = props;
    this._props._wrapper = props.wrapper;
    this._props._maxSnack = props.maxSnack || 1;
    this._props._position = props.position || "bottomLeft";
    this._autoHideDuration = this._props.autoHideDuration || 3000;
    this._snacks = [];
    this._queue = [];
    this._timer = null;
  }

  close(id) {
    // user action - don't wait for timeout remove oldest
    clearTimeout(this._timer);
    this._hideSnack(id);
  }

  enqueue(message, o) {
    clearTimeout(this._timer);
    let options = o || {};
    if (options.preventDuplicate && this._snacks.find(s => s.id === options.id))
      return;
    const id = options.id || ++__snackId;
    const currentSnack = {
      ...options,
      id,
      _message: message,
      _position: options.position || this._props._position,
      _wrapper: this._props._wrapper,
      close: () => this.close(id)
    };
    if (this._snacks.length < this._props._maxSnack) {
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
        return {
          ...snack,
          // don't remove the snack from state (delay unmounting for exit animation),
          // just indicate the snack itself that you
          // gonna be fired soon better transit out on your on.
          open: false,
          // when done transitioning snack can remove itself by calling this function
          // changed state can be synced to react in any next update
          detach: () => {
            this._snacks = this._snacks.filter(snack => snack.id !== id);
            this._proceedQueue();
          }
        };
      }
      return snack;
    });
    this._syncWithReact();
  }

  _proceedQueue() {
    if (this._queue.length && this._snacks.length < this._props._maxSnack) {
      const nextFromQueue = this._queue.shift();
      this._snacks.push(nextFromQueue);
      this._syncWithReact();
    }
    clearTimeout(this._timer);
    // since this is the last function called
    // lets start the timer
    this._tick();
  }
  _tick() {
    this._timer = setTimeout(() => this._hideOldest(), this._autoHideDuration);
  }
  _syncWithReact() {
    notifier.dispatch(this._snacks);
  }
}
