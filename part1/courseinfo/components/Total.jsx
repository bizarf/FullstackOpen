const Total = ({ course }) => {
    const { parts } = course;

    const total = parts.reduce((s, p) => {
        return s + p.exercises;
    }, 0);

    return <p>Total of {total} exercises</p>;
};

export default Total;
