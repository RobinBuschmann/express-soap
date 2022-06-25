import {Server} from 'soap';

// @ts-ignore
export interface ISoapServer extends Server {
  suppressStack: any;
  returnFault: any;
  onewayOptions: any;

  _requestListener: Function;
  _initializeOptions: Function;
}
