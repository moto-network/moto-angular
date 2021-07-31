import { Injectable } from '@angular/core';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getProvider, Contract, getContract } from "src/app.config"
import { WalletService } from './wallet.service';
import { DBNFT, NFT } from 'src/declaration';
import { noNetworkDetected, unsupportedNetwork } from 'src/errors';
import { ObjectUnsubscribedError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  userWalletNetworkId: number | null = null;
  defaultContract = "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f";
  web3: Web3 | null = null;
  constructor(private _wallet: WalletService) {
    _wallet.networkObservable.subscribe((networkId) => {
      this.userWalletNetworkId = networkId;
    });
  }

  getNFTFee(network: number, contract: string = this.defaultContract): Promise<any> {
    return this._initWalletProvider(network)
      .then((web3) => {
        if (web3) {
          if (this.userWalletNetworkId) {
            const nftContract: Contract = getContract(this.userWalletNetworkId, "nft");
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            return web3Contract.methods.getCreationFee().call();
          }
          return Promise.reject(new Error(noNetworkDetected));
        }
      });
  }

  getAddToMarketFee(nft: NFT): Promise<string> {
    return this._initNFTProvider(nft)
      .then((web3) => {
        if (web3) {
          const marketContract: Contract = getContract(nft.chainId, "market");
          const web3Contract = new web3.eth.Contract(marketContract.abi, marketContract.address);
          return web3Contract.methods.getPublicationFee().call();
        }
        return Promise.reject(new Error("No Network Detected"));
      });
  }

  getMarketCommission(nft: NFT): Promise<string> {
    return this._initNFTProvider(nft)
      .then((web3) => {
        if (web3 && this.userWalletNetworkId) {
          const marketContract: Contract = getContract(nft.chainId, "market");
          const web3Contract = new web3.eth.Contract(marketContract.abi, marketContract.address);
          return web3Contract.methods.getMarketFee().call();
        }
        return Promise.reject(new Error("No Network Detected"));
      });
  }

  canMarketControl(nft: NFT): Promise<string> {
    return new Promise((resolve, reject) => {
      this._initNFTProvider(nft)
        .then((web3) => {
          if (web3) {
            console.log("web3 called");
            const nftContract: Contract = getContract(nft.chainId, "nft");
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            web3Contract.methods.getApproved(nft.tokenId).call()
              .then((result: string) => {
                console.log("result fromo contraact is ", result);
                resolve(result);
              })
              .catch(() => {
                reject(new Error("connection issue"));
              });
          }
        });
    });

  }

  getOwner(nft: NFT): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this._initNFTProvider(nft)
        .then((web3) => {
          if (web3) {
            const nftContract: Contract = getContract(nft.chainId, "nft");

            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            resolve(web3Contract.methods.ownerOf(nft.tokenId).call());
          }
          else {
            reject(new Error("Cant get NFT owner from blockchain"));
          };
        });
    });

  }

  addToMarket(nft: DBNFT): Promise<any> {
  
    return new Promise((resolve, reject) => {
      if (nft.chainId != this.userWalletNetworkId) {
        reject(new Error("User is on a different network than this NFT"));
      }
      this._initWalletProvider(this.userWalletNetworkId)
        .then(async (web3) => {
          if (web3 && this.userWalletNetworkId) {
            const marketContract = getContract(this.userWalletNetworkId, "market");
            const web3Contract = new web3.eth.Contract(marketContract.abi, marketContract.address);
            if (!nft.price) {
              reject(new Error("price not set"));
            }
            const price: string = web3.utils.toWei(nft.price!, 'ether');
            const timeInHex: string = web3.utils.toHex("10000000000");
            const encodedFunctionData = web3Contract.methods
              .createOrder(nft.contractAddress, nft.tokenId, price, timeInHex)
              .encodeABI();
            const fees = await Promise.all([this.getAddToMarketFee(nft), web3.eth.getGasPrice()]);
            const transactionValueString = web3.utils.toWei(fees[0], 'ether');
            const transactionParameters = {
              gasPrice: web3.utils.numberToHex(fees[1]),
              to: marketContract.address,
              value: web3.utils.numberToHex(transactionValueString),
              from: this._wallet.account,
              data: encodedFunctionData,
              chainId: "0x" + (nft.chainId).toString(16)
            };
            return await this._wallet.sendTransaction(transactionParameters);
          }
        })
        .catch((err) => {
          console.log("add to market error", err);
        });
    });
  }

  mintNFT(nft: NFT): Promise<any> {
    return new Promise((resolve, reject) => {
      this._initWalletProvider(this.userWalletNetworkId)
        .then(async (web3) => {
          if (!this.userWalletNetworkId || !web3) {
            reject(new Error(noNetworkDetected));
          }
          else{
          const nftContract: Contract = getContract(this.userWalletNetworkId, "nft");
          const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
          const encodedFunctionData = web3Contract.methods
            .userMint(nft.name, nft.chainId, nft.owner,
              nft.contentHash, nft.tokenId).encodeABI();
          const fees = await Promise.all([web3.eth.getGasPrice(),this.getNFTFee(nft.chainId, nft.contractAddress)]);
          const gas = web3.utils.numberToHex(fees[0]);
          const value = web3.utils.numberToHex(fees[1]);
            resolve(this._sendTransaction(gas, value, nft, encodedFunctionData));
          }
        })
        .catch((err) => {
          console.log("contract mint err", err);
        });
    });
    
  }

  grantMarketSinglePermission(nft: NFT): Promise<any> {
    const nftContract = getContract(nft.chainId, 'nft');
    const marketContract = getContract(nft.chainId, "market");
    if (nft.chainId != this.userWalletNetworkId) {
      return Promise.reject(new Error("user on different network than NFT"));
    }
    return new Promise((resolve, reject) => {
      this._initWalletProvider(this.userWalletNetworkId)
        .then(async (web3) => {
          if (web3) {
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            const encodedFunctionData = web3Contract.methods
              .approve(marketContract.address, nft.tokenId).encodeABI();
            const gas = await Promise.all([web3.eth.getGasPrice()]);
            const gasPrice = web3.utils.numberToHex(gas[0]);
            resolve(this._sendTransaction(gasPrice, "0x0", nft, encodedFunctionData))
          }
          else {
            reject(new Error("No Active Network. Make sure your wallet is connnected."))
          }
        })
    });
  }

  grantMarketTotalPermission(nft:NFT): Promise<any> {
    const nftContract = getContract(nft.chainId, 'nft');
    const marketContract = getContract(nft.chainId, "market");
    if (nft.chainId != this.userWalletNetworkId) {
      return Promise.reject(new Error("user on different network than NFT"));
    }
    return new Promise((resolve, reject) => {
      this._initWalletProvider(this.userWalletNetworkId)
        .then(async (web3) => {
          if (web3) {
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            const encodedFunctionData = web3Contract.methods
              .setApprovalForAll(marketContract.address, true).encodeABI();
            const gas = await Promise.all([web3.eth.getGasPrice()]);
            const gasPrice = web3.utils.numberToHex(gas[0]);
            resolve(this._sendTransaction(gasPrice, "0x0", nft, encodedFunctionData))
          }
          else {
            reject(new Error("No Active Network. Make sure your wallet is connnected."))
          }
        })
    });
  }

  private async _sendTransaction(gas: string, valueInHex: string, nft: NFT, data: any) {

    const transactionParameters = {
      gasPrice: gas,
      value: valueInHex,
      to: nft.contractAddress,
      from: this._wallet.account,
      data: data,
      chainId: "0x" + (nft.chainId).toString(16)
    };
    return await this._wallet.sendTransaction(transactionParameters);
  }

  private _initNFTProvider(nft: NFT): Promise<Web3 | null> {
    return this._initProvider(nft.chainId);
  }

  private _initWalletProvider(chainId: number | null): Promise<Web3 | null> {
    if (!chainId) {
      return Promise.reject(new Error("No network connection"));
    }
    return this._initProvider(chainId);
  }

  private _initProvider(chainId: number): Promise<Web3 | null> {
    const provider: string | null = getProvider(chainId);
    if (provider) {
      return this._buildWeb3(provider);
    }
    return Promise.reject({ "error": new Error("Unsupported Network"), "data": chainId });
  }

  private _buildWeb3(provider: string): Promise<Web3> {
    const web3Promise = new Promise<Web3>((resolve, reject) => {
     
      resolve(new Web3(provider));
    });
    return web3Promise;
  }

}


