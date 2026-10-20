import { useEffect, useState } from "react";
import axios from "axios";

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

const Persons = ({ persons, searchName }) => {
  return (
    <ul>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(searchName.toLowerCase()),
        )
        .map((person) => (
          <li key={person.id}>
            {person.name} {person.number}
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
    axios
      .get("http://localhost:3001/persons")
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        console.error("Error fetching persons:", error);
      });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    if (
      persons.some(
        (person) => person.name.toLowerCase() === newName.toLowerCase(),
      )
    ) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newNameObject = {
      name: newName,
      number: newNumber,
      id: persons.length > 0 ? Math.max(...persons.map((p) => p.id)) + 1 : 1,
    };

    setPersons(persons.concat(newNameObject));
    setNewName("");
    setNewNumber("");
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
      <Persons persons={persons} searchName={searchName} />
    </div>
  );
};

export default App;
