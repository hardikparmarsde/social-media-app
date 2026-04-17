import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const GlobalLoader = () => {
  const authLoading = useSelector((s) => Boolean(s.auth?.loading));
  const postsLoading = useSelector((s) => Boolean(s.posts?.loading));
  const loading = authLoading || postsLoading;

  // Avoid flicker for very fast requests.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let t;
    if (loading) {
      t = setTimeout(() => setVisible(true), 150);
    } else {
      setVisible(false);
    }
    return () => clearTimeout(t);
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <div className="h-1 w-full overflow-hidden bg-slate-200/60 dark:bg-slate-800/60">
        <div className="h-full w-1/3 animate-[loader_1.2s_ease-in-out_infinite] bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500" />
      </div>
      <style>{`
        @keyframes loader {
          0% { transform: translateX(-60%); }
          50% { transform: translateX(160%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoader;

