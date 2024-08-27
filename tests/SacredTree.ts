import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "hardhat";
import {addresses} from "./data/trustees.js";
import { SacredTree } from "../typechain-types/SacredTree.js";
//import "@nomiclabs/hardhat-ethers";

let hashes : Array<string> = [];
let root : string;


function hash(_str : string) {
  return ethers.solidityPackedKeccak256([ "string"], [ _str ]);
}

function hash2(_str1 : string, _str2 : string) {
  return ethers.solidityPackedKeccak256([ "bytes32", "bytes32" ], [ _str1, _str2]);
}

async function buildMerkleTree(tree: SacredTree) {

  console.log("buildMerkleTree");

  for (let i = 0; i < addresses.length; i++) {
    const h = hash(addresses[i]);
    const t = await tree.hashes(i);
    expect(h).to.be.equals(t);
    hashes.push(h);
  }

  let n = addresses.length;
  let offset = 0;

  while (n >= 1) {
    console.log("\nbuildMerkleTree n = " + n + "; offset = " + offset + "len(hashes) = " + hashes.length);
    for (let i = 0; i < n - 1; i += 2) {

      console.log("buildMerkleTree h2 (" + (offset + i) + ", " + (offset + i + 1) + ")");
      const h2 = hash2(hashes[offset + i], hashes[offset + i + 1]);
      console.log("buildMerkleTree h2 " +  
                  hashes[offset + i] + " " +
                  hashes[offset + i + 1] + " " +
                  h2);
      hashes.push(h2);
    }
    offset += n;
    n = n / 2;
  }

  root = hashes[hashes.length - 1];
  console.log("buildMerkleTree root = " + root);
}


const ROOT_HASH = "0xbd150162dead740efc1f898cae744c69ccf898415b98d8c95e9ae7116361796c";
//const ROOT_HASH = "0x918b30ced8303c4f736f631a6487c869b53167af528a5712076cd05aa80f2e5d";
describe("SacredTree", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    console.log("deployOneYearLockFixture() addressess length = " + addresses.length);
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const SacredTree = await hre.ethers.getContractFactory("SacredTree");
    console.log("deployOneYearLockFixture() deploying");
    const tree = await SacredTree.deploy(addresses);

    console.log("deployOneYearLockFixture() deployed");
    return { tree, owner, otherAccount };
  }

  describe("Deployment", async () => {
    it("Should have the correct root", async () => {
      const { tree, owner, otherAccount } = await loadFixture(deployOneYearLockFixture);
      buildMerkleTree(tree);
      let root =  await tree.root();
      console.log("root        = " + root);
      
      expect(root).to.be.equals(ROOT_HASH);
    });

  });
});
