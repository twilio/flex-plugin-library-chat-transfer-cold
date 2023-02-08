import { EventEmitter } from 'events';
import { Task } from '../../types/task-router';

export default class Reservation extends EventEmitter {
  sid: string;
  task: Task;
  
  constructor(sid: string, task: Task) {
    super();
    this.sid = sid;
    this.task = task;
  }
}