'use strict';

function mergeDeep(local, remote) {
  for (let key of Object.keys(remote)) {
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
  for (let key of ['privacyAndCompliance', 'publishingInformation']) {
    if (remoteManifest[key]) {
      if (!localManifest[key]) {
        localManifest[key] = remoteManifest[key];
      } else {
        localManifest[key] = mergeDeep(localManifest[key], remoteManifest[key]);
      }
    }
  }
  return localManifest;
}

module.exports = {
    mergePublishingInfo: mergePublishingInfo,
};
