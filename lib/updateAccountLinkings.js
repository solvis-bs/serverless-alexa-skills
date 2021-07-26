'use strict';

const BbPromise = require('bluebird');
const AlexaApi = require('./AlexaApi');
const { findLocalSkill } = require('./findLocalSkill');

module.exports = {
  updateAccountLinkings(diffs) {
    const alexaApi = new AlexaApi(this.getToken());
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(diffs))
      .mapSeries(function (accountLinking) {
        const localSkills = this.serverless.service.custom.alexa.skills;
        const local = findLocalSkill(accountLinking.skill, localSkills);
        if (
          !(typeof accountLinking.diff === 'undefined')
        ) {
          return alexaApi.updateAccountLinking(accountLinking.skill.skillId, local.accountLinking);
        }
        return BbPromise.resolve();
      });
  },
};
