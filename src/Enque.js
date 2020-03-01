import { notifier } from "./miniStore";
let __snackId = 1234566543100;
export class EnqueNotifi {
  constructor(p) {
    const props = p || {};
    this.props = props;
    this.props._maxToast = props.maxToast || 3;
    this.props.position = props.position || "bottomLeft";
    this._autoHideDuration = this.props.autoHideDuration || 3000;
    this._snacks = [];
    this._queue = [];
    this._timer = null;
  }

  close(key) {
    clearTimeout(this._timer);
    this._hideSnack(key);
  }
  enqueue(message, o) {
    const options = o || {};
    // clear timeout which keep going on to hide noti every 3 seconds(or given time) on user action
    clearTimeout(this._timer);
    if (
      options.preventDuplicate &&
      this._snacks.find(s => s.key === options.key)
    )
      return;
    const key = options.key || ++__snackId;
    const currentSnack = {
      key,
      _message: message,
      position: this.props.position,
      ...options
    };
    if (this._snacks.length < this.props._maxToast) {
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
    if (oldest) this._hideSnack(oldest.key);
  }
  _hideSnack(key) {
    // return if any snack is detaching(transitioning)
    if (this._snacks.filter(s => s.open === false).length) return;
    this._snacks = this._snacks.map(snack => {
      if (snack.key === key) {
        return {
          ...snack,
          detach: () => {
            this._snacks = this._snacks.filter(snack => snack.key !== key);
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
    if (this._queue.length && this._snacks.length < this.props._maxToast) {
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
