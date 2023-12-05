import { relations } from "drizzle-orm";
import { uuid, pgTable, serial, varchar, index, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const userRoles = pgEnum('roles', ['0','1','2']);

export const users = pgTable(
    "users", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        cf: varchar("cod_fiscale", {length: 16}).unique(),
        password: varchar("password", {length: 56}).notNull(),
        fullname: varchar("full_name", {length: 256}),
        role: userRoles("roles").default("2").notNull()
    }, (table) => ({
        cfIdx: index("cf_idx").on(table.cf, table.uuid),
    })
)

export const farmacie = pgTable(
    "farmacie", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        nome: varchar('ragione_sociale').notNull(),
        citta: varchar('citta').notNull(),
        editor: uuid('editor').notNull().unique().references(()=>users.uuid)
    }, (table) => ({
        cfIdx: index("cf_idx").on(table.uuid, table.citta)
    })
)
export const usersRelations = relations(users, ({ one }) => ({
	farmacie: one(farmacie)
}));


export const products = pgTable(
    "prodotti", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        aic: varchar("codice_aic").unique(),
        nome: varchar("denominazione").notNull()
    }
)