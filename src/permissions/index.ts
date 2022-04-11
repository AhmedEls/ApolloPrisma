import { allow, rule, shield, or } from 'graphql-shield'
import { getUserByToken } from '../utils'
import { Context } from '../context'

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context: Context) => {
    const userDetails = getUserByToken(context)
    return Boolean(userDetails?.userId)
  }),
  isAdmin: rule()(async (_parent, _args, context: Context) => {
    const userDetails = getUserByToken(context)
    return Boolean(userDetails?.role === 'ADMIN')
  }),
  isPostOwner: rule()(async (_parent, args, context) => {
    const userDetails = getUserByToken(context)
    const author = await context.prisma.post
      .findUnique({
        where: {
          id: Number(args.id),
        },
      })
      .author()
    return userDetails?.userId === author.id
  }),
}

export const permissions = shield({
  Query: {
    allUsers: allow,
    allSettings: rules.isAdmin,
    me: rules.isAuthenticatedUser,
    draftsByUser: rules.isAuthenticatedUser,
    postById: rules.isAuthenticatedUser,
  },
  Mutation: {
    login: allow,
    signup: allow,
    createDraft: rules.isAuthenticatedUser,
    deletePost: rules.isPostOwner,
    incrementPostViewCount: rules.isAuthenticatedUser,
    togglePublishPost: or(rules.isPostOwner, rules.isAdmin),
  },
}, {
  debug: true
})
