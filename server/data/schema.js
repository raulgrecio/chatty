export const Schema = [`
  # declare custom scalars
  scalar Date

  # a group chat entity
  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User]! # users in the group
    messages(limit: Int, offset: Int): [Message] # messages sent to the group
  }

  # a user -- keep model really simple for now
  type User {
    id: Int! # unique id for the user
    username: String # name for the user
    email: String! # we will also require a unique email per user 
    messages: [Message] # messages sent by user
    groups: [Group] # groups the user belongs to
    friends: [User] # user's contacts
  }

  # a message sent from a user to a group
  type Message {
    id: Int! # unique id for message
    to: Group! # group message was sent in
    from: User! # user who sent the message
    text: String! # message text
    createdAt: Date! # when message was created
  }

  # query for types
  type Query {
    # Return a user by their email or id
    user(email: String, id: Int): User
    # Return a group by its id
    group(id: Int!): Group
  }

  type Mutation {
    # send a message to a group
    createMessage(text: String!, userId: Int!, groupId: Int!): Message
    createGroup(name: String!, userIds: [Int], userId: Int!): Group
    deleteGroup(id: Int!): Group
    leaveGroup(id: Int!, userId: Int!): Group # let user leave group
    updateGroup(id: Int!, name: String): Group
  }

  schema {
    query: Query
    mutation: Mutation
  }
`];

export default Schema;
