const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/edteam_electron")
  .then((db) => console.log("MONGODB is connected"))
  .catch((error) => console.log(error));
