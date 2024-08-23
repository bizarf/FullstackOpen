const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");
const { create } = require("domain");

describe("Blog app", () => {
    beforeEach(async ({ page, request }) => {
        // test route resets the database
        await request.post("/api/testing/reset");
        // create new users
        await request.post("/api/users", {
            data: {
                name: "John Doe",
                username: "jdoe",
                password: "genericPassword57",
            },
        });
        await request.post("/api/users", {
            data: {
                name: "Elina Hawa",
                username: "ehawa",
                password: "topsecret3473",
            },
        });
        // load the page
        await page.goto("http://localhost:5173");
    });

    test("login form is shown", async ({ page }) => {
        expect(page.getByText("Log in to the application")).toBeVisible();
    });

    describe("Login", () => {
        test("succeeds with correct credentials", async ({ page }) => {
            // login function
            await loginWith(page, "jdoe", "genericPassword57");

            await expect(page.getByText("John Doe logged in")).toBeVisible();
        });

        test("fails with wrong credentials", async ({ page }) => {
            await loginWith(page, "jdoe", "tg309uu0glk");

            // page.locator finds the element with the class of error
            const errorDiv = page.locator(".error");
            await expect(errorDiv).toContainText("Wrong username or password");
            await expect(errorDiv).toHaveCSS("border-style", "solid");
            // color has to be rgb code
            await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

            await expect(
                page.getByText("John Doe logged in")
            ).not.toBeVisible();
        });

        describe("When logged in", () => {
            beforeEach(async ({ page }) => {
                // log in first
                await loginWith(page, "jdoe", "genericPassword57");
            });

            test("a new blog can be created", async ({ page }) => {
                // create a new blog entry
                await createBlog(
                    page,
                    "Cats are fun",
                    "Jane Smith",
                    "www.example.com"
                );

                await expect(
                    page.getByText("Cats are fun Jane Smith")
                ).toBeVisible();
            });

            describe("a post exists", () => {
                beforeEach(async ({ page }) => {
                    // create a new blog entry before each test
                    await createBlog(
                        page,
                        "Cats are fun",
                        "Jane Smith",
                        "www.example.com"
                    );
                });

                test("a blog can be liked", async ({ page }) => {
                    await page.getByRole("button", { name: "view" }).click();
                    await page.getByRole("button", { name: "like" }).click();

                    await expect(page.getByText("likes 1")).toBeVisible();
                });

                test("a blog the user created can be deleted", async ({
                    page,
                }) => {
                    // this is a dialog listener and the code has to go here first before any events
                    page.on("dialog", async (dialog) => {
                        await dialog.accept();
                    });

                    await page.getByRole("button", { name: "view" }).click();
                    await page.getByRole("button", { name: "remove" }).click();

                    await expect(
                        page.getByText("Cats are fun Jane Smith")
                    ).not.toBeVisible();
                });

                test("deletable blog can only be seen by the creator", async ({
                    page,
                }) => {
                    // check the delete button is available for the user that added that blog
                    await page.getByRole("button", { name: "view" }).click();
                    await expect(
                        page.getByRole("button", { name: "remove" })
                    ).toBeVisible();

                    // logout and then login to another account to check that the remove button isn't available
                    await page.getByRole("button", { name: "logout" }).click();

                    await loginWith(page, "ehawa", "topsecret3473");
                    await page.getByRole("button", { name: "view" }).click();
                    await expect(
                        page.getByRole("button", { name: "remove" })
                    ).not.toBeVisible();
                });

                test("blogs are arrange in order with most likes being first", async ({
                    page,
                }) => {
                    await createBlog(
                        page,
                        "Dogs are fun",
                        "Vida Aibek",
                        "www.example.com"
                    );

                    const dogsEntry = page.getByText("Dogs are fun Vida Aibek");
                    // find the view button next to the dogs are fun blog post by setting the locator as ".." which means next element after the above element
                    await dogsEntry
                        .getByRole("button", { name: "view", locator: ".." })
                        .click();
                    await page.getByRole("button", { name: "like" }).click();
                    await expect(page.getByText("likes 1")).toBeVisible();

                    const catsEntry = page.getByText("Cats are fun Jane Smith");
                    await catsEntry
                        .getByRole("button", { name: "view", locator: ".." })
                        .click();
                    await expect(page.getByText("likes 0")).toBeVisible();
                });
            });
        });
    });
});
