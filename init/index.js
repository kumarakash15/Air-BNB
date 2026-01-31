const mongoose = require('mongoose');
const initdata=require("./data");
const Listing=require("../models/listing");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(mongo_url);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj, owner:'697e00e9ed6db5b71572d1f4'}));
    await Listing.insertMany(initdata.data);
    console.log("data intialize sucessfully");
}

initDB();