describe('Bookmark Functionality E2E Test', () => {
  
  beforeEach(() => {

    
    cy.intercept('GET', '**/opportunities/search').as('getJobs');
    
    
    
    cy.login('geteadu1@gmail.com', '123456');
    
    
    
    cy.visit('/LandingPage'); 
    
    
    
    cy.wait('@getJobs');
  });

  it('should allow a user to bookmark and unbookmark a job', () => {

    cy.get('body').then($body => {
      if ($body.find('button[aria-label="Remove bookmark"]').length > 0) {
        cy.get('button[aria-label="Remove bookmark"]').each($btn => cy.wrap($btn).click());

        
        cy.wait('@getJobs'); 
      }
    });

    
    const firstCard = cy.get('main > a').first();
    firstCard.find('button[aria-label="Add bookmark"]').click();

    
    
    cy.wait('@getJobs');

    
    
    firstCard.find('button[aria-label="Remove bookmark"]').should('be.visible');

    
    
    firstCard.find('button[aria-label="Remove bookmark"]').click();
    
    
    
    cy.wait('@getJobs');

    
    
    firstCard.find('button[aria-label="Add bookmark"]').should('be.visible');
  });

  it('should correctly display bookmarked items on the Bookmarks page', () => {
    
    cy.get('button[aria-label="Add bookmark"]').first().click();
    cy.wait('@getJobs'); 
    

    
    
    cy.get('button[aria-label="Remove bookmark"]').first().parents('a').find('h2').invoke('text').then((bookmarkedJobTitle) => {

      cy.intercept('GET', '**/bookmarks').as('getBookmarks'); 
      
      cy.contains('My Bookmarks').click();
      
      cy.wait('@getBookmarks'); 
      
      
      cy.url().should('include', '/Bookmarked');
      

      cy.contains(bookmarkedJobTitle).should('be.visible');

      cy.intercept('DELETE', '**/bookmarks/**').as('deleteBookmark');
      cy.contains(bookmarkedJobTitle).parents('a').find('button[aria-label="Remove bookmark"]').click();
      
      cy.wait('@deleteBookmark'); 
      
      
      
      
      cy.contains('No Bookmarks Yet').should('be.visible');
    });
  });
});