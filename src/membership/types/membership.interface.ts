export interface IMembership {
  id: number;
  createdAt: Date;
  price: number;
  tokenId: number;
  createdAmount: number;
  soldAmount: number;
}

export interface IMyMembership {
  membership: IMembership;
  membershipCount: number;
}
