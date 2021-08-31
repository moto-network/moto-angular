import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SubscriptionsManagerService } from 'src/app/Services/subscriptions-manager.service';
import { Tier } from 'src/declaration';

@Component({
  selector: 'app-create-tier-dialog',
  templateUrl: './create-tier-dialog.component.html',
  styleUrls: ['./create-tier-dialog.component.css']
})
export class CreateTierDialogComponent implements OnInit {
  tier: Tier | null = null;
  tierForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    desc: new FormControl(''),
    price: new FormControl('', Validators.required)
  });
  constructor(public matDialogRef: MatDialogRef<CreateTierDialogComponent>
  , private _subscriptions:SubscriptionsManagerService) { }

  ngOnInit(): void {
    this._subscriptions.getTier()
      .then((tier) => {
        if (tier) {
          this.tier = tier;
          this._setValues(tier);
        }
      });
  }

  changeTier() {
    if (this.tier) {
      this.matDialogRef.close();
      const name = this.tierForm.get('name')?.value;
      const desc = this.tierForm.get("desc")?.value;
      const price = this.tierForm.get("price")?.value;

      const tempTier = this.tier;
      tempTier.name = name;
      tempTier.desc = desc;
      tempTier.price = price;

      if (tempTier != this.tier) {
        this._subscriptions.updateTier(this.tier, tempTier);
      }
    }
    else {
      
    }
    


  }

  private _setValues(tier: Tier) {
    this.tierForm.controls['name'].setValue(tier.name);
    this.tierForm.controls['desc'].setValue(tier.desc);
    this.tierForm.controls['price'].setValue(tier.price);
  }

}
