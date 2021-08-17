'use strict';

const BbPromise = require('bluebird');
const AlexaApi = require('./AlexaApi');

module.exports = {
  createSkill() {
    const alexaApi = new AlexaApi(this.getToken());
    const options = this.options;
    return this.getVendorId().then((vendorId) => {
      return alexaApi.createSkill(
        vendorId,
        {
          [options.locale]: {
            name: options.name,
          },
        },
        options.type
      );
    });
  },
};
