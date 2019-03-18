// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  CHAT_URL : "ws://switchmagic.com:3000/socket.io/?EIO=3&transport=websocket&sid=W1xKSz8m-BT0ZnpcAAAG"
  //"ws://echo.websocket.org/"
};

