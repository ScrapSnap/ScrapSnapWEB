describe('Schedules Page Test', () => {
    const schedulesUrl = 'http://localhost:5173/#/schedule';
    const loginUrl = 'http://localhost:5173/#/auth/login';
    const dashboardUrl = 'http://localhost:5173/#/';

    beforeEach(() => {
        cy.visit(loginUrl);
        cy.get('#email1').type('admin@scrap-snap.com');
        cy.get('#password1').type('demo');
        cy.contains('button', 'Sign In').should('be.visible').click();
        cy.url().should('eq', dashboardUrl);
        cy.visit(schedulesUrl);
        cy.url().should('eq', schedulesUrl);
    });

    it('Should contain table', () => {
        cy.get('table').should('be.visible');
    });

    it('Should contain add schedule button', () => {
        cy.contains('button', 'New Schedule').should('be.visible');
    });

    it('Should open create schedule modal', () => {
        cy.contains('button', 'New Schedule').should('be.visible').click();
        cy.get('.p-dialog').should('be.visible');
    });

    it('Should add create schedule', () => {
        cy.contains('button', 'New Schedule').should('be.visible').click();
        cy.get('.p-dialog').should('be.visible');

        // Check Frequency Dropdown
        cy.get('label[for="type"]').should('contain', 'Frequency');
        cy.contains('span.p-dropdown-label', 'Select a Garbage Type').click();
        cy.get('.p-dropdown-item').first().click();
        cy.get('.p-dropdown-label').should('not.have.text', 'Select a Garbage Type');

        // Check Type Dropdown
        cy.get('label[for="type"]').should('contain', 'Type');
        cy.get('#frequency').click();
        cy.get('.p-dropdown-item').first().click();

        // Check Location Input
        cy.get('label[for="location"]').should('contain', 'Location');
        cy.get('input.p-inputtext').eq(0).type('TEST');

        // Check Note Input
        cy.get('label[for="note"]').should('contain', 'Note');
        cy.get('#note-input').click({ force: true }).type('TEST');

        // Submit the form
        cy.contains('button', 'Save').click();
        cy.get('.p-toast').should('be.visible');
    });

    it('Should check empty inputs', () => {
        cy.contains('button', 'New Schedule').should('be.visible').click();
        cy.get('.p-dialog').should('be.visible');

        cy.contains('button', 'Save').click();
        cy.get('.p-toast').should('be.visible');
        cy.get('.p-toast').should('contain.text', 'Info');
    });
});
