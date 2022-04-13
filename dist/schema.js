"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.schema = exports.DateTime = void 0;
var permissions_1 = require("./permissions");
var utils_1 = require("./utils");
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var graphql_middleware_1 = require("graphql-middleware");
var nexus_1 = require("nexus");
var graphql_scalars_1 = require("graphql-scalars");
exports.DateTime = (0, nexus_1.asNexusMethod)(graphql_scalars_1.DateTimeResolver, 'date');
var Query = (0, nexus_1.objectType)({
    name: 'Query',
    definition: function (t) {
        t.nonNull.list.nonNull.field('allUsers', {
            type: 'User',
            resolve: function (_parent, _args, context) {
                return context.prisma.user.findMany();
            }
        });
        t.nullable.field('me', {
            type: 'User',
            resolve: function (parent, args, context) {
                var userData = (0, utils_1.getUserByToken)(context);
                return context.prisma.user.findUnique({
                    where: {
                        id: userData === null || userData === void 0 ? void 0 : userData.userId
                    }
                });
            }
        });
        t.nullable.field('postById', {
            type: 'Post',
            args: {
                id: (0, nexus_1.stringArg)()
            },
            resolve: function (_parent, args, context) {
                return context.prisma.post.findUnique({
                    where: { id: args.id || undefined }
                });
            }
        });
        t.nonNull.list.nonNull.field('allSettings', {
            type: 'Setting',
            resolve: function (_, __, ctx) {
                return ctx.prisma.setting.findMany();
            }
        });
        t.nonNull.list.nonNull.field('settingsByCategory', {
            type: 'Setting',
            args: {
                category: (0, nexus_1.stringArg)()
            },
            resolve: function (_parent, args, context) {
                return context.prisma.setting.findMany({ where: { key: { startsWith: args.category || undefined } } });
            }
        });
        t.nonNull.list.nonNull.field('feed', {
            type: 'Post',
            args: {
                searchString: (0, nexus_1.stringArg)(),
                skip: (0, nexus_1.intArg)(),
                take: (0, nexus_1.intArg)(),
                orderBy: (0, nexus_1.arg)({
                    type: 'PostOrderByUpdatedAtInput'
                })
            },
            resolve: function (_parent, args, context) {
                var or = args.searchString
                    ? {
                        OR: [
                            { title: { contains: args.searchString } },
                            { content: { contains: args.searchString } },
                        ]
                    }
                    : {};
                return context.prisma.post.findMany({
                    where: __assign({ published: true }, or),
                    take: args.take || undefined,
                    skip: args.skip || undefined,
                    orderBy: args.orderBy || undefined
                });
            }
        });
        t.list.field('draftsByUser', {
            type: 'Post',
            args: {
                userUniqueInput: (0, nexus_1.nonNull)((0, nexus_1.arg)({
                    type: 'UserUniqueInput'
                }))
            },
            resolve: function (_parent, args, context) {
                return context.prisma.user
                    .findUnique({
                    where: {
                        id: args.userUniqueInput.id || undefined,
                        email: args.userUniqueInput.email || undefined
                    }
                })
                    .posts({
                    where: {
                        published: false
                    }
                });
            }
        });
    }
});
var Mutation = (0, nexus_1.objectType)({
    name: 'Mutation',
    definition: function (t) {
        var _this = this;
        t.field('signup', {
            type: 'AuthPayload',
            args: {
                name: (0, nexus_1.stringArg)(),
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
            },
            resolve: function (_parent, args, context) { return __awaiter(_this, void 0, void 0, function () {
                var hashedPassword, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, bcryptjs_1.hash)(args.password, 10)];
                        case 1:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, context.prisma.user.create({
                                    data: {
                                        name: args.name,
                                        email: args.email,
                                        password: hashedPassword
                                    }
                                })];
                        case 2:
                            user = _a.sent();
                            return [2 /*return*/, {
                                    token: (0, jsonwebtoken_1.sign)({ userId: user.id }, utils_1.APP_SECRET),
                                    user: user
                                }];
                    }
                });
            }); }
        });
        t.field('login', {
            type: 'AuthPayload',
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
            },
            resolve: function (_parent, _a, context) {
                var email = _a.email, password = _a.password;
                return __awaiter(_this, void 0, void 0, function () {
                    var user, passwordValid;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, context.prisma.user.findUnique({
                                    where: {
                                        email: email
                                    }
                                })];
                            case 1:
                                user = _b.sent();
                                if (!user) {
                                    throw new Error("No user found for email: ".concat(email));
                                }
                                return [4 /*yield*/, (0, bcryptjs_1.compare)(password, user.password)];
                            case 2:
                                passwordValid = _b.sent();
                                if (!passwordValid) {
                                    throw new Error('Invalid password');
                                }
                                return [2 /*return*/, {
                                        token: (0, jsonwebtoken_1.sign)({ userId: user.id, role: user.role }, utils_1.APP_SECRET),
                                        user: user
                                    }];
                        }
                    });
                });
            }
        });
        t.field('createDraft', {
            type: 'Post',
            args: {
                data: (0, nexus_1.nonNull)((0, nexus_1.arg)({
                    type: 'PostCreateInput'
                }))
            },
            resolve: function (_, args, context) {
                var userData = (0, utils_1.getUserByToken)(context);
                return context.prisma.post.create({
                    data: {
                        title: args.data.title,
                        content: args.data.content,
                        authorId: userData === null || userData === void 0 ? void 0 : userData.userId
                    }
                });
            }
        });
        t.field('togglePublishPost', {
            type: 'Post',
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
            },
            resolve: function (_, args, context) { return __awaiter(_this, void 0, void 0, function () {
                var post, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, context.prisma.post.findUnique({
                                    where: { id: args.id || undefined },
                                    select: {
                                        published: true
                                    }
                                })];
                        case 1:
                            post = _a.sent();
                            return [2 /*return*/, context.prisma.post.update({
                                    where: { id: args.id || undefined },
                                    data: { published: !(post === null || post === void 0 ? void 0 : post.published) }
                                })];
                        case 2:
                            e_1 = _a.sent();
                            throw new Error("Post with ID ".concat(args.id, " does not exist in the database."));
                        case 3: return [2 /*return*/];
                    }
                });
            }); }
        });
        t.field('incrementPostViewCount', {
            type: 'Post',
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
            },
            resolve: function (_, args, context) {
                return context.prisma.post.update({
                    where: { id: args.id || undefined },
                    data: {
                        viewCount: {
                            increment: 1
                        }
                    }
                });
            }
        });
        t.field('deletePost', {
            type: 'Post',
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)())
            },
            resolve: function (_, args, context) {
                return context.prisma.post["delete"]({
                    where: { id: args.id }
                });
            }
        });
    }
});
var Setting = (0, nexus_1.objectType)({
    name: 'Setting',
    definition: function (t) {
        t.nonNull.string('id');
        t.nonNull.string('key');
        t.string('value');
    }
});
var User = (0, nexus_1.objectType)({
    name: 'User',
    definition: function (t) {
        t.nonNull.string('id');
        t.string('name');
        t.nonNull.string('email');
        t.nonNull.string('role');
        t.nonNull.list.nonNull.field('posts', {
            type: 'Post',
            resolve: function (parent, _, context) {
                return context.prisma.user
                    .findUnique({
                    where: { id: parent.id || undefined }
                })
                    .posts();
            }
        });
    }
});
var Post = (0, nexus_1.objectType)({
    name: 'Post',
    definition: function (t) {
        t.nonNull.string('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('title');
        t.string('content');
        t.nonNull.boolean('published');
        t.nonNull.int('viewCount');
        t.field('author', {
            type: 'User',
            resolve: function (parent, _, context) {
                return context.prisma.post
                    .findUnique({
                    where: { id: parent.id || undefined }
                })
                    .author();
            }
        });
    }
});
var SortOrder = (0, nexus_1.enumType)({
    name: 'SortOrder',
    members: ['asc', 'desc']
});
var PostOrderByUpdatedAtInput = (0, nexus_1.inputObjectType)({
    name: 'PostOrderByUpdatedAtInput',
    definition: function (t) {
        t.nonNull.field('updatedAt', { type: 'SortOrder' });
    }
});
var UserUniqueInput = (0, nexus_1.inputObjectType)({
    name: 'UserUniqueInput',
    definition: function (t) {
        t.string('id');
        t.string('email');
    }
});
var PostCreateInput = (0, nexus_1.inputObjectType)({
    name: 'PostCreateInput',
    definition: function (t) {
        t.nonNull.string('title');
        t.string('content');
    }
});
var UserCreateInput = (0, nexus_1.inputObjectType)({
    name: 'UserCreateInput',
    definition: function (t) {
        t.nonNull.string('email');
        t.string('name');
        t.list.nonNull.field('posts', { type: 'PostCreateInput' });
    }
});
var AuthPayload = (0, nexus_1.objectType)({
    name: 'AuthPayload',
    definition: function (t) {
        t.string('token');
        t.field('user', { type: 'User' });
    }
});
var schemaWithoutPermissions = (0, nexus_1.makeSchema)({
    types: [
        Query,
        Mutation,
        Post,
        User,
        Setting,
        AuthPayload,
        UserUniqueInput,
        UserCreateInput,
        PostCreateInput,
        SortOrder,
        PostOrderByUpdatedAtInput,
        exports.DateTime,
    ],
    outputs: {
        schema: __dirname + '/../schema.graphql',
        typegen: __dirname + '/generated/nexus.ts'
    },
    contextType: {
        module: require.resolve('./context'),
        "export": 'Context'
    },
    sourceTypes: {
        modules: [
            {
                module: '@prisma/client',
                alias: 'prisma'
            },
        ]
    }
});
exports.schema = (0, graphql_middleware_1.applyMiddleware)(schemaWithoutPermissions, permissions_1.permissions);
