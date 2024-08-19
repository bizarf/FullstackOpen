import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Togglable from "./Togglable";

describe("<Togglable />", () => {
    // empty container variable is declared so it can be used in the tests
    let container;

    // this runs before each test. make a container with the rendered component
    beforeEach(() => {
        container = render(
            <Togglable buttonLabel="show...">
                <div className="testDiv">togglable content</div>
            </Togglable>
        ).container;
    });

    // check the text from the children element has rendered
    test("renders its children", async () => {
        await screen.findAllByText("togglable content");
    });

    // style test to make sure display is none
    test("at start the children are not displayed", () => {
        const div = container.querySelector(".togglableContent");
        expect(div).toHaveStyle("display: none");
    });

    // style test to ensure the display has changed after the userevent fires
    test("after clicking the button, children are displayed", async () => {
        const user = userEvent.setup();
        const button = screen.getByText("show...");
        await user.click(button);

        const div = container.querySelector(".togglableContent");
        expect(div).not.toHaveStyle("display: none");
    });

    test("content can be closed", async () => {
        const user = userEvent.setup();
        const button = screen.getByText("show...");
        await user.click(button);

        const closeButton = screen.getByText("cancel");
        await user.click(closeButton);

        const div = container.querySelector(".togglableContent");
        expect(div).toHaveStyle("display: none");
    });
});
