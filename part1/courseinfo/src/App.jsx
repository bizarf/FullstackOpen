/* eslint-disable react/prop-types */
const App = () => {
    const course = {
        name: "Half Stack application development",
        parts: [
            {
                name: "Fundamentals of React",
                exercises: 10,
            },
            {
                name: "Using props to pass data",
                exercises: 7,
            },
            {
                name: "State of a component",
                exercises: 14,
            },
        ],
    };

    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    );
};

const Header = ({ course }) => {
    const { name } = course;

    return <h1>{name}</h1>;
};

const Content = ({ course }) => {
    const { parts } = course;

    return (
        <div>
            <Part parts={parts[0]} />
            <Part parts={parts[1]} />
            <Part parts={parts[2]} />
        </div>
    );
};

const Total = ({ course }) => {
    const { parts } = course;

    return (
        <p>
            Number of exercises{" "}
            {parts[0].exercises + parts[1].exercises + parts[2].exercises}
        </p>
    );
};

const Part = ({ parts }) => {
    const { name, exercises } = parts;

    return (
        <p>
            {name} {exercises}
        </p>
    );
};

export default App;
