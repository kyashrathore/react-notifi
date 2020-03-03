import { notifier } from "./Notifi";
let __snackId = 1234566543100;
export class EnqueNotifi {
  constructor(p) {
    const props = p || {};
    this._props = props;
    this._props.wrapper = props.wrapper;
    this._props._maxSnack = props.maxSnack || 3;
    this._props.position = props.position || "bottomLeft";
    this._autoHideDuration = this._props.autoHideDuration || 3000;
    this._snacks = [];
    this._queue = [];
    this._resumedHiding = [];
    this._timer = null;
  }

  close(id) {
    clearTimeout(this._timer);
    this._hideSnack(id);
  }

  enqueue(message, o) {
    let options = o || {};
    // clear timeout which keep going on to hide noti every 3 seconds(or given time) on user action
    clearTimeout(this._timer);
    if (
      options.preventDuplicate &&
      this._snacks.find(s => s.id === options.id)
    )
      return;
    const id = options.id || ++__snackId;
    const currentSnack = {
      id,
      _message: message,
      position: this._props.position,
      wrapper: this._props.wrapper,
      ...options
    };
    if (this._snacks.length < this._props._maxSnack) {
      this._snacks.push(currentSnack);
    } else {
      this._queue.push(currentSnack);
      this._hideOldest();
    }
    this._dispatch();
    this._tick();
  }

  _hideOldest() {
    const oldest = this._snacks[0];

    if (oldest) {
      this._hideSnack(oldest.id);
    } else {
      //no snack left update last detached update
      this._dispatch();
    }
  }
  _hideSnack(id) {
    // return if any snack is detaching(transitioning)
    if (this._snacks.filter(s => s.open === false).length) {
      this._resumedHiding.push(id);
      return;
    }
    this._snacks = this._snacks.map(snack => {
      if (snack.id === id) {
        return {
          ...snack,
          detach: () => {
            this._snacks = this._snacks.filter(snack => snack.id !== id);
            this._proceedQueue();
          },
          open: false
        };
      }
      return snack;
    });
    this._dispatch();
  }

  _proceedQueue() {
    if (this._queue.length && this._snacks.length < this._props._maxSnack) {
      const nextFromQueue = this._queue.shift();
      this._snacks.push(nextFromQueue);
      this._dispatch();
    }
    clearTimeout(this._timer);
    // since this is going to last function called lets start the timer
    this._tick();
  }
  _tick() {
    this._timer = setTimeout(() => this._hideOldest(), this._autoHideDuration);
  }
  _dispatch() {
    notifier.dispatch(this._snacks);
  }
}
