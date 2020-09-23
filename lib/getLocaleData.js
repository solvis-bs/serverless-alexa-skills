'use strict';

function getLocaleData(manifest) {
  if (!manifest || !manifest.publishingInformation || !manifest.publishingInformation.locales) {
    return null;
  }

  const locales = manifest.publishingInformation.locales;
  const keys = Object.keys(locales);
  if (!keys.length) {
    return null;
  }
  if (!locales[keys[0]].name) {
    return null;
  }

  return {
    name: locales[keys[0]].name,
    locale: keys[0],
  };
}

module.exports = {
    getLocaleData: getLocaleData,
};
