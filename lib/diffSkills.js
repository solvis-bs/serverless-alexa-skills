'use strict';

const BbPromise = require('bluebird');
const { diff } = require('deep-diff');
const { findLocalSkill } = require('./findLocalSkill');
const { getLocaleData } = require('./getLocaleData');
const { mergePublishingInfo } = require('./mergePublishingInfo');

module.exports = {
  diffSkills(remoteSkills) {
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(remoteSkills))
      .map(function (remote) {
        const localSkills = this.serverless.service.custom.alexa.skills;
        const local = findLocalSkill(remote, localSkills);
        return BbPromise.resolve({
          skillId: remote.skillId,
          local,
          localeData: getLocaleData(remote.manifest),
          diff: local ? diff(remote.manifest, mergePublishingInfo(local.manifest, remote.manifest)) : null,
        });
      })
      .then(function (ret) {
        const localSkills = this.serverless.service.custom.alexa.skills;
        // Handle local skills we could not find so they can be reported and possibly created
        localSkills.forEach(function (local) {
          if (!ret.find((entry) => entry.local === local)) {
            const data = getLocaleData(local.manifest);
            if (!local.id && !data) {
              throw new Error(
                'Cannot create skill without at least one locale name in the manifest (publishingInformation.locales.xxx.name)'
              );
            }
            ret.push({
              skillId: null,
              local: local,
              localeData: data,
              diff: null,
            });
          }
        });
        return BbPromise.resolve(ret);
      });
  },
};
