describe('testes Autenticação na API Getnet', () => {

  const clientId = '67823c6d-58de-494f-96d9-86a4c22682cb';
  const clientSecret = 'c2d6a06f-5f31-448b-9079-7e170e8536e4';
  const authString = `${clientId}:${clientSecret}`;

  const clientIdInvalid = '67823c6d-58de-494f-96d9-86a4c22682ce';
  const clientSecretInvalid = 'c2d6a06f-5f31-448b-9079-7e170e8536ee';
  const authStringInvalid = `${clientIdInvalid}:${clientSecretInvalid}`;

  const URL = 'https://api-homologacao.getnet.com.br/auth/oauth/v2/token';


  const authBase64 = btoa(authString);
  const authBase64Invalid = btoa(authStringInvalid);


  describe('Testes de Autenticação na API - Cenários de Sucesso', () => {

  it('Deve retornar status 200 autenticação com sucesso', () => {
    cy.request({
      method: 'POST',
      url: URL,
      headers: {
        'Authorization': `Basic ${authBase64}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        'grant_type': 'client_credentials',
        'scope': 'oob'
      },
      form: true
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log('Access Token:', response.body.access_token);
    });
  });

  it('Deve validar os campos recebidos em uma requisicao StatusCode 200', () => {
    cy.request({
      method: 'POST',
      url: URL,
      headers: {
        'Authorization': `Basic ${authBase64}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        grant_type: 'client_credentials',
        scope: 'oob'
      },
      form: true
    }).then((response) => {

      const { access_token, token_type, expires_in } = response.body;
      expect(access_token).to.exist;
      expect(token_type).to.eq('Bearer');
      expect(expires_in).to.eq(3600);
    });
  });
});


  describe('Testes de Autenticação na API - Cenários de Erro', () => {

    it('Deve retornar status 401  Authorization vazio', () => {
      cy.request({
        method: 'POST',
        url: URL,
        headers: {
          'Authorization': ``,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          'grant_type': 'client_credentials',
          'scope': 'oob'
        },
        form: true,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('deve retornar status 401 com Authorization invalido', () => {
      cy.request({
        method: 'POST',
        url: URL,
        headers: {
          'Authorization': `Basic ${authBase64Invalid}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          'grant_type': 'client_credentials',
          'scope': 'oob'
        },
        form: true,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  

    it('Deve retornar status 400 ao chamar a API sem campo Authorization', () => {
      cy.request({
        method: 'POST',
        url: URL,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'  // Apenas o Content-Type está presente
        },
        body: {
          grant_type: 'client_credentials',  // Tipo de autenticação esperado
          scope: 'oob'  // Escopo esperado (fixo)
        },
        form: true,
        failOnStatusCode: false  // Permite que a requisição falhe sem interromper o teste
      }).then((response) => {
        expect(response.status).to.eq(400);  // Espera-se um status 400
      });
    });


  
    it('Deve retornar status 400 ao chamar a API sem o grant_type', () => {
      cy.request({
        method: 'POST',
        url: URL,
        headers: {
          'Authorization': `Basic ${authBase64}`,  // Adiciona o header de autorização
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          scope: 'oob' 
        },
        form: true,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);  // Espera-se um status 400
      });
    });

    it('Deve retornar status 400 ao chamar a API sem o scope', () => {
      cy.request({
        method: 'POST',
        url: URL,
        headers: {
          'Authorization': `Basic ${authBase64}`,  // Adiciona o header de autorização
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          grant_type: 'client_credentials'
          //scope: 'oob'  
        },
        form: true,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);  // Espera-se um status 400
      });
    });

    it('Deve retornar status 400 ao chamar a API sem o Content-Type', () => {
      cy.request({
        method: 'POST',
        url: URL,
        headers: {
          'Authorization': `Basic ${authBase64}`  // Adiciona o header de autorização
        },
        body: {
          grant_type: 'client_credentials',
          scope: 'oob'  
        },
        form: true,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);  // Espera-se um status 400
      });
    });
  

  });
});
