import 'es6-shim';
import {expect} from 'chai';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import {spy} from 'sinon';
import * as request from 'supertest';
import {parseString} from 'xml2js';
import {app, SOAP_PATH, controllers, HELLO_WORLD_PATH} from "../app";

chai.use(sinonChai);

const ADD_XML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
   <soapenv:Header/>
   <soapenv:Body>
      <Add>
      	<a>2</a>
      	<b>3</b>
      </Add>
   </soapenv:Body>
</soapenv:Envelope>`;
const SUBTRACT_XML = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
   <soapenv:Header/>
   <soapenv:Body>
      <Subtract>
      	<a>2</a>
      	<b>3</b>
      </Subtract>
   </soapenv:Body>
</soapenv:Envelope>`;

describe('CalculationService', () => {

  describe('Add', () => {

    it('should result in http status ok', () =>

      request(app)
        .post(SOAP_PATH)
        .send(ADD_XML)
        .expect(200)
    );

    it('should result with xml body', () =>

      request(app)
        .post(SOAP_PATH)
        .send(ADD_XML)
        .then(data => {

          expect(data).not.to.be.undefined;
          expect(data.text).to.be.a('string');

          parseString(data.text, (err, result) => {
            expect(err).to.be.null;
            expect(result).to.be.an('object');
          });
        })
    );

    it('should result with correct sum', () =>

      request(app)
        .post(SOAP_PATH)
        .send(ADD_XML)
        .then(data => {

          parseString(data.text, (err, result) => {

            expect(result['soap:Envelope']['soap:Body'][0]['AddResponse'][0]['result'][0]).to.eql('5');
          });
        })
    );

  });

  describe('Subtract', () => {

    it('should result in http status ok', () =>

      request(app)
        .post(SOAP_PATH)
        .send(SUBTRACT_XML)
        .expect(200)
    );

    it('should result with xml body', () =>

      request(app)
        .post(SOAP_PATH)
        .send(SUBTRACT_XML)
        .then(data => {

          expect(data).not.to.be.undefined;
          expect(data.text).to.be.a('string');

          parseString(data.text, (err, result) => {
            expect(err).to.be.null;
            expect(result).to.be.an('object');
          });
        })
    );

    it('should result with correct sum', () =>

      request(app)
        .post(SOAP_PATH)
        .send(SUBTRACT_XML)
        .then(data => {

          parseString(data.text, (err, result) => {

            expect(result['soap:Envelope']['soap:Body'][0]['SubtractResponse'][0]['result'][0]).to.eql('-1');
          });
        })
    );

  });
});

describe('middleware', () => {

  it('should call middlewares as expected', () => {

    const afterSoapSpy = spy(controllers.middlewares, 'afterSoap');
    const beforeSoapSpy = spy(controllers.middlewares, 'beforeSoap');

    return request(app)
      .post(SOAP_PATH)
      .send(ADD_XML)
      .then(() => {

        expect(afterSoapSpy).not.to.be.called;
        expect(beforeSoapSpy).to.be.calledOnce;
      });
  });
});

describe(HELLO_WORLD_PATH, () => {

  const helloWorldSpy = spy(controllers, 'helloWorld');

  it(`should call ${HELLO_WORLD_PATH}`, () =>

    request(app)
      .get(HELLO_WORLD_PATH)
      .expect(200)
      .then(() => {

        expect(helloWorldSpy).to.be.calledOnce;
      })
  );
});
