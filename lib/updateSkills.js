'use strict';

const BbPromise = require('bluebird');
const AlexaApi = require('./AlexaApi');

module.exports = {
  updateSkills(diffs) {
    const alexaApi = new AlexaApi(this.getToken());
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(diffs))
      .map(function (diff) {
        if (diff.diff != null) {
          return alexaApi.updateSkill(diff.skillId, diff.local.manifest);
        }
        return BbPromise.resolve();
      });
  },
};
