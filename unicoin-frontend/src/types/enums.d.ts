enum AccountType {
  Company,
  Academic,
}

enum TransactionStatus {
  Pending,
  Uploading,
  Done,
  Failed,
}

enum PricingStrategy {
  PrivateAuction,
  FixedRate,
  PrivateAuctionHarberger,
  None,
  NULL, // To match Solidity
}

enum PublicationStatus {
  Published,
  Replaced,
  Withdrawn,
  Licensed,
  Unitialized,
  NULL, // To match Solidity
}

enum BidStatus {
  Committed,
  Revealed,
  Winner,
}

enum AuctionStatus {
  Pending,
  Commit,
  Reveal,
  Finalized,
}

enum LicenceStatus {
  Active,
  Revoked,
}
