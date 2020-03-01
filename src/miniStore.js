export const notifier = createStore((state, action) => action);

export function createStore(reducer) {
  let state = reducer(undefined, {});
  const subscribers = {};
  let index = 0;
  return {
    dispatch(action) {
      state = reducer(state, action);
      Object.keys(subscribers).forEach(key => subscribers[key](state));
    },
    subscribe(cb) {
      // create closure for return function
      const i = ++index;
      subscribers[i] = cb;
      return () => {
        delete subscribers[i];
      };
    }
  };
}
