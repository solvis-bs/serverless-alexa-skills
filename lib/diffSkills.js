'use strict';

const BbPromise = require('bluebird');
const { diff } = require('deep-diff');
const { findLocalSkill } = require('./findLocalSkill');

module.exports = {
  diffSkills(remoteSkills) {
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(remoteSkills))
      .map(function (remote) {
        const localSkills = this.serverless.service.custom.alexa.skills;
        const local = findLocalSkill(remote, localSkills);
        let ret;
        if (!(typeof local === 'undefined')) {
          ret = {
            local: local,
            skillId: remote.skillId,
            diff: diff(remote.manifest, local.manifest),
          };
        }
        return BbPromise.resolve(ret);
      })
      .then(function (ret) {
        ret = ret.filter(v => !(typeof v === 'undefined'));
        const localSkills = this.serverless.service.custom.alexa.skills;
        // Handle local skills we could not find
        localSkills.forEach(function (local, index) {
          if (!ret.find(entry => entry.local === local)) {
            ret.push({
              skillId: local.id || `Skill at index ${index}`,
              diff: null,
              message: 'Not found on remote'
            });
          }
        });
        return BbPromise.resolve(ret)
      });
  },
};
