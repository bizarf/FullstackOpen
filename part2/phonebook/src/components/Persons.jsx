import { v4 as uuidv4 } from "uuid";

const Persons = ({ filteredPersons, deleteNumber }) => {
    return (
        <ul>
            {filteredPersons.map((person) => {
                return (
                    <li key={uuidv4()}>
                        {person.name} {person.number}{" "}
                        <button onClick={() => deleteNumber(person.id)}>
                            delete
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default Persons;
