import React, { useState } from "react";

export const SlideOnExitAndEnterAndCollapseOnExit = React.memo(
  React.forwardRef(function SlideAndCollapseOnExit(props, ref) {
    const { open, hPos, vPos, wrapper, detach, _message, type, id } = props;
    const [state, setState] = useState("enter");
    const cref = React.useRef();

    const collapseExitStart = () => {
      const node = cref.current;
      node.style.transitionDuration = `175ms`;
      node.style.height = `${node.clientHeight}px`;
    };

    const collapseExiting = () => {
      const node = cref.current;
      node.style.transitionDuration = "175ms";
      node.style.height = 0;
    };

    React.useEffect(() => {
      requestIdleCallback(() => setState("entered"));
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
      typeof wrapper === "function"
        ? wrapper({ message: _message, key: id, type })
        : _message;
    return (
      <div ref={cref} className="nt-cl-ctnr">
        <div
          className={`nt nt-${vPos}-${hPos} ${state} nt-cl-wrapper`}
          ref={ref}
        >
          {child}
        </div>
      </div>
    );
  })
);
export default SlideOnExitAndEnterAndCollapseOnExit;
