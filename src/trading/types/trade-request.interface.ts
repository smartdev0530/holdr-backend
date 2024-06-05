import { IMembership } from '../../membership/types';

export interface ITradeRequest {
  requested: IMembership;
  offered: IMembership;
  createdAt: Date;
}
