'use strict';

const fs = require('fs-extra');

const alexaAuthTokenEnvKey = 'ALEXA_AUTH_TOKEN';

module.exports = {
  getToken() {
    let accessToken = '';

    if (process.env[alexaAuthTokenEnvKey] != null) {
      accessToken = JSON.parse(process.env[alexaAuthTokenEnvKey]);
    } else {
      if (!fs.pathExistsSync(this.tokenFilePath)) {
        throw new Error(`Unable to find token file at ${this.tokenFilePath}. You may need to re-run "alexa auth".`);
      }
      accessToken = fs.readJsonSync(this.tokenFilePath);
    }
    return this.oauth2.accessToken.create(accessToken.token);
  },
};
