# The Problem

There are a couple of taost/snackbar notification component library in React. Some of them are [notistack](https://github.com/iamhosseindhv/notistack) , [cogo-Toast](https://cogoport.github.io/cogo-toast). While notistack is highly customizable and have stack-able toast feature with material ui slide and collapse animation, it has a significant size issue(~7.5kb) and still need to have material ui as dependency of your project.
Cogo toast doesn't have these animations and stackable feature.

React-notifi is best of both world with built in required animations, stack-able toasts, still 1.4kb in size.

Check Demo [Here](https://5e5d752a6a336db51a36feaf--elated-lumiere-38d721.netlify.com/)

[Github Link](https://github.com/contactyash/react-notifi)

# Goals

- Tiny (size less than 1.5kb)
- No dependency
- Minimal HTML and CSS or SVG(can be provided in examples)
- Good slide in slide out animations
- Stackable toast Notifications like [Notistack](https://github.com/iamhosseindhv/notistack) which follows material ui guidelines.
- Can be fired outside of react tree.

```sh
npm i react-notifi
```

```js
import { Notifi, EnqueNotifi } from "noti-fi";

const notifi = new EnqueNotifi({
  maxToast: 3,
  position: "bottomLeft" |"bottomCenter"|"bottomRight"| |"topLeft"|"topCenter"|"topRight",
  preventDuplicate: true,
  autoHideDuration: 3000,
   wrapper: ({ message, ...rest }) => {
    return <DefaultSnack {...rest}>{message}</DefaultSnack>;
  }
});

function App() {
  const handleShowNotification = () => {
    const key = "showBtn";
    notifi.enqueue('Here is your notification');
  };
  return (
    <>
      <Notifi />
      <button onClick={handleShowNotification}>Show</button>
    </>
  );
}
```

`NotifiEnqueue` is a class through which `react-notifi` manages queue of toast and not with React Context that's why you can call `notifi.enqueue` and `notifi.close` outside of react tree also.Intiate this class and provide your default options.

_Remember `react-notifi` comes with no css. You can provide a default component in wrapper to which your options will be passed then._

You can you use [this Material Ui default component and CSS](<(https://github.com/contactyash/react-notifi/tree/master/src/Example)>), which is used in [official examples ](https://5e5d752a6a336db51a36feaf--elated-lumiere-38d721.netlify.com/)

`Notifi` is a component which renders nothing. It just subscribe to `NotifiEnqueue` class and updates toasts.
