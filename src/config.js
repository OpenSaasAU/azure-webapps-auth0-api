export function getConfig() {
  // Configure the audience here. By default, it will take whatever is in the config
  // (specified by the `audience` key) unless it's the default value of "YOUR_API_IDENTIFIER" (which
  // is what you get sometimes by using the Auth0 sample download tool from the quickstart page, if you
  // don't have an API).
  // If this resolves to `null`, the API page changes to show some helpful info about what to do
  // with the audience.
  const audience =
    process.env.REACT_APP_AUTH0_AUDIENCE && process.env.REACT_APP_AUTH0_AUDIENCE !== "YOUR_API_IDENTIFIER"
      ? process.env.REACT_APP_AUTH0_AUDIENCE
      : null;

  return {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
    ...(audience ? { audience } : null),
  };
}
