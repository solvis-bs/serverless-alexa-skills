'use strict';

module.exports = {
  outputUpdatedAccountLinkings(skillIds) {
    if (!(typeof skillIds === 'undefined')) {
      skillIds.forEach(function (response) {
        if (!(typeof response === 'undefined')) {
          this.serverless.cli.log(`Account linking for "${response.id}" updated.`);
        }
      }, this);
    }
  },
};
