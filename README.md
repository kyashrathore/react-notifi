# The Problem

There are a couple of taost/snackbar notification component library in React. Some of them are [notistack](https://github.com/iamhosseindhv/notistack) , [cogo-Toast](https://cogoport.github.io/cogo-toast). While notistack is highly customizable and have stack-able toast feature with material ui slide and collapse animation, it has a significant size issue(~7.5kb) and still need to have material ui as dependency of your project.
Cogo toast doesn't have these animations and stackable feature.

React-notifi is best of both world with built in required animations, stack-able toasts, still 1.4kb in size.

# Goals

- Tiny (size less than 1.5kb)
- No dependency
- Minimal HTML and CSS or SVG(can be provided in examples)
- Good slide in slide out animations
- Stackable toast Notifications like (https://github.com/iamhosseindhv/notistack)[Notistack] which follows material ui guidelines.
- Can be fired outside of react tree.

```sh
npm i react-notifi
```

```js
import { Notifi, EnqueNotifi } from "noti-fi";

const notifi = new EnqueNotifi({
  maxSnack: 2, // more will be queued
  position: "bottomLeft",
  preventDuplicate: true,
  autoHideDuration: 3000
});

function App() {
  const handleShowNotification = () => {
    const key = "showBtn";
    notifi.enqueue(
        <Button text="hide" onClick={() notifi.close(key)} />, {
      key
      //other options
    });
  };
  return (
    <>
      <Notifi />
      <button onClick={handleShowNotification}>Show</button>
    </>
  );
}
```
