'use strict';

const BbPromise = require('bluebird');
const { doLocaleNamesMatch } = require('./findLocalSkill');
const AlexaApi = require('./AlexaApi');

module.exports = {
  initSkills(remoteSkills) {
    const alexaApi = new AlexaApi(this.getToken());
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(remoteSkills))
      .then((skills) => {
        const localSkills = this.serverless.service.custom.alexa.skills;

        const uninitializedSkills = localSkills.filter(
          (localSkill) => !skills.some((remoteSkill) => doLocaleNamesMatch(localSkill.manifest, remoteSkill.manifest))
        );

        return uninitializedSkills;
      })
      .mapSeries((uninitializedSkills) => {
        return this.getVendorId().then((vendorId) => {
          const type = Object.keys(uninitializedSkills.manifest.apis)[0];

          return alexaApi.createSkill(vendorId, uninitializedSkills.manifest.publishingInformation.locales, type);
        });
      });
  },
};
