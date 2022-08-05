
// Useful to have these as string enums so that they are serialized more readably
export enum AccountType {
  Company = "Company",
  Academic = "Academic",
}

export enum TransactionStatus {
  Pending,
  Uploading,
  Done,
  Failed,
  None,
}

export enum BidStatus {
  Committed,
  Revealed,
  Winner,
}

export enum AuctionStatus {
  Pending,
  Commit,
  Reveal,
  Finalized,
}

export enum LicenceStatus {
  Active,
  Revoked,
}

// These can't be strings as they need to match the BigNumberish values being returned from the Blockchain
export enum PricingStrategy {
  PrivateAuction,
  FixedRate,
  PrivateAuctionHarberger,
  None,
  NULL, // To match Solidity
}

export enum PublicationStatus {
  Published,
  Replaced,
  Withdrawn,
  Licensed,
  Unitialized,
  NULL, // To match Solidity
}
