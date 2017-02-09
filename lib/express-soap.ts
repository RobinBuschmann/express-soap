import * as soapOrigin from 'soap';
import * as events from 'events';
import {Request, Response, NextFunction, Router} from 'express';
import {ISoapServer} from "./interfaces/ISoapServer";
import {ISoapOptions} from "./interfaces/ISoapOptions";

const WSDL = soapOrigin['WSDL'] as any;
const Server = soapOrigin['Server'] as any;

/**
 * @override of soap.Server constructor.
 * Ensures that path is immediately passed to router/server.
 */
function ExpressServerConstructor(this: ISoapServer, router: Router,
                                  services: any, wsdl: any, options: any): void {

  // Path is fix and should be defined externally instead
  const PATH = '/';

  events.EventEmitter.call(this);

  options = options || {};
  this.path = PATH;
  this.services = services;
  this.wsdl = wsdl;

  let isWsdlReady = false;
  let wsdlReadyError: any;
  const wsdlReadyListeners: Function[] = [];

  router
    .route(PATH)
    .all((req: Request, res: Response, next: NextFunction) => {
      if (typeof this.authorizeConnection === 'function') {
        if (!this.authorizeConnection(req)) {
          res.end();
          return;
        }
      }
      const processRequest = () => {
        if (wsdlReadyError) {
          next(wsdlReadyError);
          return;
        }
        this._requestListener(req, res, next);
      };

      if (isWsdlReady) {

        processRequest();
      } else {

        wsdlReadyListeners.push(processRequest);
      }
    });

  wsdl.onReady((err: any) => {

    isWsdlReady = true;
    wsdlReadyError = err;
    wsdlReadyListeners.forEach(listener => listener());
  });

  this._initializeOptions(options);
}

/**
 * Creates soap server with constructor override
 */
export function createSoapServer(router: Router, options: ISoapOptions): ISoapServer {

  options = Object.assign({}, options);

  const wsdl = new WSDL(options.wsdl || options.xml || options.services, options.uri, options);
  const server: ISoapServer = Object.create(Server.prototype);
  ExpressServerConstructor.call(server, router, options.services, wsdl);

  return server;
}

/**
 * Soap server middleware. Entry point of express-soap
 */
export function soap(options: ISoapOptions): Router {

  const router = Router();

  createSoapServer(router, options);

  return router;
}
