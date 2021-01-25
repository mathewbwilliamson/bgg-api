require('dotenv').config();

export const dbPassword = process.env.DB_PASSWORD
export const dbUsername = process.env.DB_USERNAME
export const dbConnectionString = `mongodb+srv://${dbUsername}:${dbPassword}@basicpersonal.qv7dc.mongodb.net/bgg-collections?retryWrites=true&w=majority`
