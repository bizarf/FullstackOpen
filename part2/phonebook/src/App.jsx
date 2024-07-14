import { useState } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";

const App = () => {
    const [persons, setPersons] = useState([
        { name: "Arto Hellas", number: "040-123456", id: 1 },
        { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
        { name: "Dan Abramov", number: "12-43-234345", id: 3 },
        { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
    ]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [nameFilter, setNameFilter] = useState("");

    const addNumber = (e) => {
        e.preventDefault();
        const newPerson = {
            name: newName,
            number: newNumber,
            id: persons.length + 1,
        };

        if (persons.some((person) => person.name === newName)) {
            alert(`${newName} is already added to phonebook`);
        } else {
            setPersons([...persons, newPerson]);
            setNewName("");
            setNewNumber("");
        }
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleNumberChange = (e) => {
        setNewNumber(e.target.value);
    };

    const handleFilterChange = (e) => {
        setNameFilter(e.target.value);
        console.log(filteredPersons);
    };

    const filteredPersons = nameFilter
        ? persons.filter(({ name }) =>
              name.toLowerCase().startsWith(nameFilter.toLowerCase())
          )
        : persons;

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter
                nameFilter={nameFilter}
                handleFilterChange={handleFilterChange}
            />
            <h3>add a new</h3>
            <PersonForm
                addNumber={addNumber}
                handleNameChange={handleNameChange}
                newName={newName}
                handleNumberChange={handleNumberChange}
                newNumber={newNumber}
            />
            <h3>Numbers</h3>
            <Persons filteredPersons={filteredPersons} />
        </div>
    );
};

export default App;
