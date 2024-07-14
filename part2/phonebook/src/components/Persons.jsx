import { v4 as uuidv4 } from "uuid";

const Persons = ({ filteredPersons }) => {
    return (
        <ul>
            {filteredPersons.map((person) => {
                return (
                    <li key={uuidv4()}>
                        {person.name} {person.number}
                    </li>
                );
            })}
        </ul>
    );
};

export default Persons;
