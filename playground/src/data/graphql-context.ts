import { uid } from "uid";

export type Hello = {
  message: string;
};

type Message = {
  id: string;
  message: string;
};

export type Chat = {
  messages: Message[];
};

export interface IGraphQLContext {
  hello: () => Hello;
  chat: () => Chat;
  addMessage: (message: string) => Chat;
  removeMessage: (id: string) => Chat;
}

const createGraphQLContext: () => IGraphQLContext = () => {
  return new GraphQLContext();
};

export default createGraphQLContext;

class GraphQLContext implements IGraphQLContext {
  private static messages: Message[] = [];
  hello = () => ({
    message: "Hello from context",
  });
  chat = () => ({
    messages: GraphQLContext.messages,
  });
  addMessage = (message: string) => {
    GraphQLContext.messages.push({ id: uid(), message });

    return {
      messages: GraphQLContext.messages,
    };
  };
  removeMessage = (id: string) => {
    const messages = GraphQLContext.messages.filter((value) => id !== value.id);
    GraphQLContext.messages = messages;

    return {
      messages: GraphQLContext.messages,
    };
  };
}
