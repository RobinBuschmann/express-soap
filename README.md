[![Build Status](https://travis-ci.org/RobinBuschmann/express-soap.png?branch=master)](https://travis-ci.org/RobinBuschmann/express-soap)

# express-soap
An express middleware based upon [node-soap](https://github.com/vpulim/node-soap).

## Installation
```
npm install express-soap --save
```

## Usage
All node-soap options are valid and can be passed. See [node-soap](https://github.com/vpulim/node-soap#options-1) for documentation.
```javascript
import {soap} from 'express-soap';

const app = express();

app.use('/soap/calculation', soap({
    services: {
        CalculatorService: {
            Calculator: {
                Add({a, b}, res) {
                    res({
                        result: a + b
                    });
                },
                Subtract({a, b}, res) {
                    res({
                        result: a - b
                    });
                }
              }
        }
    }, 
    wsdl: `...` // or xml (both options are valid)
}));

app.use('/soap/meta', soap({
    services: {
        MetaService: {
            /* ... */
        }
    }, 
    wsdl: `...` // or xml (both options are valid)
}));
```

## Why?
The current way of how to implement a soap server in express with `node-soap` is really inconvenient
([see](https://github.com/vpulim/node-soap#soaplistenserver-path-services-wsdl---create-a-new-soap-server-that-listens-on-path-and-provides-services)).
`express-soap` simplifies this by providing a middleware instead. Since the order of express 
request handlers and middlewares matters the original node-soap approach is problematic as well.