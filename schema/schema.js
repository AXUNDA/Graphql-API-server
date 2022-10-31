const graphql = require('graphql');
const mongoose = require('mongoose')
const Author = require('../models/author.js')
const Book = require('../models/book.js')
mongoose.connect("mongodb://localhost:27017/booksDb", {
  useNewUrlParser: true
})
const _ = require('lodash');
const {GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID,GraphQLInt,GraphQLList,GraphQLNonNull} = require('graphql');
mongoose.connection.once("open",()=> {
    console.log("connected to the database")
})
// var books = [
//     {name:"harry porter",genre:"magic",id:"1",authorId:"1"},
//     {name:"game of thrones",genre:"epic",id:"2",authorId:"2"},
//     {name:"peter man",genre:"mystical",id:"3",authorId:"3"},
//     {name:"big game",genre:"traditional",id:"4",authorId:"1"},
//     {name:"twice as tall",genre:"afro beat",id:"5",authorId:"2"},
//     {name:"made in lagos",genre:"fusion",id:"6",authorId:"3"}


// ]
// var authors = [
//     {name:"patrick james",age:22,id:"1"},
//     {name:"john jack",age:45,id:"2"},
//     {name:"jones jane",age:50,id:"3"}
// ]
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields:() => ({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                // console.log(parent,args)
                return Author.findById(parent.authorid);
                // return _.find(authors,{id:parent.authorId})
            }
        }


    })



})
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields:() => ({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find({authorid:parent.id});
                // return _.filter(books,{authorId:parent.id})
            }
        }


    })



})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return Book.findById(args.id);
                // return _.find(books,{id:args.id})
                
                // code to get data from db
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve:async(parent,args)=>{
                try {
                    const autors =await Author.findById(args.id);
                    return authors
                    
                } catch (error) {
                    return error
                    
                }
                
                
                // return _.find(authors,{id:args.id})
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                // return books
                return Book.find();
            }
        },
        authors:{
            type:new GraphQLList(AuthorType),
            resolve(parent,args){
                return Author.find();
                // return authors
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        addAuthor: {
            type:AuthorType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                const author = new Author({
                    name:args.name,
                    age:args.age

                })
                return author.save()
            }
        },
        addBook:{
            type:BookType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                genre:{type:new GraphQLNonNull(GraphQLString)},
                authorid:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                const book = new Book({
                    name:args.name,
                    genre:args.genre,
                    authorid:args.authorid
                })
                return book.save()
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
})