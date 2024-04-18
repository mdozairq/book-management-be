const fs = require('fs');
const { MongoClient } = require('mongodb');


const uri = "mongodb://localhost:27017"
let fileContents = fs.readFileSync(`./migrations/Books.json`);
let membersFileContents = fs.readFileSync(`./migrations/members.json`);
let BookData = JSON.parse(fileContents);
let membersData = JSON.parse(membersFileContents);


const options = { useNewUrlParser: true, useUnifiedTopology: true };

const dbName = 'mern-challenge';
const booksCollectionName = 'books';
const membersCollectionName = 'members';




async function connectToMongoDB() {
    console.log("Heere");
    try {
        const client = await MongoClient.connect(uri, options);
        const booksCollection = client.db(dbName).collection(booksCollectionName);
        const membersCollection = client.db(dbName).collection(membersCollectionName);
        return { client, booksCollection, membersCollection };
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        throw err;
    }
}





const main = async () => {
    const { client, booksCollection, membersCollection } = await connectToMongoDB();
    console.log(BookData.length);
    for (const d of BookData) {
        let book = await booksCollection.insertOne({ _id: d.BookID.toString(), book_name: d.BookName, number_of_copies: d.NumberOfCopies, is_active: true, created_at: new Date(), updated_at: new Date() })
        console.log(book);
    }

    
    for (const d of membersData) {
        let member = await membersCollection.insertOne({ _id: d.MemberID.toString(), member_name: d.MemberName, is_active: true, created_at: new Date(), updated_at: new Date() })
        console.log(member);
    }
}

main().catch(console.error);