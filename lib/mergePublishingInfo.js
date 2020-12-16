'use strict';

function mergeDeep(local, remote) {
  for (const key of Object.keys(remote)) {
    if (!local.hasOwnProperty(key)) {
      local[key] = remote[key];
    } else if (remote[key] instanceof Object) {
      local[key] = mergeDeep(local[key], remote[key]);
    }
  }
  return local;
}

function mergePublishingInfo(localManifest, remoteManifest) {
  if (!localManifest) {
    return localManifest;
  }
  for (const key of ['privacyAndCompliance', 'publishingInformation']) {
    if (remoteManifest[key]) {
      if (!localManifest[key]) {
        localManifest[key] = remoteManifest[key];
      } else {
        localManifest[key] = mergeDeep(localManifest[key], remoteManifest[key]);
      }
    }
  }
  if (remoteManifest.apis && remoteManifest.apis.flashBriefing && remoteManifest.apis.flashBriefing.locales) {
    const locales = remoteManifest.apis.flashBriefing.locales;
    for (const locale of Object.keys(locales)) {
      if (locales[locale] && locales[locale].feeds) {
        for (const feed of locales[locale].feeds) {
          if (feed && feed.imageUri) {
            if (!localManifest.apis) {
              localManifest.apis = {};
            }
            if (!localManifest.apis.flashBriefing) {
              localManifest.apis.flashBriefing = {};
            }
            if (!localManifest.apis.flashBriefing.locales) {
              localManifest.apis.flashBriefing.locales = {};
            }
            if (!localManifest.apis.flashBriefing.locales[locale]) {
              localManifest.apis.flashBriefing.locales[locale] = {};
            }
            if (!localManifest.apis.flashBriefing.locales[locale].feeds) {
              localManifest.apis.flashBriefing.locales[locale].feeds = [];
            }
            if (!localManifest.apis.flashBriefing.locales[locale].feeds[0]) {
              localManifest.apis.flashBriefing.locales[locale].feeds[0] = {};
            }
            localManifest.apis.flashBriefing.locales[locale].feeds[0].imageUri = feed.imageUri;
          }
        }
      }
    }
  }
  return localManifest;
}

module.exports = {
    mergePublishingInfo: mergePublishingInfo,
};
