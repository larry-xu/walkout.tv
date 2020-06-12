import * as Papa from "papaparse";
import * as React from "react";

import { AddStreamForm } from "./add_stream_form";
import { FacebookPlayer } from "./facebook_player";
import { PeriscopePlayer } from "./periscope_player";
import { TwitchPlayer } from "./twitch_player";
import { YoutubePlayer } from "./youtube_player";

const STREAM_LIST_SOURCE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv8D5o_qVVyXP04E875yC60H8ZyVO7qwhXW4CE9EX4k6itPUxyixfQQmJNkQad4vkaJJVTNAWEoobU/pub?gid=0&single=true&output=csv'

const enum StreamType {
  Facebook = "Facebook",
  Periscope = "Periscope",
  Twitch = "Twitch",
  Youtube = "Youtube",
}

type Stream = {
  Name: string;
  Type: StreamType;
  Location: string;
  Link: string;
}

const streamComponents = new Map([
  [StreamType.Facebook, FacebookPlayer],
  [StreamType.Periscope, PeriscopePlayer],
  [StreamType.Twitch, TwitchPlayer],
  [StreamType.Youtube, YoutubePlayer],
]);

export const App = () => {
  const [streamList, setStreamList] = React.useState([]);
  const [stream, setStream] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [showAddStreamForm, setShowAddStreamForm] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showIntro, setShowIntro] = React.useState(false);

  const handleStreamClick = (stream: Stream) => {
    const url = new URL(window.location.href);
    const location = url.searchParams.set('location', stream.Location);
    const name = url.searchParams.set('name', stream.Name);
    window.history.replaceState(null, null, url.href);
    setStream(stream);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = new URL(window.location.href);
    const queryVal = event.target.value;
    if (queryVal !== "") {
      url.searchParams.set('q', queryVal);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState(null, null, url.href);
    setSearch(queryVal);
  };

  const openAddStreamForm = () => {
    setShowAddStreamForm(true);
  };

  const closeAddStreamForm = () => {
    setShowAddStreamForm(false);
  };

  const handleRefreshClick = () => {
    setIsLoading(true);
    refreshStreamList();
  };

  const refreshStreamList = () => {
    return fetch(STREAM_LIST_SOURCE)
      .then(response => response.text())
      .then(text => Papa.parse(text, { header: true, skipEmptyLines: "greedy" }).data)
      .then(rawList => rawList.filter(row => row.Published === "Yes"))
      .then(data => {
        setStreamList(data);
        setIsLoading(false);
        return data;
      });
  };

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const query = url.searchParams.get('q');
    if (query) {
      setSearch(query);
    }

    refreshStreamList().then(streamList => {
      const url = new URL(window.location.href);
      const location = url.searchParams.get('location');
      const name = url.searchParams.get('name');
      const stream = streamList.find(stream => {
        return stream.Name === name && stream.Location === location;
      });
      if (stream !== undefined) {
        setStream(stream);
      } else {
        setShowIntro(true);
      }
    });
  }, []);

  const filteredStreamList = streamList.filter(d => {
    if (search === "") {
      return true;
    }
    const searchLower = search.toLowerCase();
    if (d.Location.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (d.Name.toLowerCase().includes(searchLower)) {
      return true;
    }
    return false;
  }).sort((a, b) => {
    if (a.Location === "Multi-city" && b.Location !== "Multi-city") {
      return -1;
    }
    if (a.Location !== "Multi-city" && b.Location === "Multi-city") {
      return 1;
    }
    return a.Location.localeCompare(b.Location) || a.Name.localeCompare(b.Name);
  });

	return (
    <div className="appContainer">
      <div className="mainContainer">
        <div className="playerContainer">
          <div className="streamContainer">
            {stream ?
              React.createElement(
                streamComponents.get(stream.Type),
                {sourceUrl: stream.Link, key: stream.Link}
              ) :
              showIntro && <h1 className="introText">
                {filteredStreamList.length > 0 ? "Click a stream to start watching →" : "No streams available"}
              </h1>
            }
          </div>
          <div className="streamDetails">
            <div className="streamInfo">
              {stream ? `${stream.Location} — ${stream.Name}` : <>&nbsp;</>}
            </div>
            <div className="streamLink">
              <strong>
                {stream ? <a href={stream.Link} className="link" target="_blank">{stream.Link}</a> : <>&nbsp;</>}
              </strong>
            </div>
          </div>
        </div>
        <div className="sideContainer">
          {showAddStreamForm ?
            <AddStreamForm done={closeAddStreamForm} /> :
            <div className="streamListContainer">
              <div className="searchContainer">
                <input type="text" className="searchInput" value={search} onChange={handleSearch} placeholder="Search" />
                <button className="searchRowButton" onClick={handleRefreshClick}>Refresh</button>
                <button className="searchRowButton" onClick={openAddStreamForm}>Add</button>
              </div>
              {isLoading ? <div className="loading">Loading streams...</div> :
                <div className="streamList">
                  {filteredStreamList.map((stream, i) =>
                    <div
                      key={i}
                      onClick={() => handleStreamClick(stream)}
                      className="streamItem"
                    >
                      <strong>{stream.Location}</strong> — {stream.Name}
                    </div>
                  )}
                </div>
              }
            </div>
          }
        </div>
      </div>
      <div className="footnote">
        <p>
          Watch George Floyd protests live from around the world.{' '}
          <strong><a href="https://docs.google.com/document/d/1296X0Iws9uWO1OPuDYjGTTrkQ99FLKbkGuUtir9G1jM/edit" target="_blank">Donate</a></strong>{' '}
          to support those fighting on the front lines.{' '}
          <strong><a href="mailto:info@walkout.tv">Contact me</a></strong>
        </p>
        <p>Made with <span className="emoji">❤️</span> in support of the Black Lives Matter movement.</p>
      </div>
    </div>
  );
};
