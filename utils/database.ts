import { MongoClient} from 'mongodb';

const uri = `mongodb+srv://admin-persional-user:<password>@basicpersonal.qv7dc.mongodb.net/<dbname>?retryWrites=true&w=majority`

const mongoClient = new MongoClient(uri, { useNewUrlParser: true });

mongoClient.connect(err => {
  const collection = mongoClient.db("test").collection("devices");
  // perform actions on the collection object
  mongoClient.close();
});