
export interface ISoapOptions {

  services: any;
  wsdl: string;
  xml?: string;
  uri?: string;

  ignoredNamespaces?: {
    namespaces?: any
  };
  valueKey?: any;
  xmlKey?: any;
  escapeXML?: any;
  wsdl_headers?: any;
  wsdl_options?: any;
  httpClient?: any;
  request?: any;
  ignoreBaseNameSpaces?: any;
  forceSoap12Headers?: any;
  overrideRootElement?: any;

  [otherOption: string]: any;
}
