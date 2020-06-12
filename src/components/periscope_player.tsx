import * as React from "react";
import videojs from "video.js";

import { getSourceUrlId } from "../source_url";

const getDataUrl = (url: string) => {
  const id = getSourceUrlId(url);
  return `https://api.periscope.tv/api/v2/accessVideoPublic?broadcast_id=${id}`;
}

const getProxyUrl = (url: string) => {
  return `http://localhost:3000/${url}`;
}

export const PeriscopePlayer = ({sourceUrl}: {sourceUrl: string}) => {
  const videoEl = React.useRef(null);

  React.useEffect(() => {
    const player = videojs(videoEl.current);
    const streamDataUrl = getProxyUrl(getDataUrl(sourceUrl));
    fetch(streamDataUrl)
      .then(response => response.json())
      .then(data => {
        let streamSrcUrl;
        if (data.hls_url !== undefined) {
          streamSrcUrl = getProxyUrl(data.hls_url);
        } else if (data.replay_url !== undefined) {
          streamSrcUrl = getProxyUrl(data.replay_url);
        } else {
          return;
        }
        player.src({
          src: streamSrcUrl,
          type: 'application/x-mpegURL'
        })
      });

    return () => player.dispose();
  }, [sourceUrl]);

  return (
    <div data-vjs-player>
      <video-js
        ref={videoEl}
        width="854"
        height="480"
        class="vjs-default-skin vjs-big-play-centered"
        controls
      >
      </video-js>
    </div>
  );
};
