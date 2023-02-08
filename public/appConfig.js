// // your account sid
// var accountSid = 'ACe8ddc287fd1e7c901eb0cf17543fd459';
// var env = 'prod';
// const serviceBaseUrl = window.location.origin;
// // const accountSid = accounts.stage;
// function getAppConfig(env) {
//   if (env === 'dev' || env === 'stage') {
//     return {
//       warmTransfers: {
//         enabled: true,
//       },
//       pluginService: {
//         enabled: true,
//         url: '/plugins',
//       },
//       sso: {
//         accountSid: `${accountSid}`,
//         tokenizerUrl: `${serviceBaseUrl}/tokenizer`,
//         loginUrl: `https://iam.${env}.twilio.com/v1/Accounts/${accountSid}/authenticate`,
//         tokenRefreshUrl: `https://iam.${env}.twilio.com/v1/Accounts/${accountSid}/Tokens/refresh`,
//         publicConfigServiceUrl: `https://flex-api.${env}.twilio.com/v1/Configuration/Public`
//       },
//       ytica: false,
//       logLevel: 'info',
//       chatOrchestrationServiceUrl: `https://preview.${env}.twilio.com/Flex/WebChannels`,
//       showSupervisorDesktopView: true,
//       flexConfigServiceUrl: `https://flex-api.${env}.twilio.com/v1/Configuration`,
//       twilioServiceLoginUrl: `https://flex.${env}.twilio.com/admin`,
//       sessionUrl: `https://flex.${env}.twilio.com/api/v1/Session`,
//       sdkOptions: {
//         flex: {
//           logger: {
//               level: "silent"
//           },
//           environmentConfig: {
//               authServiceUrl: `https://iam.stage.twilio.com/v1/Accounts`,
//               twilioServiceLoginUrl: "https://flex.stage.twilio.com/admin",
//               configServiceUrl: "https://flex-api.stage.twilio.com/v1/Configuration",
//               region: "stage-us1"
//           }
//         },
//         chat: {
//           logLevel: "silent",
//           region: "stage-us1"
//         },
//         worker: {
//             logLevel: "silent",
//             // region: "stage-us1",
//             ebServer: "https://event-bridge.stage-us1.twilio.com/v1/wschannels",
//             wsServer: "wss://event-bridge.stage-us1.twilio.com/v1/wschannels"
//         },
//         insights: {
//             logLevel: "silent",
//             productId: "flex_insights",
//             region: "stage-us1"
//         },
//         voice: {
//             logLevel: "silent",
//             chunderw: "chunderw-vpc-gll.stage.twilio.com",
//             eventgw: "eventgw.stage.twilio.com"
//         },
//         // insights: {
//         //   logLevel: 'error',
//         //   region: `${env}-us1`,
//         //   productId: 'flex_insights',
//         // },
//         // chat: {
//         //   region: `${env}-us1`,
//         //   logLevel: 'error',
//         // },
//         // worker: {
//         //   wsServer: `wss://event-bridge.${env}-us1.twilio.com/v1/wschannels`,
//         //   ebServer: `https://event-bridge.${env}-us1.twilio.com/v1/wschannels`,
//         // },
//         // voice: {
//         //   eventgw: `eventgw.${env}.twilio.com`,
//         //   chunderw: `chunderw-vpc-gll.${env}.twilio.com`,
//         // },
//       },
//     };
//   }

//   return {
//     pluginService: {
//       enabled: true,
//       url: '/plugins',
//     },
//     sso: {
//       accountSid: accountSid,
//     },
//     ytica: false,
//     logLevel: 'info',
//     showSupervisorDesktopView: true,
//     sdkOptions: {
//       flex: {
//         logger: {
//             level: "silent"
//         },
//         environmentConfig: {
//             authServiceUrl: `https://iam.stage.twilio.com/v1/Accounts`,
//             twilioServiceLoginUrl: "https://flex.stage.twilio.com/admin",
//             configServiceUrl: "https://flex-api.stage.twilio.com/v1/Configuration",
//             region: "stage-us1"
//         }
//      }
//     }
//   };
// }

// var appConfig = getAppConfig(env);

var appConfig = {
  pluginService: {
    enabled: true,
    url: '/plugins',
  },
  ytica: false,
  logLevel: 'info',
  showSupervisorDesktopView: true,
};
