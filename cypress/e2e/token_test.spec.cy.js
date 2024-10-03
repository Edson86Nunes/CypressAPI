import { authBase64, requestAuth } from '../support/apiConfig';

describe('Testes de Autenticação na API - Cenários de Sucesso', () => {

  it('Deve retornar status 200 autenticação com sucesso', () => {
    requestAuth(
      { 'Authorization': `Basic ${authBase64}` },
      { grant_type: 'client_credentials', scope: 'oob' }
    ).then((response) => {
      expect(response.status).to.eq(200);
      cy.log('Access Token:', response.body.access_token);
    });
  });

  it('Deve validar os campos recebidos em uma requisição com StatusCode 200', () => {
    requestAuth(
      { 'Authorization': `Basic ${authBase64}` },
      { grant_type: 'client_credentials', scope: 'oob' }
    ).then((response) => {
      const { access_token, token_type, expires_in } = response.body;
      expect(access_token).to.exist;
      expect(token_type).to.eq('Bearer');
      expect(expires_in).to.eq(3600);
    });
  });
});

describe('Testes de Autenticação na API - Cenários de Erro', () => {

  it('Deve retornar status 401 com Authorization vazio', () => {
    requestAuth(
      { 'Authorization': ``, },
      { grant_type: 'client_credentials', scope: 'oob' },
      false
    ).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('Deve retornar status 401 com Authorization inválido', () => {
    const authBase64Invalid = btoa('invalidClientId:invalidClientSecret');
    requestAuth(
      { 'Authorization': `Basic ${authBase64Invalid}` },
      { grant_type: 'client_credentials', scope: 'oob' },
      false
    ).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('Deve retornar status 400 ao chamar a API sem campo Authorization', () => {
    requestAuth(
      { 'Content-Type': 'application/x-www-form-urlencoded' },
      { grant_type: 'client_credentials', scope: 'oob' },
      false
    ).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('Deve retornar status 400 ao chamar a API sem o grant_type', () => {
    requestAuth(
      { 'Authorization': `Basic ${authBase64}` },
      { scope: 'oob' },
      false
    ).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('Deve retornar status 400 ao chamar a API sem o scope', () => {
    requestAuth(
      { 'Authorization': `Basic ${authBase64}` },
      { grant_type: 'client_credentials' },
      false
    ).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('Deve retornar status 400 ao chamar a API sem o Content-Type', () => {
    requestAuth(
      { 'Authorization': `Basic ${authBase64}` },
      { grant_type: 'client_credentials', scope: 'oob' },
      false
    ).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});
