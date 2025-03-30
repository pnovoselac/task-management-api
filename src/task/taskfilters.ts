import { Priority, Status } from "./task.entity";

export interface ITaskFilters {
  owner?: string;
  project?: number;
  priority?: Priority;
  status?: Status;
  dueDate?: Date;
}
