describe("Album Catalog - Interactions", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("looks for songs when searching via search bar", () => {
        const searchTerm = "test";

        cy.get('[data-cy="search-input"]').type(searchTerm);
        cy.contains("Search").click();

        cy.url().should("include", `/search?q=${searchTerm}`);
    });

    it("navigates to the first album detail", () => {
        cy.get('[data-cy="album-card"]')
            .first()
            .within(() => {
                cy.get("a").contains("Detail").click();
            });

        cy.url().should("match", /\/album\/\d+$/);
    });

    it("navigates to home page after clicking on Spotify logo", () => {
        cy.get('[data-cy="album-card"]')
            .first()
            .find("a")
            .contains("Detail")
            .click();
        cy.url().should("include", "/album/");

        cy.get('[data-cy="home-link"]').click();

        cy.url().should("eq", Cypress.config().baseUrl + "/");
        cy.get('[data-cy="album-grid"]').should("be.visible");
    });

    it("preserves search term in input after search", () => {
        const searchTerm = "test song";

        cy.get('[data-cy="search-input"]').type(searchTerm);
        cy.contains("Search").click();

        cy.get('[data-cy="search-input"]').should("have.value", searchTerm);
    });

    it("displays all three sections in search results", () => {
        const searchTerm = "a"; // Using a common letter to ensure some results

        cy.get('[data-cy="search-input"]').type(searchTerm);
        cy.contains("Search").click();

        cy.get('[data-cy="songs-section-title"]').should("be.visible");
        cy.get('[data-cy="albums-section-title"]').should("be.visible");
        cy.get('[data-cy="authors-section-title"]').should("be.visible");
    });
});
