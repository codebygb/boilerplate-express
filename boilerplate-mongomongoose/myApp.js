require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

let Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  const personToSave = new Person({
    name: "John",
    age: 30,
    favoriteFoods: ["pizza", "hamburger"],
  });
  personToSave.save(function (err, data) {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
  // done(null, data);
};

const createManyPeople = (arrayOfPeople, done) => {
  const manyPeople = Person.create(arrayOfPeople, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });

  // done(null /*, data*/);
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, data) => {
    if (err) {
      return done(err);
    }
    data.favoriteFoods.push(foodToAdd);
    data.save((err, data) => {
      if (err) {
        return done(err);
      }
      return done(null, data);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    function (err, data) {
      if (err) done(err);
      done(null, data);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, function (err, data) {
    if (err) done(err);
    done(null, data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  const res = Person.remove({ name: nameToRemove }, function (err, data) {
    if (err) done(err);
    done(null, data);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: "asc" })
    .limit(2)
    .select("-age")
    .exec(function (err, data) {
      if (err) done(err);
      done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
