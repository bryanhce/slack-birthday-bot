# Slack brithday reminder bot
TODO fill up

# Architecture
TODO fill up

# Functional Requirements

## Slack commands

- /add
- /list-all
- /remove-bday

## Cron jobs

- cron job to trigger 8am everyday for brithday reminders
- cron job to rigger every last day of the month for next month's reminders

# How to run

## App

- `npm run deploy` - to deploy code on local to dev env

## For infrastructure

- `npx serverless package` - to test locally, compiles and bundles app into `.esbuild/.serverless/` for inspection and also compiles the code to `.esbuild/.build`. Everytime code change, need to rerun this command.
- `npx serverless deploy` - to deploy the aws resources
- `npx serverless invoke local --function slackCommand --data '{"body": {"command": "/list", "user_id": "123"}}'` - test function locally without deploying. If you are testing locally, need to remember to run `npx serverless package` command
- `npx serverless invoke --function slackCommand` - test remotely after deployment
- `npx serverless remove` - remove all deployed resources from AWS

# Areas of Growth

- `serverless.yml` file is used by the Serverless Framework, a popular open-source tool to simplify deploying and managing serverless applications (mainly on AWS). It acts as your infrastructure-as-code (IaC) config, describing everything your app needs: functions, events, permissions, resources, etc.
- In serverless.yml dynamodb configuration
  - `KeySchema` defines how the table is indexed, need hash (partition) key and optionally range (sort) key
  - `AttributeDefinitions` defines the data types of the keys used in the `KeySchema` and only those keys. Additional attributes can be stored in your items, but don't include them in key schema
- In serverless.yml lambda/function configuration, if you specify `events: -http:` it will automatically create an API Gateway endpoint that triggers this function

- `npm install` doesn't automatically remove unused packages, it only installs packages listed in `package.json`. Use `npm prune` to remove packages from `node_modules` directory that are not listed in the `package.json`.

- Airbnb ESLint discourages for loops in favour of functional array methods beacuse:
  - bundle size of for loops requires polyfills in older environments
  - prefer functional programming, use methods like `.forEach(), .map(), .reduce()`
