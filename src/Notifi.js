import reactUtils from './reactlocal';
import SlideAnimation from './Slide';
import { notifier } from './notifier';
const React = reactUtils._React;

export function Notifi() {
  const [snacks, setSnacks] = reactUtils._useState([]);

  reactUtils._useEffect(() => {
    return notifier._subscribe(s => {
      setSnacks([].concat(s));
    });
  }, []);

  const categ = snacks.reduce((acc, current) => {
    const category = current._position;
    if (acc[category]) {
      acc[category].push(current);
    } else {
      acc[category] = [current];
    }
    return acc;
  }, {});

  return Object.entries(categ).map(([position, snacks]) => {
    const vPos = position[0] === 't' ? 'top' : 'bottom';
    const hPos = position.includes('Left') ? 'left' : position.includes('Center') ? 'center' : 'right';
    return (
      <div key={vPos + hPos} className={`nt-ctnr nt-${vPos} nt-${hPos}`}>
        {snacks.map(snack => (
          <SlideAnimation key={snack.id} p={Object.assign({}, snack, { hPos, vPos })} />
        ))}
      </div>
    );
  });
}
