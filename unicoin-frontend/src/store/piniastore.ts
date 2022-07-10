import { defineStore, DefineStoreOptionsInPlugin } from "pinia";
//import { UnicoinRegistry } from "@/../../unicoin-contracts/typechain-types/contracts/UnicoinRegistry";
import { UnicoinRegistry, SharedStructures } from "@contracts/UnicoinRegistry";
import { UnicoinRegistry__factory } from "@factories/contracts";
import { BigNumber, BigNumberish, ethers, Signer } from "ethers";
import { getEtherscanAddress, getNetIdString } from "@/utils/lookupTools";
import { GET_ALL_PUBLICATIONS, GET_USER_BIDS, GET_USER_LICENCES, GET_USER_PROFILE } from "./actions";
import { IPFSPublication, viewFile, IPFSProfile, uploadFile } from "@/utils/ipfsUploader";
import { CID } from "ipfs-http-client";
import detectEthereumProvider from "@metamask/detect-provider";

/**
 * Thrown if an invalid or missing IPFS content identifier has been attempted to be parsed from a string
 */
class InvalidCIDError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCIDError";
  }
}

/**
 * Throw if a required environment variable cannot be found in the local environment
 */
class MissingEnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingEnvironmentError";
  }
}

class ObjectNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ObjectNotFoundError";
  }
}

class UserBid {
  constructor(
    readonly id: BigNumber,
    readonly offer: number,
    readonly bidStatus: BidStatus,
    readonly publicationId: BigNumber,
    readonly publicationTitle: string,
    readonly ipfsFile: string
  ) {}
}

class UserLicence {
  constructor(
    readonly buyerAddress: string,
    readonly publicationId: BigNumber,
    readonly publicationLicenceNo: BigNumber,
    readonly publicationInformation?: Publication
  ) {}
}

class PublicationBid {
  private constructor(
    readonly bidId: BigNumber,
    readonly offer: number,
    readonly status: BidStatus,
    readonly ownerAddress: string,
    readonly bidderFirstName: string,
    readonly bidderLastName: string,
    readonly bidderAccountType: AccountType,
    readonly bidderCompanyName: string
  ) {}
  /**
   * Obtains the details of a bid made on a publication from the blockchain and IPFS
   *
   * @param bidId ID in registry of the bid
   * @param registry Instantiated UnicoinRegistry to be queried
   * @returns PublicationBid instance encapsulating the information
   *
   * @throws {@link InvalidCIDError}
   * Thrown if user profile CID is missing or invalid
   */
  static async getPublicationBid(bidId: BigNumber, registry: UnicoinRegistry) {
    const bidInformation = await registry.getBid(bidId);

    const bidderUri = await registry.getUserProfileUri(bidInformation.bidderAddress);
    const bidderCID = CID.asCID(bidderUri);

    if (!bidderCID) {
      throw new InvalidCIDError("Could not obtain bidder URI");
    }

    const bidderProfile: IPFSProfile = await viewFile(bidderCID);

    console.log("FETCHING BIDDER PROFILE");
    console.log(bidderProfile);

    return new PublicationBid(
      bidId,
      bidInformation.revealedBid.toNumber(),
      bidInformation.status,
      bidInformation.bidderAddress,
      bidderProfile.firstName,
      bidderProfile.lastName,
      bidderProfile.accountType,
      bidderProfile.companyName
    );
  }
}

interface NewAcademicUserData {
  firstName: string;
  lastName: string;
  email: string;
  orcid: string;
  university: string;
}

interface NewCompanyUserData {
  name: string;
  email: string;
}

export class Publication {
  private constructor(
    readonly pricingStrategy: PricingStrategy,
    readonly auctionStatus: AuctionStatus,
    readonly publicationUri: string,
    readonly publicationStatus: PublicationStatus,
    readonly ownerAddress: string,
    readonly sellPrice: number,
    readonly maxNumberOfLicences: number,
    readonly licencesIssued: number,
    readonly previousVersion: number,
    readonly auctionIds: Array<BigNumber>,
    readonly contributionsId: number,
    readonly donations: Array<number>,
    readonly citationsId: BigNumber,
    readonly lifeTimeEarnings: number,
    readonly publicationId: BigNumber,
    readonly title: string,
    readonly abstract: string,
    readonly authorAddress: string,
    readonly authorFirstName: string,
    readonly authorLastName: string,
    readonly authorEmail: string,
    readonly authorOrcid: string,
    readonly authorUniversity: string,
    readonly pdfFile: string,
    readonly keyword: string,
    readonly bids: PublicationBid[]
  ) {}

  /**
   * Obtain details of publication and author from blockchain and IPFS
   * @param publicationId ID of publication in registry
   * @param registry UnicoinRegistry object to be queried
   * @returns Publication object representing the returned data
   *
   * @throws {@link ObjectNotFoundError}
   * Thrown if the publication could not be found on the blockchain
   *
   * @throws {@link InvalidCIDError}
   * Thrown if the author or publication IPFS URI/CIDs stored on the blockchain are missing or invalid.
   *
   */
  static async getPublication(publicationId: BigNumber, registry: UnicoinRegistry) {
    const rawpub = await registry.getPublication(publicationId);
    console.log("OBJECT");
    console.log(rawpub);

    if (!rawpub) throw new ObjectNotFoundError("Unexpected missing Publication object");

    const pricingStrategy = rawpub.pricingStrategy;
    const publicationUri = rawpub.publicationUri;
    const publicationStatus = rawpub.publicationStatus;
    const ownerAddress = rawpub.ownerAddress;
    const sellPrice = rawpub.sellPrice.toNumber();
    const maxNumberOfLicences = rawpub.maxNumberOfLicences;
    const licencesIssued = rawpub.licencesIssued.toNumber();
    const previousVersion = rawpub.previousVersion.toNumber();
    const auctionIds = rawpub.auctionIds;
    const contributionsId = rawpub.contributionsId.toNumber();
    const donations = rawpub.donations.map((x) => x.toNumber());
    const citationsId = rawpub.citationsId;
    const lifeTimeEarnings = rawpub.lifetimeEarnings.toNumber();

    const ipfsCID = CID.asCID(publicationUri);

    if (!ipfsCID) {
      throw new InvalidCIDError("Unable to obtain CID for publication");
    }

    const ipfsFile: IPFSPublication = await viewFile(ipfsCID);

    const authorUri = await registry.getUserProfileUri(ownerAddress);
    const authorCID = CID.asCID(authorUri);

    console.log(authorUri);

    if (!authorCID) {
      throw new InvalidCIDError("Could not obtain author CID");
    }

    const authorProfile: IPFSProfile = await viewFile(authorCID);

    const publicationBidsInformation: PublicationBid[] = [];

    const publicationBidsList = await registry.getPublicationBids(publicationId);

    const currentAuction = await registry.getPublicationLatestAuction(publicationId);

    for (const bidId of publicationBidsList) {
      publicationBidsInformation.push(await PublicationBid.getPublicationBid(bidId, registry));
    }

    const title = ipfsFile.title;
    const abstract = ipfsFile.abstract;
    const authorAddress = authorProfile.address;
    const authorFirstName = authorProfile.firstName;
    const authorLastName = authorProfile.lastName;
    const authorEmail = authorProfile.email;
    const authorOrcid = authorProfile.orcid;
    const authorUniversity = authorProfile.university;
    const pdfFile = ipfsFile.pdfFile;
    const auctionStatus = currentAuction.status;
    //const contributors = ipfsFile.contributors;
    const keyword = ipfsFile.keyword;

    return new Publication(
      pricingStrategy,
      auctionStatus,
      publicationUri,
      publicationStatus,
      ownerAddress,
      sellPrice,
      maxNumberOfLicences,
      licencesIssued,
      previousVersion,
      auctionIds,
      contributionsId,
      donations,
      citationsId,
      lifeTimeEarnings,
      publicationId,
      title,
      abstract,
      authorAddress,
      authorFirstName,
      authorLastName,
      authorEmail,
      authorOrcid,
      authorUniversity,
      pdfFile,
      keyword,
      publicationBidsInformation
    );
  }
}

interface State {
  //web3?: Web3;
  //account?: string;
  currentNetwork: string;
  etherscanBase: string;
  registry?: UnicoinRegistry;
  //userNumber: number;
  userAddress: string;
  numberOfPublications: number;
  listedPublications?: Array<Publication>;
  contractAddress: string;
  signer?: Signer;
  userBids?: Array<UserBid>;
  userProfile?: IPFSProfile;
  userLicences?: Array<UserLicence>;
  miningTransactionObject?: {
    status: TransactionStatus;
    txHash?: string;
  };
}

export const useStore = defineStore("main", {
  state: (): State => ({
    currentNetwork: "",
    etherscanBase: "",
    registry: undefined,
    //account: "",
    //userNumber: -1,
    userAddress: "",
    numberOfPublications: -1,
    listedPublications: undefined,
    contractAddress: "",
    signer: undefined,
    userBids: undefined,
    userProfile: undefined,
    userLicences: undefined,
    miningTransactionObject: undefined,
  }),
  getters: {},
  actions: {
    /**
     * Initializes the Unicoin store state
     * Must be called before the store can be used
     *
     * @throws {@link MissingEnvironmentError}
     * Thrown if the address of the Unicoin contract is not provided in the Environment
     */
    async initApp() {
      if (!process.env.UNICOIN_ADDRESS) throw new MissingEnvironmentError("No address provided for Unicoin Deployment");

      const eth = await detectEthereumProvider();

      // If we find metamask we can create an actual provider/signer combo
      // The fallback provider will only give us read-only access.
      const { provider, signer } = await (async () => {
        if (eth) {
          const provider = new ethers.providers.Web3Provider(eth as ethers.providers.ExternalProvider);

          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();

          return { provider, signer };
        } else {
          console.warn("Metamask not detected - using default provider");
          const provider = ethers.providers.getDefaultProvider();

          return { provider, null: ethers.providers.JsonRpcProvider };
        }
      })();

      this.signer = signer;

      this.currentNetwork = await getNetIdString(provider);
      this.etherscanBase = await getEtherscanAddress(provider);
      this.registry = UnicoinRegistry__factory.connect(process.env.UNICOIN_ADDRESS, signer ? signer : provider);

      this.contractAddress = this.registry.address;

      if (signer) {
        const userNumber = await this.registry.getUserId(signer.getAddress());
        if (userNumber) {
          this.loadUserProfile();
          this.loadUserBids();
        }
      }

      const numberOfPublications = await this.registry.getPublicationLength();
      if (numberOfPublications) {
        this.numberOfPublications = numberOfPublications.toNumber();
        console.log(`Length ${this.numberOfPublications}`);
        this.loadAllPublications();
      }
    },
    /**
     * Populates the state with the list of all Publications that are stored on the blockchain
     * Assumes that app has already been initialialized
     * Performs no action if registry has not been set.
     * @return Returns true if the action completed successfully
     *
     * @privateRemark
     * This should be refactored - if the list of publications gets large it will be very inefficient to load all of them
     */
    async loadAllPublications(): Promise<boolean> {
      if (!this.registry) {
        console.warn("loadAllPublications called without valid registry being set. Ignoring request.");
        return false;
      }

      if (!this.listedPublications || this.listedPublications.length != this.numberOfPublications) {
        this.listedPublications = [];

        console.log("CALLING");
        const publicationsReturned = [];

        for (let i = 0; i < this.numberOfPublications; i++) {
          console.log("loading publication: ", i);

          publicationsReturned.push(
            await Publication.getPublication(BigNumber.from(i), this.registry as UnicoinRegistry) // not sure why we need this assertion
          );
        }

        this.listedPublications = publicationsReturned;

        console.log("Done loading publications");
        this.loadUserLicences();

        return true;
      }

      return false;
    },
    /**
     * Gets all licences associated with the address of the current user
     * Assumes that app has already been initialialized
     * Performs no action if registry or signer have not been set.
     * @return Returns true if the action completed successfully
     */
    async loadUserLicences(): Promise<boolean> {
      if (!this.registry || !this.signer) {
        console.warn("loadUserLicences called without valid registry or signer being set. Ignoring request.");
        this.userLicences = undefined;
        return false;
      }

      const usersLicences = await this.registry.getLicenceForAddress(this.signer.getAddress(), {
        from: this.signer.getAddress(),
      });

      const userLicencesProcessed: Array<UserLicence> = [];

      for (const licence of usersLicences) {
        const licenceId = licence.toNumber();

        const licenceData = await this.registry.getLicence(licenceId);

        // Try toet the publication corresponding to this licence
        const loadedPublication: Publication[] = !this.listedPublications
          ? []
          : this.listedPublications.filter((pub) => {
              return pub.publicationId == licenceData.publicationId;
            });

        userLicencesProcessed.push({
          buyerAddress: licenceData.ownerAddress,
          publicationId: licenceData.publicationId,
          publicationLicenceNo: licenceData.publicationLicenceNo,
          publicationInformation: loadedPublication.length > 0 ? loadedPublication[0] : undefined,
        });
      }

      this.userLicences = userLicencesProcessed;

      return true;
    },
    /**
     * Loads the profile of the current user from IPFS storage
     * Assumes that app has already been initialialized
     * Performs no action if registry or signer have not been set.
     * @return Returns true if the action completed successfully
     *
     * @throws {@link InvalidCIDError}
     * Throws if the IPFS URI/CID stored on the blockchain for the user profile is missing or invalid
     */
    async loadUserProfile(): Promise<boolean> {
      if (!this.registry || !this.signer) {
        console.warn("loadUserProfile called without valid registry or signer being set. Ignoring request.");
        this.userProfile = undefined;
        return false;
      }

      const profile_uri = await this.registry.getUserProfileUri(this.signer.getAddress());

      const profile_cid = CID.asCID(profile_uri);
      if (!profile_cid) throw new InvalidCIDError("No valid profile information available for user");

      const ipfsBlob: IPFSProfile = await viewFile(profile_cid);
      this.userProfile = ipfsBlob;

      return true;
    },
    /**
     * Obtains the list of all bids that have been made by the current user that are stored on the Blockchain
     * Assumes that app has already been initialialized
     * Performs no action if registry or signer have not been set.
     * @return Returns true if the action completed successfully
     */
    async loadUserBids(): Promise<boolean> {
      if (!this.registry || !this.signer) {
        console.warn("loadUserBids called without valid registry or signer being set. Ignoring request.");
        this.userBids = undefined;
        return false;
      }

      const userBids = [];
      const bidIds = await this.registry.getBids(this.signer.getAddress());

      for (const bid of bidIds) {
        const bidData = await this.registry.getBid(bid);

        const publicationObject = await this.registry.getPublication(bidData.publicationId);

        const ipfsCID = CID.asCID(publicationObject.publicationUri);

        const ipfsFile = ipfsCID ? ((await viewFile(ipfsCID)) as IPFSPublication) : undefined;

        const newBid = new UserBid(
          bid,
          bidData.revealedBid.toNumber(),
          bidData.status,
          bidData.publicationId,
          ipfsFile ? ipfsFile.title : "",
          ipfsFile ? ipfsFile.pdfFile : ""
        );

        userBids.push(newBid);
      }

      this.userBids = userBids;

      return true;
    },
    /**
     * Creates a new user profile.
     * Profile data is uploaded to IPFS, and an entry is created on the blockchain
     * @param userData An {@link ipfsUploader#IPFSProfile} object containing user information
     * @return Returns true if the action completed successfully
     */
    async createUser(userData: IPFSProfile): Promise<boolean> {
      if (!this.registry) {
        console.warn("createUser called without valid registry or signer being set. Ignoring request.");
        return false;
      }

      console.log("In CREATE USER call");

      this.miningTransactionObject = {
        status: TransactionStatus.Uploading,
        txHash: undefined,
      };

      const ipfsCID = await uploadFile(userData);

      if (ipfsCID) {
        console.log("User profile accepted");
        this.miningTransactionObject = {
          status: TransactionStatus.Pending,
          txHash: undefined,
        };
      }

      const txHash = await this.registry.registerUser(ipfsCID.toString());

      if (txHash) {
        this.miningTransactionObject = {
          status: TransactionStatus.Done,
          txHash: txHash.blockHash,
        };
        return true;
      }

      this.miningTransactionObject = {
        status: TransactionStatus.Failed,
        txHash: undefined,
      };

      return false;
    },
  },
});
