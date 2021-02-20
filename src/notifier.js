export const notifier = createNotifier();

export function createNotifier() {
  const subscribers = {};
  let index = 0;
  return {
    _dispatch(state) {
      Object.keys(subscribers).forEach(key => subscribers[key](state));
    },
    _subscribe(cb) {
      // create closure for return function
      const i = ++index;
      subscribers[i] = cb;
      return () => {
        delete subscribers[i];
      };
    },
  };
}
