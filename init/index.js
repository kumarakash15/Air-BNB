const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // force Google DNS

const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

require("dotenv").config({ path: "../.env" });

const dbUrl = process.env.ATLASDB_URL;

mongoose.set("strictQuery", true);

main()
  .then(async () => {
    console.log("Connected to Mongo Atlas");
    await initDB();
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const newData = initdata.data.map((obj) => ({
    ...obj,
    owner: "69a852b4507a4ec2fea0e75f",
  }));

  await Listing.insertMany(newData);

  console.log("Data initialized successfully");
};