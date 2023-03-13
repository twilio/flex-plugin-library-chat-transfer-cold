## Details

When enabled, the feature renders a "transfer" button at the top of the TaskCanvas.

When this button is selected, it invokes the ShowDirectory action

When we select a worker or a queue, it invokes the TransferTask action which is replaced with some custom logic that recognizes if the task is a chat task and performs our custom behaviors, otherwise, it does what it does OOTB.

The custom behaviors then handle the orchestration of creating a new task, posting notification messages (normal messages with message attributes that allow the message to be rendered as a notification instead of a conversational message). They also handle the management of the chatOrchestrator and the channel janitor.