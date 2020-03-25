import React, { useState } from "react";

const SlideAnimation = React.memo(function(props) {
  const { open, hPos, vPos, _wrapper, detach, _message, type, id } = props;
  const [state, setState] = useState("enter");
  const cref = React.useRef();

  const collapseExitStart = () => {
    const node = cref.current;
    if (!node) return;
    node.style.transitionDuration = `175ms`;
    node.style.height = `${node.clientHeight}px`;
  };

  const collapseExiting = () => {
    const node = cref.current;
    if (!node) return;
    node.style.transitionDuration = "175ms";
    node.style.height = 0;
  };

  React.useEffect(() => {
    // I don't know if it is a right thing. It works.
    setTimeout(() => setState("entered"), 10);
  }, []);

  React.useEffect(() => {
    if (open === false) {
      setState("exit");
      collapseExitStart();
      requestIdleCallback(collapseExiting);
      setTimeout(() => {
        detach();
      }, 300);
    }
  }, [open]);

  let child =
    typeof _wrapper === "function"
      ? _wrapper({ message: _message, id, type })
      : _message;

  return (
    <div ref={cref} className="nt-cl-ctnr">
      <div className={`nt nt-${vPos}-${hPos} ${state} nt-cl-wrapper`}>
        {child}
      </div>
    </div>
  );
});
export default SlideAnimation;
