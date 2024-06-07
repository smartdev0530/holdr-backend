export interface ITradeRequest {
  createdAt: Date;
  id: number;
  status: string;
  userId: number;
  requestedId: number;
  offeredId: number;
  updatedAt: Date;
  acceptedAt: Date;
  acceptedById: number;
}
