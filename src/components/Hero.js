import React from "react";

import logo from "../assets/logo.svg";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <h1 className="mb-4">React.js Sample Project</h1>

    <p className="lead">
      This is a sample application that demonstrates an authentication flow for
      an SPA, using <a href="https://reactjs.org">React.js</a> with the addition
      of a <a href="https://fl0.com/">Fl0</a> example API call. Click login to get started.
      Or you can try the <a href="/external-api">external API</a> or the <a href="/fl0-api">Fl0 API</a>.
    </p>
  </div>
);

export default Hero;
