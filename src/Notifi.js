import React, { useState, useEffect } from "react";
import SlideAnimation from "./Slide";
import { notifier } from "./miniStore";
function PositionContainer({ dir, className, children }) {
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
              id={snack.key}
              hPos={hPos}
              vPos={vPos}
              open={snack.open}
              detach={snack.detach}
            >
              {snack._message}
            </SlideAnimation>
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
