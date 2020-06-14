import * as React from "react";

export const FacebookPlayer = ({sourceUrl}: {sourceUrl: string}) => {
  const playerEl = React.useRef(null);

  // resize vertical videos
  React.useEffect(() => {
    const checkHeight = setInterval(() => {
      const el = playerEl.current;
      const rect = el.getBoundingClientRect();
      if (rect.height > rect.width) {
        el.style.width = "270px";
        el.style.height = "480px";
      }
    }, 1000);

    return () => {
      clearInterval(checkHeight);
    }
  }, []);

  // re-parse whenever source changes
  React.useEffect(() => {
    if ((window as any).FB !== undefined) {
      (window as any).FB.XFBML.parse();
    }
  }, [sourceUrl]);

  return (
    <div
      id={sourceUrl}
      ref={playerEl}
      className="fb-video"
      data-href={sourceUrl}
      data-allowfullscreen="true"
    >
    </div>
  );
};
