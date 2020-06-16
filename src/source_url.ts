export const getSourceUrlId = (url: string) => {
  const urlParts = url.split('/');
  return urlParts.pop() || urlParts.pop();
};

export const getSourceInfo = (link: string) => {
  try {
    const url = new URL(link);
    const type = getType(url.hostname);
    const sourceLink = getLink(type, url);
    return {
      Type: type,
      Link: sourceLink,
    }
  } catch (e) {
    return null;
  }
};

export const enum StreamType {
  Facebook = "Facebook",
  Periscope = "Periscope",
  Twitch = "Twitch",
  Youtube = "Youtube",
}

const getType = (hostname: string) => {
  if (hostname.includes('twitch.tv')) {
    return StreamType.Twitch;
  }
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    return StreamType.Youtube;
  }
  if (hostname.includes('facebook.com')) {
    return StreamType.Facebook;
  }
  if (hostname.includes('pscp.tv') || hostname.includes('periscope.tv')) {
    return StreamType.Periscope;
  }
  throw Error(`could not recognize type for hostname: ${hostname}`);
}

const getLink = (type: StreamType, url: URL) => {
  if (type === StreamType.Twitch) {
    const id = getSourceUrlId(url.pathname);
    return `https://www.twitch.tv/${id}`;
  }
  if (type === StreamType.Youtube) {
    const id = getIdFromUrl(url);
    return `https://www.youtube.com/watch?v=${id}`;
  }
  if (type === StreamType.Facebook) {
    const id = getIdFromUrl(url);
    return `https://www.facebook.com/watch?v=${id}`;
  }
  if (type === StreamType.Periscope) {
    const id = getSourceUrlId(url.pathname);
    return `https://www.pscp.tv/w/${id}`;
  }
}

// id is either a search param 'v' or the last part of the path
const getIdFromUrl = (url: URL) => {
  const maybeId = url.searchParams.get('v');
  if (maybeId !== null) {
    return maybeId;
  }
  return getSourceUrlId(url.pathname);
}
