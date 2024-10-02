describe('Obter Token de Autenticação da Getnet', () => {

  const clientId = '67823c6d-58de-494f-96d9-86a4c22682cb';
  const clientSecret = 'c2d6a06f-5f31-448b-9079-7e170e8536e4';
  const authString = `${clientId}:${clientSecret}`;
  const URL = 'https://api-homologacao.getnet.com.br/auth/oauth/v2/token';

  
  const authBase64 = btoa(authString);  

  it('Deve retornar status 200 autenticação com sucesso', () => {
    cy.request({
      method: 'POST',
      url: URL,
      headers: {
        'Authorization': `Basic ${authBase64}`,  // Header de autenticação
        'Content-Type': 'application/x-www-form-urlencoded'  // Tipo de conteúdo correto
      },
      body: {
        'grant_type': 'client_credentials',
        'scope': 'oob'
      },
      form: true  // Isso informa ao Cypress para enviar os dados como `x-www-form-urlencoded`
    }).then((response) => {
      expect(response.status).to.eq(200);  
      expect(response.body).to.have.property('access_token');  // Verifique se o token está presente
      expect(response.body).to.have.property('token_type', 'Bearer');  // Verifique se o tipo de token é "Bearer"
      cy.log('Access Token:', response.body.access_token);
    });
  });

  it('Deve retornar status 401 ao chamar a API com campo Authorization vazio', () => {
    cy.request({
      method: 'POST',
      url: URL,
      headers: {
        'Authorization': ``,  //autorização vazia
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        'grant_type': 'client_credentials',
        'scope': 'oob'
      },
      form: true,
      failOnStatusCode: false  // Permitir falha no status code
    }).then((response) => {
      expect(response.status).to.eq(401);  // Espera um status 401 Unauthorized
    });
  });

  it('Deve retornar status 400 ao chamar a API sem campo Authorization', () => {
    cy.request({
      method: 'POST',
      url: URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        'grant_type': 'client_credentials',
        'scope': 'oob'
      },
      form: true,
      failOnStatusCode: false  // Permitir falha no status code
    }).then((response) => {
      // Validação do Status Code
      expect(response.status).to.eq(400);  // Espera um status 400 Invalid
    });
  });

 


});
