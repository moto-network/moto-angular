import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SubscriptionsManagerService } from 'src/app/Services/subscriptions-manager.service';
import { Tier } from 'src/declaration';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { TransactionsService } from 'src/app/Services/transactions.service';
import { ProfileService } from 'src/app/Services/profile.service';

@Component({
  selector: 'app-create-tier-dialog',
  templateUrl: './create-tier-dialog.component.html',
  styleUrls: ['./create-tier-dialog.component.css']
})
export class CreateTierDialogComponent implements OnInit {
  tier: Tier | null = null;
  loading: boolean = false;
  tierForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    desc: new FormControl(''),
    price: new FormControl('', Validators.required)
  });
  constructor(public matDialogRef: MatDialogRef<CreateTierDialogComponent>
    , private _subscriptions: SubscriptionsManagerService,
    @Inject(MAT_DIALOG_DATA) public data: undefined | Tier,
  private _wallet:WalletService, private _profile:ProfileService) { }

  ngOnInit(): void {
    if (this.data) {
      this.tier = this.data;
      console.log(this.tier);
      this._setValues(this.tier);
    }
  }

  async manageTier() {
    const name = this.tierForm.get('name')?.value;
    const desc = this.tierForm.get("desc")?.value;
    const price = this.tierForm.get("price")?.value;
    if (this.tier) {
      console.log("tier found");
      const tempTier = this.tier;
      tempTier.name = name;
      tempTier.desc = desc;
      tempTier.price = price;
      if (tempTier != this.tier) {
        this._subscriptions.updateTier(this.tier, tempTier);
      }
    }
    else {
      console.log("tier not found");
      this.loading = true;
      this._wallet.getAccount()
        .subscribe((account) => {
          if (account) {
            const tier: Tier = {
              name: name,
              desc: desc,
              price: price,
              network: account.network,
              valid: true,
              owner: account.address,
              id:"0"
            };
            this._subscriptions.updateTier(tier)
              .then((result) => {
                console.log("dialog ", result);
                if (result) {

                  this.loading = false;
                  this.matDialogRef.close();
                  this._subscriptions.getTiers();
                }
              })
              .catch((err) => {
                this._profile.openSnackBar(err.message, 4000);
               });
          }
         
        });
    }
    
  }

  private _setValues(tier: Tier) {
    this.tierForm.controls['name'].setValue(tier.name);
    this.tierForm.controls['desc'].setValue(tier.desc);
    this.tierForm.controls['price'].setValue(tier.price);
  }

}
