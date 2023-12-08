export interface Prodotto {
  uuid: string
  aic: string
  nome: string
  prezzo: number
};

export type ProdottoPayload = Omit<Prodotto, 'uuid'>
