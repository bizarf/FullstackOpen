import Part from "./Part";
import { v4 as uuidv4 } from "uuid";

const Content = ({ course }) => {
    const { parts } = course;

    return (
        <>
            {parts.map((part) => {
                return (
                    <p key={uuidv4()}>
                        <Part part={part} />
                    </p>
                );
            })}
        </>
    );
};

export default Content;
