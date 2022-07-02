/* eslint-disable no-console */

//using the infura.io node, otherwise ipfs requires you to run a //daemon on your own computer/server.
//const IPFS = require("ipfs-api");

import { create, CID } from "ipfs-http-client";

class IPFSPublication {
  title = "";
  abstract = "";
  keyword = "";
  contributors: string[] = [];
  contributorsWeightings: number[] = [];
  sellPrice = -1;
  isAuction = false;
  pdfFile = "";
}

class IPFSProfile {
  name = "";
}

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

async function uploadFile(_content: File): Promise<CID> {
  console.log("UPLOADING TO IPFS");
  const bufferContent = Buffer.from(JSON.stringify(_content));
  console.log(bufferContent);
  const filesAdded = await ipfs.add(bufferContent);
  /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
  console.log("Added file:", filesAdded.cid);
  return filesAdded.cid;
}

async function viewFile(c: CID): Promise<IPFSPublication> {
  console.log("Getting file from ipfs:", c);
  const fileBuffer = await ipfs.cat(c);
  return JSON.parse(fileBuffer.toString());
}

export { uploadFile, viewFile, IPFSPublication };
