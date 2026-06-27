import { useEffect, useRef } from 'react';

const AD_CONFIG = {
  leaderboard: {
    key: '6699dbb66f26225ca6a90f4a95e5eb51',
    format: 'iframe',
    height: 90,
    width: 728,
  },
  banner: {
    key: '7dd4db3c765d83064d90da1f2edc09a9',
    format: 'iframe',
    height: 60,
    width: 468,
  },
  mobileBanner: {
    key: '664859fbd276ed85e81bed34d8407b62',
    format: 'iframe',
    height: 50,
    width: 320,
  },
  mediumRectangle: {
    key: '0be0fef257eaa7be0413f1073e00e769',
    format: 'iframe',
    height: 250,
    width: 300,
  },
  skyscraper: {
    key: 'ab87066a88e179818fc9827f107fc925',
    format: 'iframe',
    height: 600,
    width: 160,
  },
  wideSkyscraper: {
    key: 'a81a8d136a8e1df9a4b596bb6990b4fd',
    format: 'iframe',
    height: 300,
    width: 160,
  },
};

export default function Ad({ type, className = '' }) {
  const ref = useRef(null);
  const config = AD_CONFIG[type];

  useEffect(() => {
    if (!ref.current || !config) return;

    const el = ref.current;
    el.innerHTML = '';

    const s1 = document.createElement('script');
    s1.text = `atOptions = ${JSON.stringify({ key: config.key, format: config.format, height: config.height, width: config.width, params: {} })};`;
    el.appendChild(s1);

    const s2 = document.createElement('script');
    s2.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;
    el.appendChild(s2);

    return () => {
      el.innerHTML = '';
    };
  }, [config]);

  if (!config) return null;

  return (
    <div
      ref={ref}
      className={`flex justify-center ${className}`}
    />
  );
}
