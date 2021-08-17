'use strict';

const AlexaApi = require('./AlexaApi');
const BbPromise = require('bluebird');

let cachedPromise;

module.exports = {
  getVendorId() {
    if (this.serverless.service.custom.alexa.vendorId) {
      return BbPromise.resolve(this.serverless.service.custom.alexa.vendorId);
    }
    if (cachedPromise) {
      return cachedPromise;
    }
    const alexaApi = new AlexaApi(this.getToken(this.tokenFilePath));
    return (cachedPromise = alexaApi.getVendors().then(function (vendors) {
      if (!vendors || vendors.length < 1) {
        throw new Error('No vendors found in account.');
      }
      if (vendors.length > 1) {
        var available = vendors.map((vendor) => vendor.name + ' (' + vendor.id + ')').join(', ');
        throw new Error(
          'Multiple vendors available, please specify which vendorId you want to use in the custom.alexa.venderId property: ' +
            available
        );
      }
      return vendors[0].id;
    }));
  },
};
