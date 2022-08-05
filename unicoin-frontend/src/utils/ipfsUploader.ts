/* eslint-disable no-console */

//using the infura.io node, otherwise ipfs requires you to run a //daemon on your own computer/server.
//const IPFS = require("ipfs-api");

import { create, CID } from "ipfs-http-client";

import { PricingStrategy, AuctionStatus } from "@/utils/enums";

import { JsonSerializer, throwError, JsonObject, JsonProperty } from "typescript-json-serializer";

// Copied the below from typescript-json-serializer
export type Type<T> = new (...args: Array<any>) => T;

const defaultSerializer = new JsonSerializer(/*{ errorCallback: throwError }*/);

@JsonObject()
export class AcademicProfile {
  constructor(
    @JsonProperty({ required: true }) readonly firstName: string,
    @JsonProperty({ required: true }) readonly lastName: string,
    @JsonProperty({ required: true }) readonly email: string,
    @JsonProperty({ required: true }) readonly orcid: string,
    @JsonProperty({ required: true }) readonly university: string,
    @JsonProperty({ required: true }) public timestamp: Date
  ) {}
}

@JsonObject()
export class CompanyProfile {
  constructor(
    @JsonProperty({ required: true }) readonly companyName: string,
    @JsonProperty({ required: true }) readonly email: string,
    @JsonProperty({ required: true }) public timestamp: Date
  ) {}
}

@JsonObject()
export class Publication {
  constructor(
    @JsonProperty({ required: true }) readonly title: string,
    @JsonProperty({ required: true }) readonly abstract: string,
    @JsonProperty({ required: true }) readonly keyword: string,
    @JsonProperty({ required: true }) readonly contributors: string[],
    @JsonProperty({ required: true }) readonly contributorsWeightings: number[],
    @JsonProperty({ required: true }) readonly sellPrice: number,
    @JsonProperty({
      required: true,
      beforeDeserialize: (x: string): PricingStrategy => {
        return PricingStrategy[x as keyof typeof PricingStrategy];
      },
      afterSerialize: (x: PricingStrategy): string => {
        return serializeEnum(PricingStrategy, x);
      },
    })
    readonly pricingStrategy: PricingStrategy,
    @JsonProperty({
      required: true,
      beforeDeserialize: (x: string): AuctionStatus => {
        return AuctionStatus[x as keyof typeof AuctionStatus];
      },
      afterSerialize: (x: AuctionStatus): string => {
        return serializeEnum(AuctionStatus, x);
      },
    })
    readonly auctionStatus: AuctionStatus,
    @JsonProperty({ required: true }) readonly pdfFile: string
  ) {}
}

/*interface JsonSerializableStatic<JsonType extends JsonObject, InstanceType extends JsonSerializable<JsonType>> {
  __recordtype__: string;
  deserialise(input: JsonType): InstanceType | null;
  jsonTypeValid(input: any): input is JsonType;
  isType(input: any): input is InstanceType;
}

interface JsonSerializable<JsonType extends JsonObject> {
  serialise(): JsonType;
}

interface JsonObject {
  readonly __recordtype__: string;
}*/

// This isn't particularly typessafe
function serializeEnum<T>(o: T, value: string | number): string {
  const valIndex = Object.values(o).indexOf(value);

  return Object.keys(o)[valIndex];
}

/*class AcademicProfileJson {
  readonly __recordtype__ = "AcademicProfile";

  constructor(
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly orcid: string,
    readonly university: string
  ) {}
}

export class AcademicProfile {
  constructor(
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly orcid: string,
    readonly university: string
  ) {}

  static __recordtype__ = "AcademicProfile";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static jsonTypeValid(input: any): input is AcademicProfileJson {
    return (
      input.__recordtype__ === "AcademicProfile" &&
      typeof input.firstName === "string" &&
      typeof input.lastName === "string" &&
      typeof input.email === "string" &&
      typeof input.orcid === "string" &&
      typeof input.university === "string"
    );
  }

  static isType<T extends JsonObject, U extends JsonSerializable<T>>(
    input: JsonSerializableStatic<T, U>
  ): input is AcademicProfile {
    return input.__recordtype__ === "AcademicProfile";
  }

  static deserialise(input: unknown): AcademicProfile | null {
    if (this.jsonTypeValid(input))
      return new AcademicProfile(input.firstName, input.lastName, input.email, input.orcid, input.university);
    return null;
  }

  serialise(): AcademicProfileJson {
    return new AcademicProfileJson(this.firstName, this.lastName, this.email, this.orcid, this.university);
  }
}

// This line is only used for type inference purposes
const [,]: JsonSerializableStatic<AcademicProfileJson, AcademicProfile> = AcademicProfile;*/

/*class CompanyProfileJson {
  readonly __recordtype__ = "CompanyProfile";

  constructor(readonly companyName: string, readonly email: string) {}
}

export class CompanyProfile {
  static __recordtype__ = "CompanyProfile";

  constructor(readonly companyName: string, readonly email: string) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static jsonTypeValid(input: any): input is CompanyProfileJson {
    return (
      input.__recordtype__ === "CompanyProfile" &&
      typeof input.companyName === "string" &&
      typeof input.email === "string"
    );
  }

  static deserialise(input: unknown): CompanyProfile | null {
    if (this.jsonTypeValid(input)) return new CompanyProfile(input.companyName, input.email);
    return null;
  }

  serialise(): CompanyProfileJson {
    return new CompanyProfileJson(this.companyName, this.email);
  }
}

//This line is only used for type inference purposes
const [,]: JsonSerializableStatic<CompanyProfileJson, CompanyProfile> = CompanyProfile;*/

/*class PublicationJson {
  readonly __recordtype__ = "Publication";

  constructor(
    readonly title: string,
    readonly abstract: string,
    readonly keyword: string,
    readonly contributors: string[],
    readonly contributorsWeightings: number[],
    readonly sellPrice: number,
    readonly pricingStrategy: string,
    readonly auctionStatus: string,
    readonly pdfFile: string
  ) {}
}
export class Publication {
  static __recordtype__ = "Publication";

  constructor(
    readonly title: string,
    readonly abstract: string,
    readonly keyword: string,
    readonly contributors: string[],
    readonly contributorsWeightings: number[],
    readonly sellPrice: number,
    readonly pricingStrategy: PricingStrategy,
    readonly auctionStatus: AuctionStatus,
    readonly pdfFile: string
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static jsonTypeValid(input: any): input is PublicationJson {
    return (
      input.__recordtype__ === "Publication" &&
      typeof input.title === "string" &&
      typeof input.abstract === "string" &&
      typeof input.keyword === "string" &&
      "contributorsWeightings" in input &&
      typeof input.sellPrice === "number" &&
      input.pricingStrategy in PricingStrategy &&
      input.auctionStatus in AuctionStatus &&
      typeof input.pdfFile === "string"
    );
  }

  static deserialise(input: unknown): Publication | null {
    if (this.jsonTypeValid(input)) {
      return new Publication(
        input.title,
        input.abstract,
        input.keyword,
        input.contributors,
        input.contributorsWeightings,
        input.sellPrice,
        // We can do these because as part of typeValid we've confirmed that the values are valid:
        PricingStrategy[input.pricingStrategy as keyof typeof PricingStrategy],
        AuctionStatus[input.auctionStatus as keyof typeof AuctionStatus],
        input.pdfFile
      );
    }
    return null;
  }

  serialise(): PublicationJson {
    return new PublicationJson(
      this.title,
      this.abstract,
      this.keyword,
      this.contributors,
      this.contributorsWeightings,
      this.sellPrice,
      serializeEnum(PricingStrategy, this.pricingStrategy),
      serializeEnum(AuctionStatus, this.auctionStatus),
      this.pdfFile
    );
  }
}

//This line is only used for type inference purposes
const [,]: JsonSerializableStatic<PublicationJson, Publication> = Publication;*/

const ipfs = create({
  url: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

/*const ipfs2 = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});*/

/*export async function uploadFile<T extends JsonObject>(content: JsonSerializable<T>): Promise<CID> {
  console.log("UPLOADING TO IPFS");
  const serObj = content.serialise();
  const bufferContent = Buffer.from(JSON.stringify(serObj));
  console.log(bufferContent);
  const filesAdded = await ipfs.add(bufferContent);
  /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/*console.log("Added file:", filesAdded.cid);
  return filesAdded.cid;
}*/

export async function uploadFile<T extends object>(content: T): Promise<CID> {
  const serObj = defaultSerializer.serializeObject(content);

  const bufferObj = Buffer.from(JSON.stringify(serObj));

  const ipfsResponse = await ipfs.add(bufferObj);

  return ipfsResponse.cid;
}

export async function viewFile<T extends object>(c: CID, obj: Type<T>): Promise<T | null | undefined> {
  const fileBuffer = await ipfs.cat(c);

  return defaultSerializer.deserializeObject(fileBuffer.toString(), obj);
}

/*export async function viewFile<T extends Array<object>>(c: CID, obj: T | object) {
  const fileBuffer = await ipfs.cat(c);

  if (!isArray(obj))
    try {
      return defaultSerializer.deserializeObject(fileBuffer.toString(), obj);
    } catch (e) {
      return null;
    }

  for (const t of obj) {
    const curattempt = () => {
      try {
        return defaultSerializer.deserializeObject(fileBuffer.toString(), t);
      } catch (e) {
        return null;
      }
    };

    if (curattempt) return curattempt;
  }

  return null;
}*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/*function isJsonObject(o: any): o is JsonObject {
  return typeof o.__recordtype__ === "string";
}

// I feel like there must be a nicer way to do this
// Need to list all of the types we're happy to deserialise
const serTypes = {
  Publication: Publication,
  CompanyProfile: CompanyProfile,
  AcademicProfile: AcademicProfile,
};*/

/*function isT<
  JsonType extends JsonObject,
  InstType extends JsonSerializable<JsonType>,
  StaticType extends JsonSerializableStatic<JsonType, InstType>
>(obj: any, type: StaticType): obj is InstType {
  return (obj as JsonType).__recordtype__ === type.recordtype;
}*/

/*async function viewFile<T extends CompanyProfile | AcademicProfile>(c: CID): Promise<T>;
async function viewFile(c: CID): Promise<InstanceType<typeof serTypes[keyof typeof serTypes]>> {
  console.log("Getting file from ipfs:", c);
  const fileBuffer = await ipfs.cat(c);

  const jsonRes = JSON.parse(fileBuffer.toString());

  if (!isJsonObject(jsonRes)) throw "IPFS lookup returned an unhandled type of object";

  const deserType = serTypes[jsonRes.__recordtype__ as keyof typeof serTypes];

  const deserRes = deserType.deserialise(jsonRes);

  if (!deserRes) throw `IPFS lookup returned an invalid instance of ${jsonRes.__recordtype__}`;

  return deserRes;
}

export { uploadFile, viewFile };

const meep = viewFile<CompanyProfile | AcademicProfile>(CID.asCID('abddoiadfpjkaf')!);*/
