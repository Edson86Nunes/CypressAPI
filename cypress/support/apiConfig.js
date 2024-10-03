
export const clientId = '67823c6d-58de-494f-96d9-86a4c22682cb';
export const clientSecret = 'c2d6a06f-5f31-448b-9079-7e170e8536e4';
export const authBase64 = btoa(`${clientId}:${clientSecret}`);
export const URL = 'https://api-homologacao.getnet.com.br/auth/oauth/v2/token';


export const requestAuth = (headers = {}, body = {}, failOnStatusCode = true) => {
  return cy.request({
    method: 'POST',
    url: URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers
    },
    body,
    form: true,
    failOnStatusCode
  });
};
