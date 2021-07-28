'use strict';

const BbPromise = require('bluebird');
const { findLocalSkill } = require('./findLocalSkill');

module.exports = {
  addSkillsToFunctions() {
    // get local skills
    const localSkills = this.serverless.service.custom?.alexa?.skills;
    if (localSkills == null) return;
    // if no skill has 'addSkillToFunction' return
    const localSkillsWithAddSkillToFunction = localSkills.filter((skill) => skill.addSkillToFunction != null);
    if (localSkillsWithAddSkillToFunction.length === 0) return;

    // get remote skills
    return BbPromise.bind(this)
      .then(this.getRemoteSkills)
      .then((remoteSkills) => {
        const resources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
        for (const remoteSkill of remoteSkills) {
          const localSkill = findLocalSkill(remoteSkill, localSkillsWithAddSkillToFunction);
          if (localSkill == null) continue;

          const functionName = localSkill.addSkillToFunction;
          const functionNamePrefix = functionName.charAt(0).toUpperCase() + functionName.slice(1);
          const serverlessName = `${functionNamePrefix}LambdaFunction`;

          this.serverless.cli.log(`Adding alexa event to function "${functionName}" with id ${remoteSkill.skillId}.`);

          const functionResource = resources[serverlessName];
          if (functionResource == null) {
            this.serverless.cli.log(`Could not add alexa event to function "${functionName}". Function not found.`);
            continue;
          }

          const serverlessAlexaLambdaPermissionNamePrefix = `${functionNamePrefix}LambdaPermissionAlexaSkill`;
          for (let permissionNumber = 1; permissionNumber < 9; permissionNumber++) {
            const serverlessAlexaLambdaPermissionName = serverlessAlexaLambdaPermissionNamePrefix + permissionNumber;
            if (resources[serverlessAlexaLambdaPermissionName] == null) {
              resources[serverlessAlexaLambdaPermissionName] = {
                Type: 'AWS::Lambda::Permission',
                Properties: {
                  FunctionName: { 'Fn::GetAtt': [serverlessName, 'Arn'] },
                  Action: 'lambda:InvokeFunction',
                  Principal: 'alexa-appkit.amazon.com',
                  EventSourceToken: remoteSkill.skillId,
                },
              };
              break;
            }
          }
        }
      });
  },
};
