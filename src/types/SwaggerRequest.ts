import {LoggerContext} from "a24-logzio-winston";

export type SwaggerRequest = {
  Logger: LoggerContext,
  swagger: {
    params: {[key: string]: any}
  }
}