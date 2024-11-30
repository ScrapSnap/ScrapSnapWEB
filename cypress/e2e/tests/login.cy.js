describe('Login Page Test', () => {
    const loginUrl = 'http://localhost:5173/#/auth/login';
    const dashboardUrl = 'http://localhost:5173/#/';

    beforeEach(() => {
        cy.visit(loginUrl);
    });

    it('Should display the login page', () => {
        cy.contains('button', 'Sign In').should('be.visible').click();
        cy.url().should('eq', loginUrl);
    });

    it('Should display an error for invalid credentials', () => {
        cy.get('#email1').type('invalid@example.com');
        cy.get('#password1').type('wrongpassword');
        cy.contains('button', 'Sign In').should('be.visible').click();
        cy.get('.p-toast').should('be.visible');
        cy.get('.p-toast').should('contain.text', 'Error');
    });

    it('Should login with valid credentials', () => {
        cy.get('#email1').type('admin@scrap-snap.com');
        cy.get('#password1').type('demo');
        cy.contains('button', 'Sign In').should('be.visible').click();
        cy.url().should('eq', dashboardUrl);
    });

    it('Should redirect to register page', () => {
        cy.contains('a', 'Don\'t have account yet? Sign up').should('be.visible').click();
        cy.url().should('eq', 'http://localhost:5173/#/auth/register');
    });
});
