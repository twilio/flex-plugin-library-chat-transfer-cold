# CURRENT VERSION OF CODE IS NOT PRODUCTION READY YET.
# chat-transfer

This feature enables chat users to perform cold transfers to individual agents or queues. It also introduces notifications into the chat channel for users joining or leaving chat, or starting a cold transfer.

If using the notification feature it is advised that you copy the custom components over to the customer facing chat react app to be re-used, so the custom messages with message-attributes indicating a notification can be rendered the same as they will be in flex.

# setup and dependencies

To use this feature first some setup needs to take place.

this feature creates a task when transferring which copies the attributes of the existing task and places them into the new task to be transferred. When we transfer we only know the target, a worker sid or a queue sid.

When creating a task we need to pass it to a taskrouter-workflow and the workflow needs to route it. In the case of a worker sid, this is a single rule as we can use the "known agent routing" option and pass in the variable. In the case of a queue, this is a little more cumbersome as we need to create a rule in the workflow for each queue.

So we need to setup a workflow, similar to this one [here](example-taskrouter-workflow.json) where the first rule matches any worker selected then we have a rule for each queue in the system.

With the workflow setup, we need to update the serverless function environment variable

> TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID

with the new workflow sid for the chat transfer.

# how does it work?

When enabled, the feature renders a "transfer" button at the top of the TaskCanvas.

When this button is selected, it invokes the [ShowDirectory](https://assets.flex.twilio.com/docs/releases/flex-ui/1.31.2/Actions.html#.ShowDirectory) action

When we select a worker or a queue, it invokes the [TransferTask](https://assets.flex.twilio.com/docs/releases/flex-ui/1.31.2/Actions.html#.TransferTask) action which is replaced with some custom logic that recognizes if the task is a chat task and performs our custom behaviors, otherwise, it does what it does OOTB.

The custom behaviors then handle the orchestration of creating a new task, posting notification messages (normal messages with message attributes that allow the message to be rendered as a notification instead of a conversational message). They also handle the management of the chatOrchestrator and the channel janitor.


