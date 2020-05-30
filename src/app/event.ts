import { EventEmitter } from "events";
import { Request } from "express";

interface GitHubData extends NodeJS.Dict<any> {
  repo?: number;
  owner?: number;
  repositoryFullName?: string;
  ownerLogin?: string;
  installationId?: number;
  senderId?: number;
  senderLogin?: string;
}

type EventHandler = (
  req: Request,
  event: string,
  action: string,
  context: GitHubData,
  payload: any
) => void;

class GithubEvents extends EventEmitter {
  private all: boolean;

  constructor() {
    super();
    super.on("error", (err: any) => {
      console.error(err);
    });
  }

  public multiple(
    event: string,
    actions: string[],
    handler: EventHandler
  ): this {
    for (let a of actions) {
      super.on(event + "." + a, handler);
    }
    return this;
  }

  public on(fullEvent: string, handler: EventHandler): this {
    return super.on(fullEvent, handler);
  }

  public async handleEvent(
    event: string,
    action: string | undefined,
    context: GitHubData,
    req: Request,
    payload: any
  ) {
    this.emit(event, req, event, action || "", context, payload);
    if (action) {
      this.emit(event + "." + action, req, event, action, context, payload);
    }
    this.emit("*", req, event, action || "", context, payload);
  }
}

export default GithubEvents;
