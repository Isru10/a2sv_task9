// custom `login` command.
Cypress.Commands.add('login', (email, password) => {

  cy.session([email, password], () => {

    cy.visit('/auth/signin');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    

    cy.url().should('not.include', '/auth/signin');
    cy.contains('Opportunities').should('be.visible');
  }, {

    validate() {

      cy.getCookie('next-auth.session-token').should('exist');
    },
  });
});