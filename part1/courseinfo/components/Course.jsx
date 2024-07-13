import Header from "./Header";
import Content from "./Content";
import Total from "./Total";
import { v4 as uuidv4 } from "uuid";

const Course = ({ courses }) => {
    return (
        <>
            {courses.map((course) => {
                return (
                    <div key={uuidv4()}>
                        <Header course={course} />
                        <Content course={course} />
                        <Total course={course} />
                    </div>
                );
            })}
        </>
    );
};

export default Course;
