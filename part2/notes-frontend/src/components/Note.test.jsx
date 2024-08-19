import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Note from "./Note";

test("renders content", () => {
    // make a note object for our test
    const note = {
        content: "Component testing is done with react-testing-library",
        important: true,
    };

    // this renders the component with any state you provide through react-testing-library
    render(<Note note={note} />);

    // search for this element containing this text
    const element = screen.getByText(
        "Component testing is done with react-testing-library"
    );
    // expect the above element to exist
    expect(element).toBeDefined();

    // alternative way to check if the content renders
    // const { container } = render(<Note note={note} />);

    // const div = container.querySelector(".note");
    // expect(div).toHaveTextContent(
    //     "Component testing is done with react-testing-library"
    // );

    // prints out the html of a component, or a specific element
    // screen.debug()
});

test("clicking the button calls event handler once", async () => {
    const note = {
        content: "Component testing is done with react-testing-library",
        important: true,
    };

    // mock function
    const mockHandler = vi.fn();

    render(<Note note={note} toggleImportance={mockHandler} />);

    // init userEvent with a setup
    const user = userEvent.setup();
    // define the button, and then click that button
    const button = screen.getByText("make not important");
    await user.click(button);

    // verify that the mock function has been called once
    expect(mockHandler.mock.calls).toHaveLength(1);
});
