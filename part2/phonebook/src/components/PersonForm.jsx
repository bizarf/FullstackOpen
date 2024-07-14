const PersonForm = ({
    addNumber,
    handleNameChange,
    newName,
    handleNumberChange,
    newNumber,
}) => {
    return (
        <form onSubmit={addNumber}>
            <div>
                name:{" "}
                <input onChange={handleNameChange} value={newName} required />
            </div>
            <div>
                number:{" "}
                <input
                    onChange={handleNumberChange}
                    value={newNumber}
                    maxLength={9}
                />
            </div>

            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
};

export default PersonForm;
