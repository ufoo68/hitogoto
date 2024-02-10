import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hitogoto_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdUserId: varchar("createdUserId", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    createdUserIdIdx: index("createdUserId_idx").on(example.createdUserId),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const friends = createTable("friend", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(createId),
  name: varchar("name", { length: 256 }).notNull(),
  thmbnailUrl: text("thmbnailUrl").default(sql`NULL`),
  createdUserId: varchar("createdUserId", { length: 255 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const friendRelations = relations(friends, ({ one, many }) => ({
  createdUser: one(users, {
    fields: [friends.createdUserId],
    references: [users.id],
  }),
  profiles: many(friendProfiles),
  tags: many(friendTags),
}));

export const tags = createTable("tags", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(createId),
  name: varchar("name", { length: 256 }).notNull(),
  createdUserId: varchar("createdUserId", { length: 255 }),
  color: varchar("color", { length: 256 }).default("#93b69c"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const tagsRelations = relations(tags, ({ one, many }) => ({
  createdUser: one(users, {
    fields: [tags.createdUserId],
    references: [users.id],
  }),
  friends: many(friendTags),
}));

export const friendTags = createTable("friend_tags", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(createId),
  friendId: varchar("friend_id", { length: 128 }),
  tagId: varchar("tag_id", { length: 128 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const userTagsRelations = relations(friendTags, ({ one }) => ({
  friend: one(friends, {
    fields: [friendTags.friendId],
    references: [friends.id],
  }),
  tag: one(tags, { fields: [friendTags.tagId], references: [tags.id] }),
}));

export const friendProfiles = createTable("friend_profile", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(createId),
  label: varchar("label", { length: 256 }).notNull(),
  value: json("value").notNull(),
  friendId: varchar("friend_id", { length: 128 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const friendProfilesRelations = relations(friendProfiles, ({ one }) => ({
  friend: one(friends, {
    fields: [friendProfiles.friendId],
    references: [friends.id],
  }),
}));

export const friendProfileTemplates = createTable("friend_profile_template", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(createId),
  content: json("content").notNull(),
  createdUserId: varchar("createdUserId", { length: 255 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const events = createTable("event", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(createId),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description").default(sql`NULL`),
  date: timestamp("date").notNull(),
  location: varchar("location", { length: 256 }).default(sql`NULL`),
  createdUserId: varchar("createdUserId", { length: 255 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const eventRelations = relations(events, ({ one, many }) => ({
  createdUser: one(users, {
    fields: [events.createdUserId],
    references: [users.id],
  }),
  participants: many(eventParticipants),
  media: many(eventMedia),
}));

export const eventParticipants = createTable("event_participant", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(createId),
  eventId: varchar("event_id", { length: 128 }),
  friendId: varchar("friend_id", { length: 128 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const eventParticipantsRelations = relations(
  eventParticipants,
  ({ one }) => ({
    friend: one(friends, {
      fields: [eventParticipants.friendId],
      references: [friends.id],
    }),
    event: one(events, {
      fields: [eventParticipants.eventId],
      references: [events.id],
    }),
  }),
);

export const eventMedia = createTable("event_media", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(createId),
  eventId: varchar("event_id", { length: 128 }),
  content: json("content").notNull(),
  createdUserId: varchar("createdUserId", { length: 255 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const eventMediaRelations = relations(eventMedia, ({ one }) => ({
  createdUser: one(users, {
    fields: [eventMedia.createdUserId],
    references: [users.id],
  }),
  event: one(events, { fields: [eventMedia.eventId], references: [events.id] }),
}));
