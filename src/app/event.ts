import { EventEmitter } from "events";
import { Request } from "express";
import { Octokit } from "@octokit/rest";
import { getInstallationAPI } from "../github/installations";
import { getConfiguration } from "../github/config";
import { all } from "deepmerge";
import { defaultConfiguration } from "./configuration";

interface GitHubData extends NodeJS.Dict<any> {
  repo?: string;
  owner?: string;
  repositoryId?: number;
  ownerId?: number;
  installationId?: number;
  senderId?: number;
  senderLogin?: string;
  installation?: Octokit;
  config?: any;
}

type EventHandler = (
  req: Request,
  event: string,
  action: string,
  context: GitHubData,
  payload: any
) => void;

const ErrorHandler = (handler: EventHandler): EventHandler => {
  return async (req, event, action, context, payload) => {
    try {
      await Promise.resolve(handler(req, event, action, context, payload));
    } catch (err) {
      console.error(`${event}.${action}`);
      console.error("Context: ", context);
      console.error("Payload: ", payload);
      console.error("Error: ", err);
    }
  };
};

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
      super.on(event + "." + a, ErrorHandler(handler));
    }
    return this;
  }

  public on(fullEvent: string, handler: EventHandler): this {
    return super.on(fullEvent, ErrorHandler(handler));
  }

  public async handleEvent(
    event: string,
    action: string | undefined,
    context: GitHubData,
    req: Request,
    payload: any
  ) {
    if (context.installationId) {
      context.installation = await getInstallationAPI(context.installationId);
      context.config = all([
        defaultConfiguration,
        await getConfiguration(
          context.installation!,
          context.owner!,
          context.repo!
        ),
      ]);
    }
    this.emit(event, req, event, action || "", context, payload);
    if (action) {
      this.emit(event + "." + action, req, event, action, context, payload);
    }
    this.emit("*", req, event, action || "", context, payload);
  }
}

export default GithubEvents;
