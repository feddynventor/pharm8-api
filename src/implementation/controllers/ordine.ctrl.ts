import { IOrdineRepository } from "../../core/interfaces/ordine.iface";
import { UserToken } from "../../core/entities/user";
import { FastifyRequest } from "fastify/types/request";
import { FastifyReply } from "fastify/types/reply";
import { NewOrdineParams } from "../../core/schemas/ordine.schema";

export const newOrdine = (
    ordineRepository: IOrdineRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    const { piva, aic, qt } = request.body as NewOrdineParams
    await ordineRepository
    .newOrdine(
        (request.user as UserToken).payload.uuid,
        piva, aic, 
        qt? qt : 1
    )
}