import { relations } from "drizzle-orm";
import { uuid, pgTable, varchar, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const users = pgTable(
    "users", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        cf: varchar("cod_fiscale", {length: 16}).unique(),
        password: varchar("password", {length: 56}).notNull(),
        fullname: varchar("full_name", {length: 256}),
        favourite: uuid("farmacia_preferita").references(()=>farmacie.uuid),
        worksIn: uuid("dipendente_farmacia").references(()=>farmacie.uuid)
    }, (table) => ({
        cfIdx: index("cf_idx").on(table.cf, table.uuid),
    })
)

export const farmacie = pgTable(
    "farmacie", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        nome: varchar('ragione_sociale').notNull(),
        citta: varchar('citta').notNull(),
        piva: varchar('partita_iva', {length: 11}).unique().notNull(),
    }, (table) => ({
        cfIdx: index("piva_idx").on(table.uuid, table.citta, table.piva)
    })
)