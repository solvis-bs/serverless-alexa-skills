'use strict';

const BbPromise = require('bluebird');
const { diff } = require('deep-diff');
const { findLocalSkill } = require('./findLocalSkill');

module.exports = {
  diffAccountLinkings(remoteAccountLinkings) {
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(remoteAccountLinkings))
      .map(function (remoteAccountLinkingResponse) {
        const remoteAccountLinking = remoteAccountLinkingResponse.accountLinking?.accountLinkingResponse ?? {};

        const localSkills = this.serverless.service.custom.alexa.skills;
        const local = findLocalSkill(remoteAccountLinkingResponse.skill, localSkills);

        let ret;
        if (local != null) {
          ret = {
            diff: diff(remoteAccountLinking, local.accountLinking),
            skill: remoteAccountLinkingResponse.skill,
          };
        }
        return BbPromise.resolve(ret);
      })
      .then((ret) => BbPromise.resolve(ret.filter((v) => !(typeof v === 'undefined'))));
  },
};
