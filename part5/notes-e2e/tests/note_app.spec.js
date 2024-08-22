const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createNote } = require("./helper");

describe("Note app", () => {
    beforeEach(async ({ page, request }) => {
        // test route resets the database
        await request.post("/api/testing/reset");
        // make a new user
        await request.post("/api/users", {
            data: {
                name: "Matti Luukkainen",
                username: "mluukkai",
                password: "salainen",
            },
        });
        // loads the page
        await page.goto("/");
    });

    test("front page can be opened", async ({ page }) => {
        // finds text on the page
        const locator = page.getByText("Notes");
        // things we want the test to expect
        await expect(locator).toBeVisible();
        await expect(
            page.getByText(
                "Note app, Department of Computer Science, University of Helsinki 2024"
            )
        ).toBeVisible();
    });

    test("login form can be opened", async ({ page }) => {
        await loginWith(page, "mluukkai", "salainen");

        await expect(
            page.getByText("Matti Luukkainen logged in")
        ).toBeVisible();
    });

    test("login fails with wrong password", async ({ page }) => {
        await loginWith(page, "mluukkai", "wrong");

        // await expect(page.getByText("wrong credentials")).toBeVisible();

        // page.locator finds the element with the class of error
        const errorDiv = page.locator(".error");
        await expect(errorDiv).toContainText("Wrong credentials");
        await expect(errorDiv).toHaveCSS("border-style", "solid");
        // color has to be rgb code
        await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

        await expect(
            page.getByText("Matti Luukkainen logged in")
        ).not.toBeVisible();
    });

    describe("when logged in", () => {
        beforeEach(async ({ page }) => {
            // login before each test
            await loginWith(page, "mluukkai", "salainen");
        });

        test("a new note can be created", async ({ page }) => {
            await createNote(page, "a note created by playwright");
            await expect(
                page.getByText("a note created by playwright")
            ).toBeVisible();
        });

        describe("and a note exists", () => {
            beforeEach(async ({ page }) => {
                await createNote(page, "first note", true);
                await createNote(page, "second note", true);
                await createNote(page, "third note", true);
            });

            test("importance can be changed", async ({ page }) => {
                await page.pause();
                const otherNoteText = page.getByText("second note");
                const otherdNoteElement = otherNoteText.locator("..");

                await otherdNoteElement
                    .getByRole("button", { name: "make not important" })
                    .click();
                await expect(
                    otherdNoteElement.getByText("make important")
                ).toBeVisible();
            });
        });
    });
});
