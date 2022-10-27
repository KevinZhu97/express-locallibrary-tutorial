const mongoose = require("mongoose");
const { DateTime } = require("luxon");



const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});


AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  if (DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) === "Invalid DateTime") {
    return ""
  }
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  if (DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) === "Invalid DateTime") {
    let death_date = ""
  }
  return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
});

AuthorSchema.virtual("lifespan").get(function () {
  let death_date
  let birth_date
  if (DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) === "Invalid DateTime") {
    death_date = ""
  } else {
    death_date = DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
  }
  if (DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) === "Invalid DateTime") {
    birth_date = ""
  } else {
    birth_date = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
  }
  return (`${birth_date} - ${death_date}`);
});





// Export model
module.exports = mongoose.model("Author", AuthorSchema);
