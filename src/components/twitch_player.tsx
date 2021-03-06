import * as React from "react";

import { Config } from "../config";
import { getSourceUrlId } from "../source_url";

const getStreamUrl = (url: string) => {
  const id = getSourceUrlId(url);
  return `https://player.twitch.tv/?channel=${id}&parent=${Config.CLIENT_DOMAIN}`;
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
