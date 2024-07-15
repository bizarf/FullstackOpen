import { useState } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import { useEffect } from "react";
import personService from "./services/persons";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [nameFilter, setNameFilter] = useState("");

    useEffect(() => {
        personService.getAll().then((initialData) => {
            setPersons(initialData);
        });
    }, []);

    const addNumber = (e) => {
        e.preventDefault();
        const newPerson = {
            name: newName,
            number: newNumber,
        };

        if (persons.some((person) => person.name === newName)) {
            const person = persons.find((person) => person.name === newName);

            if (
                window.confirm(
                    `${person.name} is already added to phonebook, replace the old number with a new one?`
                )
            ) {
                personService
                    .update(person.id, newPerson)
                    .then((returnedNote) => {
                        setPersons(
                            persons.map((p) =>
                                p.id !== person.id ? p : returnedNote
                            )
                        );
                    });
            }
        } else {
            personService.create(newPerson).then((returnedData) => {
                setPersons([...persons, returnedData]);
                setNewName("");
                setNewNumber("");
            });
        }
    };

    const deleteNumber = (id) => {
        const person = persons.find((person) => person.id === id);
        if (window.confirm(`Delete ${person.name}`)) {
            personService.remove(id, person).then(() => {
                setPersons(persons.filter((person) => person.id !== id));
            });
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
            <Persons
                filteredPersons={filteredPersons}
                deleteNumber={deleteNumber}
            />
        </div>
    );
};

export default App;
