describe("Basic Checks", () => {
    it("opens the homepage", () => {
        cy.visit("/");
        cy.get('[data-cy="title"]').should("be.visible");
        cy.get('[data-cy="title"]').should("contain.text", "Spotify");
    });

    it("displays the site title in the header", () => {
        cy.visit("/");
        cy.get("header").within(() => {
            cy.get('[data-cy="title"]').should("contain.text", "Spotify");
        });
    });

    it("shows at least one album card", () => {
        cy.visit("/");
        cy.get(".card").its("length").should("be.gte", 1);
    });

    it("album card has a title and price", () => {
        cy.visit("/");
        cy.get(".card")
            .first()
            .within(() => {
                cy.get("h2").should("be.visible").and("not.be.empty");
                cy.get("p").contains("ID").should("be.visible");
            });
    });

    it("has a visible search input on the top", () => {
        cy.visit("/");
        cy.get('input[type="text"]').should("be.visible");
    });

    it("allows typing into the search input", () => {
        cy.visit("/");
        const searchTerm = "Test Search";
        cy.get('input[type="text"]').type(searchTerm).should("have.value", searchTerm);
    });

    it("search input is empty by default", () => {
        cy.visit("/");
        cy.get('input[type="text"]').should("have.value", "");
    });

    it("navigates to album detail page when clicking Detail button", () => {
        cy.visit("/");
        cy.get(".card")
            .first()
            .within(() => {
                cy.get("a").contains("Detail").click();
            });
        cy.url().should("include", "/album/");
    });

    it("card album has a author name and release date", () => {
        cy.visit("/");
        cy.get(".card")
            .first()
            .within(() => {
                cy.get("p").contains("Author").should("be.visible").and("not.be.empty");
                cy.get("p").contains("Release Date").should("be.visible").and("not.be.empty");
            });
    });

    it("has a visible search input on the top", () => {
        cy.visit("/");
        cy.get('input[type="text"]').should("be.visible");
    });

    it("shows at least one album card", () => {
        cy.visit("/");
        cy.get(".card").its("length").should("be.gte", 1);
    });

    it("footer is visible", () => {
        cy.visit("/");
        cy.get("footer").should("be.visible");
    });

    it("nagigates back to home page", () => {
        cy.visit("/album/1");
        cy.get("a").contains("Spotify").click();
        cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
});

describe("API checks", () => {
    it("mock ablums", () => {
        cy.intercept("GET", "/api/albums", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    name: "Ripcord",
                    release_date: 1755448583576,
                    author_name: "Tainy",
                    author_id: 1
                }
            ]
        }).as("getAlbums");
        cy.visit("/");
        cy.wait("@getAlbums");
        cy.contains("Ripcord").should("be.visible");
    });

    it("mock error response", () => {
        cy.intercept("GET", "/api/albums", {
            statusCode: 500
        }).as("getAlbumsError");
        cy.visit("/");
        cy.wait("@getAlbumsError");
        cy.contains("Failed to load albums").should("be.visible");
    });

    it("mock search", () => {
        cy.intercept("GET", "/api/search/ma", {
            body: {
                songs: [
                    {
                        id: 1,
                        name: "I'm Sorry",
                        album_name: "Ripcord",
                        author_name: "Tainy"
                    }
                ],
                albums: [
                    {
                        id: 2,
                        name: "Rise Of An Empire",
                        release_date: 1747999299470,
                        author_name: "Tainy",
                        author_id: 1
                    }
                ],
                authors: [
                    {
                        id: 4,
                        name: "Marco Antonio Solís",
                        bio: null
                    }
                ]
            }
        }).as("getSearchApi");
        cy.visit("/search?q=ma");
        cy.wait("@getSearchApi");
        cy.contains("I'm Sorry").should("be.visible");
    });
    it("mock loading state", () => {
        cy.intercept("GET", "/api/albums", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    name: "Ripcord",
                    release_date: 1755448583576,
                    author_name: "Tainy",
                    author_id: 1
                }
            ]
        }).as("getAlbumsDelay");
        cy.visit("/");
        cy.contains("Loading...").should("be.visible");
        cy.wait("@getAlbumsDelay");
        cy.contains("Loading").should("not.exist");
    });
    it.only("No release date", () => {
        cy.intercept("GET", "/api/albums", {
            body: [
                {
                    id: 1,
                    name: "Ripcord",
                    author_name: "Tainy",
                    author_id: 1
                }
            ]
        }).as("getAlbums");
        cy.visit("/");
        cy.wait("@getAlbums");
        cy.contains("Invalid or missing release date").should("be.visible");
    });
});
