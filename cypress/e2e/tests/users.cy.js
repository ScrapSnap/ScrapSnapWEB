describe('Users Page Test', () => {
    const usersUrl = 'http://localhost:5173/#/users';
    const loginUrl = 'http://localhost:5173/#/auth/login';
    const dashboardUrl = 'http://localhost:5173/#/';

    beforeEach(() => {
        cy.visit(loginUrl);
        cy.get('#email1').type('admin@scrap-snap.com');
        cy.get('#password1').type('demo');
        cy.contains('button', 'Sign In').should('be.visible').click();
        cy.url().should('eq', dashboardUrl);
        cy.visit(usersUrl);
        cy.url().should('eq', usersUrl);
    });

    it('Should contain table', () => {
        cy.get('table').should('be.visible');
    });

    it('Should contain add user button', () => {
        cy.contains('button', 'New User').should('be.visible');
    });

    it('Should open create user modal', () => {
        cy.contains('button', 'New User').should('be.visible').click();
        cy.get('.p-dialog').should('be.visible');
    });

    it('Should add create user', () => {
        cy.contains('button', 'New User').should('be.visible').click();
        cy.get('.p-dialog').should('be.visible');

        // Check Role Dropdown
        cy.get('#role-dropdown').click();
        cy.get('.p-dropdown-item').first().click();

        // Check Name Input
        cy.get('#firstname-input').type('TEST');

        // Check Last Name Input
        cy.get('#lastname-input').type('TEST');

        // Check Email Input
        cy.get('#email-input').type('TEST');

        // Location Input
        cy.get('#location-input').type('TEST');

        // Check Password Input
        cy.get('#password-input').type('TEST');

        // Submit the form
        cy.contains('button', 'Save').click();
        cy.get('.p-toast').should('be.visible');
        cy.get('.p-toast').should('contain.text', 'Success');
    });

    it('Should check empty inputs', () => {
        cy.contains('button', 'New User').should('be.visible').click();
        cy.get('.p-dialog').should('be.visible');
        cy.contains('button', 'Save').click();
        cy.get('.p-toast').should('be.visible');
        cy.get('.p-toast').should('contain.text', 'Info');
    });
});
