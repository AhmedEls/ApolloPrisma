import { ApolloServer } from 'apollo-server'
import { createContext } from './context'
import { schema } from './schema'

import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";

const server = new ApolloServer({
  schema,
  context: createContext,
  cors: true,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  debug: process.env.APP_ENV !== 'production',
  introspection: true
})

server.listen().then(({ url, port }) =>
  console.log(
    `\
🚀 Server ready at: ${url}:${port}
⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`,
  ),
)

export {
  server
}