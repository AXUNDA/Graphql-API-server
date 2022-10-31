const express = require('express');
// const graphqlHTTP = require('express-graphql');
const { graphqlHTTP } = require('express-graphql');
const myschema = require("./schema/schema.js")
const app = express();
var cors = require('cors')
app.use(cors())
app.use("/graphql",graphqlHTTP({
    schema: myschema,
    graphiql: true



}));
app.listen(4000, function(){
    console.log('app is active')
});