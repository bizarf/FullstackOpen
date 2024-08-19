import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
    // mock function
    const handleNewBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm handleNewBlog={handleNewBlog} />);

    // use getAllByRole to find all the textbox element in the form
    const input = screen.getAllByRole("textbox");
    const sendButton = screen.getByText("Create");

    // title field
    await user.type(input[0], "Dogs are fun");
    // author field
    await user.type(input[1], "Nancy Po");
    // url field
    await user.type(input[2], "www.example.com");
    await user.click(sendButton);

    // expect the function to have run once
    expect(handleNewBlog.mock.calls).toHaveLength(1);
    expect(handleNewBlog.mock.calls[0][0].title).toBe("Dogs are fun");
    expect(handleNewBlog.mock.calls[0][0].author).toBe("Nancy Po");
    expect(handleNewBlog.mock.calls[0][0].url).toBe("www.example.com");
});
