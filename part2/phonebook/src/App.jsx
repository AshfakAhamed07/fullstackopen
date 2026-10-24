import { useEffect, useState } from "react";
import { getAll, create, remove, update } from "./services/persons";

const Filter = ({ searchName, handleSearchName }) => {
  return (
    <div>
      filter shown with:{" "}
      <input value={searchName} onChange={handleSearchName} />
    </div>
  );
};

const PersonForm = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
  addName,
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, searchName, deletePerson }) => {
  return (
    <ul>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(searchName.toLowerCase()),
        )
        .map((person) => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
          </li>
        ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    getAll()
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        console.error("Error fetching persons:", error);
      });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`,
      );

      if (!confirmUpdate) {
        return;
      }
      const changedPerson = {
        ...existingPerson,
        number: newNumber,
      };

      update(existingPerson.id, changedPerson)
        .then((response) => {
          setPersons(
            persons.map((person) =>
              person.id === response.data.id ? response.data : person,
            ),
          );
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          console.error("Error updating person:", error);
        });

      return;
    }

    const newNameObject = {
      name: newName,
      number: newNumber,
    };

    create(newNameObject)
      .then((response) => {
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.error("Error adding person:", error);
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const deletePerson = (id) => {
    const confirmDeletion = confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmDeletion) {
      return;
    }

    remove(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting person:", error);
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchName={searchName} handleSearchName={handleSearchName} />
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        searchName={searchName}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
