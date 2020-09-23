'use strict';

const BbPromise = require('bluebird');

module.exports = {
  outputSkillsDiff(diffs) {
    diffs.forEach(function (diff) {
      if (diff.skillId == null) {
        if (diff.local.id == null) {
          this.serverless.cli.log(`---------->\n[Create] ${diff.localeData.name}`);
        } else {
          this.serverless.cli.log(`---------->\n[Missing] ${diff.localeData.name} - Skill ID is specified but could not be found on the remote, please create manually or remove the ID`);
        }
      } else if (diff.local == null) {
        this.serverless.cli.log(`---------->\n[Orphaned] ${diff.localeData.name} - Skill was not found locally (deletion is not supported, please delete manually if this is an old skill)`);
      } else if (diff.diff == null) {
        this.serverless.cli.log(`---------->\n[No change] ${diff.localeData.name} ${diff.skillId}`);
      } else {
        let log = `---------->\n[Changed] ${diff.localeData.name} ${diff.skillId}`;
        diff.diff.forEach((d) => {
          switch (d.kind) {
            case 'N':
              log = `${log}\n- [New] ${d.path.join('.')} = ${JSON.stringify(d.rhs)}`;
              break;
            case 'D':
              log = `${log}\n- [Delete] ${d.path.join('.')}`;
              break;
            case 'E':
              log = `${log}\n- [Update] ${d.path.join('.')} ${JSON.stringify(d.lhs)} -> ${JSON.stringify(d.rhs)}`;
              break;
            case 'A':
              switch (d.item.kind) {
                case 'N':
                  log = `${log}\n- [New] ${d.path.join('.')}.${d.index} = ${JSON.stringify(d.item.rhs)}`;
                  break;
                case 'D':
                  log = `${log}\n- [Delete] ${d.path.join('.')}.${d.index}`;
                  break;
                case 'E':
                  log = `${log}\n- [Update] ${d.path.join('.')}.${d.index} ${JSON.stringify(d.item.lhs)} -> ${JSON.stringify(d.item.rhs)}`;
                  break;
                default:
                  break;
              }
              break;
            default:
              break;
          }
        }, this);
        this.serverless.cli.log(log);
      }
    }, this);
    return BbPromise.resolve(diffs);
  },
};
