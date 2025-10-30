describe("Album Catalog - Basic Checks", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("opens the homepage", () => {
        cy.get('[data-cy="title"]').should("be.visible");
        cy.get('[data-cy="title"]').should("contain.text", "Spotify");
    });

    it("displays the site title in the header", () => {
        cy.get('[data-cy="home-link"]').should("be.visible");
        cy.get('[data-cy="home-link"]').should("contain.text", "Spotify");
    });

    it("shows at least one album card", () => {
        cy.get('[data-cy="album-grid"]').should("be.visible");
        cy.get('[data-cy="album-card"]').should("have.length.at.least", 1);
    });

    it("album card has a title and genre", () => {
        cy.get('[data-cy="album-card"]')
            .first()
            .within(() => {
                cy.get('[data-cy="album-title"]').should("be.visible");
                cy.get(".badge").should("contain.text", "Pop");
            });
    });

    it("has a visible search input on the top", () => {
        cy.get('[data-cy="search-input"]').should("be.visible");
        cy.get('[data-cy="search-input"]').should(
            "have.attr",
            "placeholder",
            "Search"
        );
    });
});

describe("Error Handling", () => {
    it("shows error for invalid album ID", () => {
        cy.visit("/album/999999");
        cy.contains("Album not found").should("be.visible");
    });

    it("shows error for non-numeric album ID", () => {
        cy.visit("/album/invalid");
        cy.contains("Invalid Album id").should("be.visible");
    });

    it("shows error for invalid author ID", () => {
        cy.visit("/author/999999");
        cy.contains("Author not found").should("be.visible");
    });

    it("shows error for non-numeric author ID", () => {
        cy.visit("/author/invalid");
        cy.contains("Invalid Album id").should("be.visible");
    });
});
