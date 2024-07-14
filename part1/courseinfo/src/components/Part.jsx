const Part = ({ part }) => {
    const { name, exercises } = part;

    return (
        <>
            {name} {exercises}
        </>
    );
};

export default Part;
