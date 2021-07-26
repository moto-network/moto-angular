import { Injectable } from '@angular/core';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getProvider, Contract, getContract } from "src/app.config"
import { WalletService } from './wallet.service';
import { NFT } from 'src/declaration';
import { noNetworkDetected, unsupportedNetwork } from 'src/errors';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  networkId: number | null = null;
  defaultContract = "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f";
  constructor(private _walletService: WalletService) {
    _walletService.networkObservable.subscribe((networkId) => {
      this.networkId = networkId;
    });
  }

  getNFTFee(network: number, contract: string=this.defaultContract): Promise<any> {
    return this._initProvider()
      .then((web3) => {
        if (web3) {
          if (this.networkId) {
            const nftContract: Contract = getContract(this.networkId, "nft");
            const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
            return web3Contract.methods.getCreationFee().call();
          }
          return Promise.reject(new Error(noNetworkDetected));
        }
      });
  }

  getOwner(nft: NFT): Promise<string | null> {
    return this._initProvider()
      .then((web3) => {
        if (web3) {
          if (!this.networkId) {
            return Promise.reject();
          }
          const nftContract: Contract = getContract(this.networkId, nft.contractAddress);
          const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
          return web3Contract.methods.ownerOf(nft.tokenId);
        }
        return Promise.reject();
      });
  }

  mintNFT(nft: NFT): Promise<any> {
    return this._initProvider()
      .then((web3) => {
        if (web3) {
          if (!this.networkId) {
            return Promise.reject(new Error(noNetworkDetected))
          }
          const nftContract: Contract = getContract(this.networkId, "nft");
          const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
          const encodedFunctionData = web3Contract.methods
            .userMint(nft.name, nft.chainId, nft.beneficiary,
              nft.contentHash, nft.tokenId).encodeABI();
          this.getNFTFee(nft.chainId, nft.contractAddress)
            .then((nftFee: string) => {
              return nftFee;
            })
            .then((nftFee) => {
              return { nft: nftFee, gas: web3.eth.getGasPrice() };
            })
            .then((fees: any) => {
              const transactionValueString = web3.utils.toWei(fees.nft, 'ether');
              const transactionParameters = {
                gasPrice: web3.utils.numberToHex(fees.gas),
                to: nft.contractAddress,
                value: web3.utils.numberToHex(transactionValueString),
                from: this._walletService.account,
                data: encodedFunctionData,
                chainId: "0x" + (nft.chainId).toString(16)
              };
              return transactionParameters;
            })
            .then((transactionParameters: any) => {
              return this._walletService.sendTransaction(transactionParameters);
            })
        }
        return Promise.reject();
      });
  }

  private _initProvider(): Promise<Web3 | null> {
    if (!this._walletService.chainId) {
      console.log("chian id i s", this._walletService.chainId);
      console.log('no wallet service chainid');
      return new Promise((resolve, reject) => {
        reject(new Error(noNetworkDetected));
      });
    }
    const provider:string | null = getProvider(this._walletService.chainId);
    
    if (this._walletService.chainId && provider) {
      return this._buildWeb3(provider);
    }
    return new Promise((resolve, reject) => {
      reject(new Error(unsupportedNetwork));
    });
  }

  private _buildWeb3(provider: string): Promise<Web3 | null> {
    const web3Promise = new Promise<Web3 | null>((resolve, reject) => {
      resolve(new Web3(provider));
    });
    return web3Promise;
  }



}


