import * as React from "react";

const getStreamUrl = (url: string) => {
  const id = new URL(url).searchParams.get('v');
  return `https://www.youtube.com/embed/${id}?rel=0`;
}

export const YoutubePlayer = ({sourceUrl}: {sourceUrl: string}) => {
  return (
    <iframe
      src={getStreamUrl(sourceUrl)}
      height="480"
      width="854"
      scrolling="no"
      allow="accelerometer; autoplay; encrypted-media; fullscreen; gyroscope; picture-in-picture"
    >
    </iframe>
  );
};
