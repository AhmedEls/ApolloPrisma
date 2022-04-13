import { ApolloServer } from 'apollo-server'
import { createContext } from './context'
import { schema } from './schema'

import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";

const server = new ApolloServer({
  schema,
  context: createContext,
  cors: {
    credentials: true,
    origin: "*"
  },
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  debug: process.env.APP_ENV !== 'production'
})

server.listen().then(({ url }) =>
  console.log(
    `\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`,
  ),
)

export default server