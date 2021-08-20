import { Injectable } from '@angular/core';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getProvider, Contract, getContract } from "src/app.config"
import { WalletService } from './wallet.service';
import { Account, FileNFT, ListingNFT, NFT } from 'src/declaration';
import { noNetworkDetected } from 'src/errors';

import { BigNumber } from "bignumber.js";
import { getLocaleNumberFormat } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NullTemplateVisitor } from '@angular/compiler';
import { access } from 'node:fs';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  defaultContract = "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f";
  userAccount: Account | null = null;
  constructor(private _wallet: WalletService, public snackBar: MatSnackBar) {
    this._wallet.getAccount()
      .subscribe((account) => {
        this.userAccount = account;
      })
  }

  /**
   * NFT creation fee. call the contract
   * @todo abstract the function for getting different nft contract info.
   * @param {number} network  which chain
   * @param {string} contract which nft ccontract 
   * @returns {Promise<string>}
   */
  getNFTFee(network: number, contractName: string = "nft"): Promise<string> {
    return this._initWalletProvider(network)
      .then((web3) => {
        if (web3) {
          if (this.userAccount?.network!) {
            const nftContract: Contract = getContract(this.userAccount?.network!, contractName);
            console.log("second nft contract ", nftContract);
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            return web3Contract.methods.getCreationFee().call();
          }
          return Promise.reject(new Error(noNetworkDetected));
        }
      });
  }

  /**
   * 
   * @param {NFT} nft 
   * @returns {Promise<string>}
   */
  getCreateListingFee(nft: NFT): Promise<string> {
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

  getCoinBalance(account: Account): Promise<string> {
    return new Promise((resolve, reject) => {
      this._initWalletProvider(account.network)
        .then((web3) => {
          if (!web3) {
            reject(new Error("No wallet detected"));
          }
          const motoContract: Contract = getContract(account.network, 'moto');
          const motoWeb3 = new web3!.eth.Contract(motoContract.abi, motoContract.address);
          resolve(motoWeb3.methods.balanceOf(account.address).call());
        })
        .catch((err) => {
          reject(new Error("Wallet Error::" + err.message));
        });
    });
  }

  getMotoNFTBalance(account: Account): Promise<string> {
    return new Promise((resolve, reject) => {

      this._initWalletProvider(account.network)
        .then((web3) => {
          if (!web3) {
            reject(new Error("No wallet detected"));
          }
          const motoContract: Contract = getContract(account.network, 'nft');
          const nftWeb3 = new web3!.eth.Contract(motoContract.abi, motoContract.address);
          resolve(nftWeb3.methods.balanceOf(account.address).call());
        })
        .catch((err) => {

          console.log("err", err);
          reject(new Error("Error getting Moto NFT balance: " + err.message));
        });
    });
  }

  getMarketCommission(nft: NFT): Promise<string> {
    return this._initNFTProvider(nft)
      .then((web3) => {
        if (web3 && this.userAccount?.network!) {
          const marketContract: Contract = getContract(nft.chainId, "market");
          const web3Contract = new web3.eth.Contract(marketContract.abi, marketContract.address);
          return web3Contract.methods.getMarketFee().call();
        }
        return Promise.reject(new Error("No Network Detected"));
      });
  }

  canMarketControlThisNFT(nft: NFT): Promise<string> {
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

  canMarketControlAllNFTs(nft: NFT): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._initNFTProvider(nft)
        .then((web3) => {
          if (web3) {
            const nftContract: Contract = getContract(nft.chainId, "nft");
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            const marketContract: Contract = getContract(nft.chainId, "market");
            web3Contract.methods.isApprovedForAll(nft.owner, marketContract.address).call()
              .then((result: boolean) => {
                if (typeof result !== undefined || typeof result !== null) {
                  resolve(result);
                }
                else {
                  reject(new Error("error checkingg All privileges"));
                }
              })
              .catch(() => {
                reject(new Error("connection issue"));
              });
          }
        });
    });
  }

  getNFTOwner(nft: NFT): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this._initNFTProvider(nft)
        .then((web3) => {
          if (web3) {
            const nftContract: Contract = getContract(nft.chainId, "nft");
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            console.log("contract calling");
            resolve(web3Contract.methods.ownerOf(nft.tokenId).call());
          }
          else {
            reject(new Error("Cant get NFT owner from blockchain"));
          };
        });
    });
  }

  buyNFT(coin: string, nft: NFT, nftPrice: string):Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._initWalletProvider(this.userAccount?.network!)
        .then((web3) => {
          if (!(web3 && this.userAccount?.network!)) {
            reject(new Error("unable to connect"));
          }
          this._getAllocation(coin, web3!)
            .then((marketAllocation) => {
              if (marketAllocation) {
                console.log("market alocation from buyNNFT", marketAllocation);
                const marketAllocationBN = new BigNumber(marketAllocation);
                const priceBN = new BigNumber(nftPrice);
                if (!marketAllocationBN.gte(priceBN)) {
                  reject(new Error("Insufficient Allocation"));
                }
                const market: Contract = getContract(this.userAccount?.network!, "market");

                const web3market = new web3!.eth.Contract(market.abi, market.address);
                const price = web3!.utils.numberToHex(nftPrice);
                const data = web3market.methods.executeOrder(nft.contractAddress, nft.tokenId, price)
                  .encodeABI();
                resolve(this._sendTransaction("0x0", market.address, nft.chainId, data));

              }
            });
        })

    });
  }
  /**
   * how much coin has bee allocated for the market to control itself
   * @param {string} coin coin name. not address 
   * @returns {Promise<string>}
   */
  getAllocation(coin: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._initWalletProvider(this.userAccount?.network!)
        .then((web3) => {
          if (!web3) {
            reject(new Error("unable to connect"));
          }
          resolve(this._getAllocation(coin, web3!));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * get the exact amount of money necessary allocated to the market
   * @param {string} coin coin name
   * @param {FileNFT} nft 
   * @param {string} amount 
   * @returns {Promise<string>}
   */
   setExactAllocation(coin: string, nft: NFT, price: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._initWalletProvider(this.userAccount?.network!)
        .then((web3) => {
          if (!web3) {
            reject(new Error("Unable to connect to blockchain server"));
          }

          resolve(this._setExactAllocation(coin, nft, price, web3!))
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  increaseAllocation(coin: string, amount: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._initWalletProvider(this.userAccount?.network!)
        .then((web3) => {
          if (!web3) {
            reject(new Error("unable to connect"));
          }
          resolve(this._increaseAllocation(coin, amount, web3!))
        })

    });
  }

  decreaseAllocation(coin: string, amount: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._initWalletProvider(this.userAccount?.network!)
        .then((web3) => {
          if (!web3) {
            reject(new Error("unable to connect"));
          }
          resolve(this._decreaseAllocation(coin, amount, web3!))
        })

    });
  }

  addNFTtoMarket(nft: NFT, priceInSubUnits: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (nft.chainId != this.userAccount?.network!) {
        reject(new Error("User is on a different network than this NFT"));
      }
      this._initWalletProvider(this.userAccount?.network!)
        .then(async (web3) => {
          if (web3 && this.userAccount?.network!) {
            const marketContract = getContract(this.userAccount?.network!, "market");
            const web3Contract = new web3.eth.Contract(marketContract.abi, marketContract.address);
            if (!priceInSubUnits) {
              reject(new Error("price not set"));
            }
            const priceInHex = web3.utils.numberToHex(priceInSubUnits);
            const timeInHex: string = web3.utils.toHex("10000000000");
            const encodedFunctionData = web3Contract.methods
              .createOrder(nft.contractAddress, nft.tokenId, priceInHex, timeInHex)
              .encodeABI();
            const fees = await Promise.all([this.getCreateListingFee(nft), web3.eth.getGasPrice()]);
            const transactionValueString = web3.utils.toWei(fees[0], 'ether');
            const transactionParameters = {
              gasPrice: web3.utils.numberToHex(fees[1]),
              to: marketContract.address,
              value: web3.utils.numberToHex(transactionValueString),
              from: this.userAccount.address,
              data: encodedFunctionData,
              chainId: "0x" + (nft.chainId).toString(16)
            };
            resolve(this._wallet.sendTransaction(transactionParameters));
          }
        })
        .catch((err) => {
          console.log("add to market error", err);
        });
    });
  }

  createNFT(account: Account, nft: NFT): Promise<any> {
    return new Promise((resolve, reject) => {
      this._initWalletProvider(account.network)
        .then(async (web3) => {
          if (!web3) {
            reject(new Error("No Network"));
          }
          else {
            const nftContract: Contract = getContract(account.network, "nft");
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            const functionCall = web3Contract.methods
              .userMint(nft.name, nft.chainId, nft.owner,
                nft.contentHash, nft.tokenId);
            const encodedFunctionData = functionCall.encodeABI();

            resolve(this._sendTransaction('0x0', nft.contractAddress, nft.chainId, encodedFunctionData));
          }
        })
        .catch((err) => {

          reject(err);
        });
    });
  }



  grantMarketSinglePermission(nft: NFT): Promise<any> {
    const nftContract = getContract(nft.chainId, 'nft');
    const marketContract = getContract(nft.chainId, "market");
    if (nft.chainId != this.userAccount?.network) {
      return Promise.reject(new Error("user on different network than NFT"));
    }
    return new Promise((resolve, reject) => {
      this._initWalletProvider(this.userAccount?.network!)
        .then(async (web3) => {
          if (web3) {
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            const encodedFunctionData = web3Contract.methods
              .approve(marketContract.address, nft.tokenId).encodeABI();

            resolve(this._sendTransaction("0x0", nft.contractAddress, nft.chainId, encodedFunctionData))
          }
          else {
            reject(new Error("No Active Network. Make sure your wallet is connnected."))
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  grantMarketTotalPermission(nft: NFT): Promise<any> {
    const nftContract = getContract(nft.chainId, 'nft');
    const marketContract = getContract(nft.chainId, "market");
    if (nft.chainId != this.userAccount?.network!) {
      return Promise.reject(new Error("user on different network than NFT"));
    }
    return new Promise((resolve, reject) => {
      this._initWalletProvider(this.userAccount?.network!)
        .then(async (web3) => {
          if (web3) {
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            const encodedFunctionData = web3Contract.methods
              .setApprovalForAll(marketContract.address, true).encodeABI();

            resolve(this._sendTransaction("0x0", nft.contractAddress, nft.chainId, encodedFunctionData))
          }
          else {
            reject(new Error("No Active Network. Make sure your wallet is connnected."))
          }
        })
    });
  }

  private _getAllocation(coin: string, web3: Web3): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.userAccount?.network!) {
        reject(new Error("no wallet connected"));
      }
      const market = getContract(this.userAccount?.network!!, "market");
      const coinContract = getContract(this.userAccount?.network!!, coin);
      const coinWeb3 = new web3.eth.Contract(coinContract.abi, coinContract.address);
      resolve(coinWeb3.methods.allowance(this.userAccount?.address, market.address).call());
    });

  }

  private _increaseAllocation(coin: string, amount: string, web3: Web3): Promise<string> {
    if (!this.userAccount?.network!) {
      return Promise.reject(new Error("no wallet"));
    }
    const market = getContract(this.userAccount?.network!, "market");
    const coinContract = getContract(this.userAccount?.network!, coin);
    const coinWeb3 = new web3.eth.Contract(coinContract.abi, coinContract.address);
    return new Promise(async (resolve, reject) => {
      const data = coinWeb3.methods
        .increaseAllowance(market.address, amount)
        .encodeABI()
      resolve(this._requestAllocationFromContract(data, coinContract.address));

    });
  }

  private _decreaseAllocation(coin: string, amount: string, web3: Web3): Promise<string> {
    if (!this.userAccount) {
      return Promise.reject(new Error("no wallet"));
    }
    const market = getContract(this.userAccount.network!, "market");
    const coinContract = getContract(this.userAccount.network!, coin);
    const coinWeb3 = new web3.eth.Contract(coinContract.abi, coinContract.address);
    return new Promise(async (resolve, reject) => {
      Promise.all(
        [coinWeb3.methods
          .decreaseAllowance(market.address, amount)
          .estimateGas({ from: this.userAccount!.address }),
        coinWeb3.methods
          .decreaseAllowance(market.address, amount)
          .encodeABI()])
        .then((gasAndData) => {
          resolve(this._requestAllocationFromContract(gasAndData, coinContract.address));
        });
    });

  }



  private _setExactAllocation(coin: string, nft: NFT, price: string, web3: Web3): Promise<string> {
    if (!this.userAccount) {
      return Promise.reject(new Error("no wallet connected"));
    }
    const market = getContract(this.userAccount.network, "market");
    const coinContract = getContract(this.userAccount.network, coin);
    const coinWeb3 = new web3.eth.Contract(coinContract.abi, coinContract.address);

    return new Promise((resolve, reject) => {

      Promise.all([coinWeb3.methods
        .allowance(this.userAccount!.address, market.address)
        .call(), this.getMarketCommission(nft)])
        .then((allocationAndFee: string[]) => {
          console.log("allocation and fee", allocationAndFee);
          if (allocationAndFee[0] && allocationAndFee[1]) {

            const fee = new BigNumber(allocationAndFee[1]);
            const allocationBN = new BigNumber(allocationAndFee[0]);
            const priceBN = new BigNumber(price);
            const totalNeededBN = priceBN.plus(fee);
            if (allocationBN.lt(totalNeededBN)) {
              console.log("allocation is less than total needed");
              const requestAmount = totalNeededBN.minus(allocationBN);
              resolve(this._increaseAllocation(coin, requestAmount.toString(), web3));

            }
          }
          else {
            reject(new Error("Cannot get allocation from chain"));
          }
        });
    });
  }

  private async _requestAllocationFromContract(data: any, toAddress: string): Promise<string> {
    
    return this._sendTransaction('0x0', toAddress, this.userAccount?.network!!, data);
  }

  private async _sendTransaction(valueInHex: string,
    to: string, chainId: number, data: any):Promise<string> {

    const transactionParameters = {

      value: valueInHex,
      to: to,
      from: this.userAccount?.address,
      data: data,
      chainId: "0x" + (chainId).toString(16)
    };
    return await this._wallet.sendTransaction(transactionParameters);
  }

  private _initNFTProvider(nft: NFT): Promise<Web3 | null> {
    return this._initProvider(nft.chainId);
  }

  private _initWalletProvider(chainId: number | null): Promise<Web3 | null> {
    if (!chainId) {
      return Promise.reject(new Error("No wallet detected. Did you connect a wallet provider?"));
    }
    return this._initProvider(chainId);
  }

  private _initProvider(chainId: number): Promise<Web3 | null> {
    const provider: string | null = getProvider(chainId);
    if (provider) {
      return this._buildWeb3(provider);
    }
    else {
      return Promise.reject(new Error("Unsupported Network"));
    }

  }

  private _buildWeb3(provider: string): Promise<Web3> {
    const web3Promise = new Promise<Web3>((resolve, reject) => {

      resolve(new Web3(provider));
    });
    return web3Promise;
  }
}


