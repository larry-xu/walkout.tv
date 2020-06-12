import * as React from "react";

import { getSourceUrlId } from "../source_url";

const getStreamUrl = (url: string) => {
  const id = getSourceUrlId(url);
  return `https://player.twitch.tv/?channel=${id}&parent=localhost`;
}

export const TwitchPlayer = ({sourceUrl}: {sourceUrl: string}) => {
  return (
    <iframe
      src={getStreamUrl(sourceUrl)}
      height="480"
      width="854"
      scrolling="no"
      allow="fullscreen"
    >
    </iframe>
  );
};
