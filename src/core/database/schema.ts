import { relations } from "drizzle-orm";
import { uuid, pgTable, varchar, index, real, decimal, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const users = pgTable(
    "users", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        cf: varchar("cod_fiscale", {length: 16}).unique(),
        password: varchar("password", {length: 56}).notNull(),
        fullname: varchar("full_name", {length: 256}),
        citta: varchar("citta", {length: 128}).notNull(),
        firebase: varchar("firebase_token", {length: 163}),
        favourite: uuid("farmacia_preferita").references(()=>farmacie.uuid),
        worksIn: uuid("dipendente_farmacia").references(()=>farmacie.uuid)
    }, (table) => ({
        index: index("cf_idx").on(table.cf, table.uuid),
    })
)
export const userRelations = relations(users, ({ one })=>({
    favourite: one(farmacie, {
        fields: [users.favourite],
        references: [farmacie.uuid]
    }),
    worksIn: one(farmacie, {
        fields: [users.worksIn],
        references: [farmacie.uuid]
    })
}))

export const farmacie = pgTable(
    "farmacie", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        nome: varchar('ragione_sociale').notNull(),
        citta: varchar('citta').notNull(),
        codice_farmacia: varchar('codice_farmacia', {length: 11}).unique().notNull(),
    }, (table) => ({
        index: index("farmacie_idx").on(table.uuid, table.citta, table.codice_farmacia)
    })
)

export const prodotti = pgTable(
    "prodotti", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        aic: varchar('codice_aic', {length: 9}).unique().notNull(),
        nome: varchar('nome').notNull(),
        // descrizione: varchar('descrizione'),
        prezzo: real('prezzo').notNull(),
    }, (table) => ({
        index: index("aic_idx").on(table.aic, table.uuid)
    })
)

export const magazzino = pgTable(
    "magazzino", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        farmacia: uuid('farmacia').notNull().references(()=>farmacie.uuid, {onDelete: 'cascade'}),
        prodotto: uuid('prodotto').notNull().references(()=>prodotti.uuid),
        quantita: real('quantita').notNull().default(0),
    }, (table) => ({
        index: index("farmacia_prodotto_idx").on(table.farmacia, table.prodotto)
    })
)
export const magazzinoRelations = relations(magazzino, ({ one,many })=>({
    farmacia: one(farmacie, {
        fields: [magazzino.farmacia],
        references: [farmacie.uuid]
    }),
    prodotto: one(prodotti, {
        fields: [magazzino.prodotto],
        references: [prodotti.uuid]
    })
}))

export const orderStatus = pgEnum('status', ['PENDING','ACCEPTED','DELIVERED']);
export const ordini = pgTable(
    "ordini", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        farmacia: uuid('farmacia').notNull().references(()=>farmacie.uuid),
        utente: uuid('utente').notNull().references(()=>users.uuid, {onDelete: 'cascade'}),
        prodotto: uuid('prodotto').notNull().references(()=>prodotti.uuid),
        quantita: real('quantita').notNull().default(1),
        date: timestamp('timestamp', { withTimezone: true }).notNull().default(sql`now()`),
        aggiornato: timestamp('new_timestamp', { withTimezone: true }),
        status: orderStatus('status').notNull().default('PENDING')
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