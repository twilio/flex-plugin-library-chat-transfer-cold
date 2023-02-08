const { prepareFlexFunction } = require(Runtime.getFunctions()["helpers/prepare-function"].path);
const ChatOperations = require(Runtime.getFunctions()[
  "twilio-wrappers/programmable-chat"
].path);

const requiredParameters = [
  { key: "channelSid", purpose: "channel to be updated" },
  { key: "attributes", purpose: "new attributes" },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { channelSid, attributes } = event;
    
    const result = await ChatOperations.updateChannelAttributes({
      context,
      channelSid,
      attributes,
      attempts: 0,
    });
    
    response.setStatusCode(result.status);
    response.setBody({ success: result.success });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});