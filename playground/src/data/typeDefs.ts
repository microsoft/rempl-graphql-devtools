const typeDefs = `
type Hello {
  message: String
}

type Message {
  id: ID!
  message: String!
}

type Chat {
  messages: [Message]!
}

type Query {
  hello: Hello
  chat: Chat
}

type Mutation {
  addMessage(message: String): Chat
  removeMessage(id: ID): Chat
}
`;

export default typeDefs;
