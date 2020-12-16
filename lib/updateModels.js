'use strict';

const BbPromise = require('bluebird');
const AlexaApi = require('./AlexaApi');
const { findLocalSkill } = require('./findLocalSkill');

module.exports = {
  updateModels(diffs) {
    const alexaApi = new AlexaApi(this.getToken());
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(diffs))
      .mapSeries(function (diff) {
        return BbPromise.bind(this)
          .then(() => BbPromise.resolve(diff))
          .mapSeries(function (model) {
            const localSkills = this.serverless.service.custom.alexa.skills;
            const local = findLocalSkill(model.skill, localSkills);
            if (
              !(typeof local.models[model.locale] === 'undefined')
              && !(typeof model.diff === 'undefined')
            ) {
              return alexaApi.updateModel(model.skill.skillId, model.locale, local.models[model.locale]);
            }
            return BbPromise.resolve();
          });
      });
  },
};
