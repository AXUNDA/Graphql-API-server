const express = require('express');
// const graphqlHTTP = require('express-graphql');
const { graphqlHTTP } = require('express-graphql');
const myschema = require("./schema/schema.js")
const app = express();
var cors = require('cors')
app.use(cors())
app.use("/graphql", graphqlHTTP({
    schema: myschema,
    graphiql: true



}));

app.get('/',(req,res)=>{
    res.send('hello world')
})
app.listen(process.env.PORT || 3000, function () {
    console.log('app is active')
});
