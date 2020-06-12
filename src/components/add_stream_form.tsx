import * as React from "react";

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfTdbvCXcAnKIMiJV9NIsjz9TJCaoKhliRxgq5VrYwFtFVW9w/formResponse';

export const AddStreamForm = ({done}: {done: () => void}) => {
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [link, setLink] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name === "" || location === "" || link === "") {
      setMessage("Please fill in all the fields");
      return;
    };

    const url = new URL(FORM_URL);
    url.searchParams.append("entry.872389644", name);
    url.searchParams.append("entry.2030257248", location);
    url.searchParams.append("entry.1034793640", link);
    const urlString = url.toString();

    fetch(urlString, {
      method: "POST",
      mode: "no-cors",
    });

    done();
  };

  const handleBack = () => {
    done();
  };

  return (
    <div className="formContainer">
      <h2>Add Stream</h2>
      <p>Help us maintain the list of available streams by submitting a link below. After it is verified, the link will appear in the public list.</p>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" className="formInput" value={name} onChange={handleName} placeholder="Name (e.g. streamer's name/channel)" />
        <input type="text" className="formInput" value={location} onChange={handleLocation} placeholder="Location (e.g. city, state)" />
        <input type="text" className="formInput" value={link} onChange={handleLink} placeholder="Link (e.g. facebook, youtube, twitch link)" />
        <input type="submit" className="submitButton" value="Submit" />
      </form>
      <button className="backButton" onClick={handleBack}>Back</button>
      {message && <p className="errorMessage">{message}</p>}
    </div>
  );
};
