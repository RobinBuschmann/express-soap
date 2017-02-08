import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import {soap} from "../index";
import {wsdl} from "./wsdls/calculator";
import {calculatorService} from "./services/calculator-service";

export const app = express();

export const SOAP_PATH = '/soap';
export const HELLO_WORLD_PATH = '/hello-world';
export const controllers = {
  middlewares: {
    beforeSoap: (req: Request, res: Response, next: NextFunction) => next(),
    afterSoap: (req: Request, res: Response, next: NextFunction) => next(),
  },
  helloWorld: (req: Request, res: Response, next: NextFunction) => res.send('hello world')
};

app.use((req, res, next) => controllers.middlewares.beforeSoap(req, res, next));

app.use(SOAP_PATH, soap({services: {CalculatorService: calculatorService}, wsdl}));

app.use((req, res, next) => controllers.middlewares.afterSoap(req, res, next));

app.get(HELLO_WORLD_PATH, (req, res, next) => controllers.helloWorld(req, res, next));
