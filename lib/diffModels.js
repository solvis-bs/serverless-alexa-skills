'use strict';

const BbPromise = require('bluebird');
const { diff } = require('deep-diff');
const { findLocalSkill } = require('./findLocalSkill');
const { getLocaleData } = require('./getLocaleData');

module.exports = {
  diffModels(remoteModels) {
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(remoteModels))
      .map(function (remote) {
        return BbPromise.bind(this)
          .then(() => BbPromise.resolve(remote))
          .map(function (model) {
            const localSkills = this.serverless.service.custom.alexa.skills;
            const local = findLocalSkill(model.skill, localSkills);
            let ret;
            if (!(typeof local === 'undefined')) {
              let localModel = null;
              if (model.locale in local.models) {
                localModel = local.models[model.locale];
                // Copy version so we don't report a difference / or remove it
                localModel.version = model.model.version
              }
              ret = {
                locale: model.locale,
                localeData: getLocaleData(model.skill.manifest),
                diff: diff(model.model, localModel),
                skill: model.skill,
              };
            }
            return BbPromise.resolve(ret);
          })
          .then(ret => BbPromise.resolve(ret.filter(v => !(typeof v === 'undefined'))));
      });
  },
};
