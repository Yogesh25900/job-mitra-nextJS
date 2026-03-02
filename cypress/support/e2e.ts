// Global Cypress support setup

Cypress.on("uncaught:exception", (error) => {
	if (error.message.includes("Hydration failed because the server rendered HTML didn't match the client")) {
		return false;
	}

	return true;
});
