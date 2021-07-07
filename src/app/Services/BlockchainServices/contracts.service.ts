import { Injectable } from '@angular/core';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getProvider, Contract, getContract } from "src/app.config"
import { WalletService } from './wallet.service';
import { NFT } from 'src/declaration';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  networkId: number | null = 56;
  constructor(private _walletService:WalletService) {
    _walletService.networkVersion.subscribe((networkId) => {
      this.networkId = networkId;
    });
   }

  getNFTFee(): Promise<any>{
    let network = this.networkId ? this.networkId : 56;
    let web3 = this.buildWeb3();
    console.log("get nft fee network is ", network);
    const nftContract: Contract = getContract(this._walletService.chainId, "nft");
    const web3Contract = new web3.eth.Contract(nftContract.abi,nftContract.address);
    return web3Contract.methods.getCreationFee().call();
  }

  mintNFT(nft: NFT): Promise<any>{
    console.log("network info is",getProvider(nft.chainId));
    let web3 = this.buildWeb3();
    const nftContract: Contract = getContract(this._walletService.chainId, "nft");
    const web3Contract = new web3.eth.Contract(nftContract.abi, nftContract.address);
    const transactionData = web3Contract.methods
      .userMint(nft.name, nft.chainId, nft.beneficiary,
        nft.contentHash, nft.tokenId).encodeABI();
    
    return new Promise((resolve, reject) => {
      this.getNFTFee()
        .then((nftFee: string) => {//can probably chain the .then statements instead of nesting
          web3.eth.getGasPrice()
            .then((gas: string) => {
              const transactionValueString = web3.utils.toWei(nftFee, 'ether');
              const transactionParameters = {
                gasPrice: web3.utils.numberToHex(gas),
                to: nftContract.address,
                value: web3.utils.numberToHex(transactionValueString),
                from: this._walletService.account,
                data: transactionData,
                chainId: "0x"+(nft.chainId).toString(16)
              }
              this._walletService.sendTransaction(transactionParameters)
                .then((transactionHash: string) => {
                  resolve(transactionHash);
                });
            });    
        })
      .catch ((err) => {
        console.log("get nft fee: ", err);
        reject(new Error("nft contract connection error"));
      })
    });
    
  }

  buildWeb3(): Web3 {
    return new Web3(getProvider(this._walletService.chainId));
  }

}


