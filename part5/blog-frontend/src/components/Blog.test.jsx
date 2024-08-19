import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
    let container;
    let mockHandler;

    beforeEach(() => {
        // mock function
        mockHandler = vi.fn();

        // blog data
        const blog = {
            title: "Cats are fun",
            author: "May Fair",
            url: "www.example.com",
            likes: 0,
            user: [{ name: "John" }],
        };

        // render the Blog component in a container
        container = render(
            <Blog blog={blog} handleLike={mockHandler} />
        ).container;
    });

    test("renders content", () => {
        const titleText = screen.queryAllByText("Cats are fun");
        const authorText = screen.queryAllByText("May Fair");
        const url = screen.queryByText("www.example.com");
        const likes = screen.queryByText("likes 0");

        expect(titleText).toBeDefined();
        expect(authorText).toBeDefined();
        // toBeNull as it shouldn't exist
        expect(url).toBeNull();
        expect(likes).toBeNull();
    });

    test("url and likes are shown when view details button is clicked", async () => {
        const user = userEvent.setup();
        const button = screen.getByText("view");
        await user.click(button);

        const url = screen.queryByText("www.example.com");
        const likes = screen.queryByText("likes 0");
        expect(url).toBeDefined();
        expect(likes).toBeDefined();
    });

    test("like button is clicked twice", async () => {
        const user = userEvent.setup();
        const button = screen.getByText("view");
        await user.click(button);

        const likeBtn = screen.getByText("like");
        await user.click(likeBtn);
        await user.click(likeBtn);

        expect(mockHandler.mock.calls).toHaveLength(2);
    });
});
