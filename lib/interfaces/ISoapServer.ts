import {Server} from 'soap';

export interface ISoapServer extends Server {

  path: string;
  services: any;
  wsdl: any;
  authorizeConnection: Function;

  _requestListener: Function;
  _initializeOptions: Function;
}
