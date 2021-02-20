import React from 'react';
export default function SlideAnimation(props) {
  const { open, hPos, vPos, _wrapper, _detach, _message, type, id, close } = props.p;
  const [state, setState] = React.useState('enter');
  const cref = React.useRef();

  React.useEffect(() => {
    if (cref.current) {
      // once componet mounetd
      setState('entered');
    }
  }, [cref.current]);

  React.useEffect(() => {
    if (open === false) {
      setState('exit');
      const node = cref.current;
      if (!node) return;
      node.style.height = `${node.clientHeight}px`;
      let isSecondTransitionEnd = 0;
      node.addEventListener('transitionend', e => {
        if (isSecondTransitionEnd) {
          _detach();
        } else {
          node.style.height = 0;
          isSecondTransitionEnd++;
        }
      });
    }
  }, [open]);

  let child = _wrapper ? _wrapper({ message: _message, id, type, close }) : _message;
  return (
    <div className="nt-cl-ctnr">
      <div ref={cref} className={`nt nt-${vPos}-${hPos} ${state} nt-cl-wrapper`}>
        {child}
      </div>
    </div>
  );
}
