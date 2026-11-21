const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log("Invalid arguments");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ashfakjr11_db_user:${password}@cluster0.ypdgotd.mongodb.net/phonebook`;

mongoose.set("strictQuery", false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose
  .connect(url, { family: 4 })
  .then(() => {
    if (process.argv.length === 5) {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      });

      return person.save().then(() => {
        console.log(
          `added ${person.name} number ${person.number} to phonebook`,
        );
      });
    }

    if (process.argv.length === 3) {
      return Person.find({}).then((result) => {
        console.log("phonebook:");
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
      });
    }
  })
  .catch((error) => {
    console.error("Database error:", error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    return mongoose.connection.close();
  });
