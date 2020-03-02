import React, { useState, useEffect } from "react";
import SlideAnimation from "./Slide";
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
export function PositionContainer({ dir, className, children }) {
  return (
    <div key={dir} className={className}>
      {children}
    </div>
  );
}
export function Notifi() {
  const [snacks, setSnacks] = useState([]);
  const getToRenderSnacks = () => {
    const categ = snacks.reduce((acc, current) => {
      const category = current.position;
      const existingOfCategory = acc[category] || [];
      return {
        ...acc,
        [category]: [...existingOfCategory, current]
      };
    }, {});

    return Object.entries(categ).map(([position, snacks]) => {
      const vPos = position.includes("top") ? "top" : "bottom";

      const hPos = position.includes("Left")
        ? "left"
        : position.includes("Center")
        ? "center"
        : "right";

      return (
        <PositionContainer
          key={vPos + hPos}
          className={`nt-ctnr nt-${vPos} nt-${hPos}`}
        >
          {snacks.map(snack => (
            <SlideAnimation
              key={snack.key}
              hPos={hPos}
              vPos={vPos}
              {...snack}
            />
          ))}
        </PositionContainer>
      );
    });
  };

  useEffect(() => {
    return notifier.subscribe(s => {
      setSnacks([...s]);
    });
  }, []);

  return getToRenderSnacks();
}
