## Description

JIRA: [FLEXY-?](https://issues.corp.twilio.com/browse/FLEXY-?)

- DESCRIPTION_OF_PR

## Test Plan

- DESCRIPTION_OF_TEST_PLAN

## Checklist

- [ ] Individual public Repo in Twilio Github.com
- [ ] Test the plugin against Flex UI 2.x for compatibility
- [ ] Create plugin specific CI/CD files
- [ ] Unit test for UI code and serverless code (80% coverage)
- [ ] setup.js should be mandatorily part of the serverless functions
- [ ] Telemetry - Make use of the manager.reportPluginInteraction() to send the event data to Kibana
- [ ] For logging, console.log/warn/error should be effectively used with enough contextual information (these will by default show up in debugger once enabled)
- [ ] Exception handling with degraded UX or information to UI along with serverless retry mechanism (for wherever applicable)
  - 5xx should be handled with retry mechanism (max of 3 attempts)
  - 4xx should be reported back to user saying "Please try after some time...."
- [ ] Details.md file to have content that needs to show up on PluginsLibrary frontend
- [ ] License file to be added in the repo
- [ ] Readme.md updated
- [ ] Plugin template should have a screeshot folder, which contains one image (1.gif) of 1280 x 720 resolution (16:9 aspect ratio).
- [ ] Snyk integration for security vulenrabilities (fix them if there are any)
- [ ] CodeCov integration for testing coverage
- [ ] E2E test suite for the entire plugin
- [ ] For E2E or any automated test, container components and user interactable child components must have ID attribute set.
