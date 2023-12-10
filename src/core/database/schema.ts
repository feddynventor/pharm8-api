import { relations } from "drizzle-orm";
import { uuid, pgTable, varchar, index, numeric, decimal, pgEnum, timestamp } from "drizzle-orm/pg-core";
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
        index: index("cf_idx").on(table.cf, table.uuid),
    })
)

export const farmacie = pgTable(
    "farmacie", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        nome: varchar('ragione_sociale').notNull(),
        citta: varchar('citta').notNull(),
        piva: varchar('partita_iva', {length: 11}).unique().notNull(),
    }, (table) => ({
        index: index("piva_idx").on(table.uuid, table.citta, table.piva)
    })
)

export const prodotti = pgTable(
    "prodotti", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        aic: varchar('codice_aic', {length: 9}).unique().notNull(),
        nome: varchar('nome').notNull(),
        // descrizione: varchar('descrizione'),
        prezzo: decimal('prezzo').notNull(),
    }, (table) => ({
        index: index("aic_idx").on(table.aic, table.uuid)
    })
)

export const magazzino = pgTable(
    "magazzino", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        farmacia: uuid('farmacia').notNull().references(()=>farmacie.uuid),
        prodotto: uuid('prodotto').notNull().references(()=>prodotti.uuid),
        quantita: numeric('quantita').notNull().default("0"),
    }, (table) => ({
        index: index("farmacia_prodotto_idx").on(table.farmacia, table.prodotto)
    })
)

export const orderStatus = pgEnum('status', ['PENDING','ACCEPTED','DELIVERED']);
export const ordini = pgTable(
    "ordini", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        farmacia: uuid('farmacia').notNull().references(()=>farmacie.uuid),
        utente: uuid('utente').notNull().references(()=>users.uuid),
        prodotto: uuid('prodotto').notNull().references(()=>prodotti.uuid),
        quantita: numeric('quantita').notNull().default("1"),
        date: timestamp('timestamp').default(sql`now()`),
        status: orderStatus('status').default('PENDING')
    }, (table) => ({
        index: index("order_idx").on(table.farmacia, table.date)
    })
)
export const ordiniRelations = relations(ordini, ({ one,many })=>({
    prodotto: one(prodotti, {
        fields: [ordini.prodotto],
        references: [prodotti.uuid]
    }),
    utente: one(users, {
        fields: [ordini.utente],
        references: [users.uuid]
    }),
    farmacia: one(farmacie, {
        fields: [ordini.farmacia],
        references: [farmacie.uuid]
    })
}))