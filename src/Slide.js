import React, { useState } from "react";

const SlideOnExitAndEnterAndCollapseOnExit = React.memo(
  React.forwardRef(function SlideAndCollapseOnExit(props, ref) {
    const { children, open, id, hPos, vPos } = props;
    const [state, setState] = useState("enter");
    const cref = React.useRef();

    const collapseExitStart = () => {
      const node = cref.current;
      node.style.transitionDuration = `195ms`;
      node.style.height = `${node.clientHeight}px`;
    };

    const collapseExiting = () => {
      const node = cref.current;
      node.style.transitionDuration = "195ms";
      node.style.height = 0;
    };

    React.useEffect(() => {
      setTimeout(() => {
        setState("entered");
      }, 0);
    }, []);

    React.useEffect(() => {
      if (open === false) {
        setState("exit");
        collapseExitStart();
        setTimeout(collapseExiting);
        setTimeout(() => {
          props.detach();
        }, 200);
      }
    }, [open]);
    return (
      <div ref={cref} className="nt-cl-ctnr">
        <div
          key={id}
          className={`nt nt-${hPos}-${state} ${vPos} nt-cl-wrapper`}
          ref={ref}
        >
          {children}
        </div>
      </div>
    );
  })
);

export default SlideOnExitAndEnterAndCollapseOnExit;
