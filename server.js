const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const users = require('./users')

let schema = buildSchema(`
    type Query {
        user(id:Int!) : User
        userByName(name:String!) : User
        usersByStatus(status: String) : [User]
    },
    type Mutation {
        updateUser(id:Int!, name:String!, age: Int) : User
    },
    type User{
       id : Int!
       name: String
       age: Int
       status : String
   }
`)

const getUser = (args) => {
    let { id } = args
    return users.filter(x => x.id == id)[0]
}

const getUserByName = (args) => {
    let { name } = args
    return users.filter(x => x.name == name)[0]
}

const getUsersByStatus = (args) => {
    let { status } = args;
    let results = (status) ? users.filter(x => x.status == status) : users
    return results
}

const updateUser = ({ id, name, age }) => {
    users.map(user => {
        if (user.id == id) {
            user.name = name
            user.age = age
            return user
        }
    });
    return users.filter(user => user.id == id)[0]
}

const root = {
    user: getUser,
    userByName: getUserByName,
    usersByStatus: getUsersByStatus,
    updateUser: updateUser
};

const app = express()
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

app.listen(4000)
console.log('Running a GraphQL API server at http://localhost:4000/graphql');


