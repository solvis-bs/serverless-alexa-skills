'use strict';

function doLocaleNamesMatch(localManifest, remoteManifest) {
  if (!localManifest || !localManifest.publishingInformation || !localManifest.publishingInformation.locales) {
    return null;
  }
  if (!remoteManifest || !remoteManifest.publishingInformation || !remoteManifest.publishingInformation.locales) {
    return null;
  }

  let failedMatch = false;
  const localLocales = localManifest.publishingInformation.locales;
  const remoteLocales = remoteManifest.publishingInformation.locales;

  Object.keys(localLocales).find(function (locale) {
    // Non-matching locale found, so this isn't the same
    return failedMatch = !remoteLocales[locale] || remoteLocales[locale].name !== localLocales[locale].name;
  });

  return !failedMatch;
}

function findLocalSkill(remote, localSkills) {
  let local = localSkills.find(skill => skill.id === remote.skillId);
  if (!local) {
    local = localSkills.find(function (skill) {
      return doLocaleNamesMatch(skill.manifest, remote.manifest);
    });
  }
  return local;
}

module.exports = {
  findLocalSkill: findLocalSkill,
};
