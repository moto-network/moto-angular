
import { Component, OnInit , Input} from '@angular/core';
import {TransactionsService} from '../../../Services/transactions.service';


@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactionsArray:any = [];
  _ts:TransactionsService;
  @Input() uid:string="";
  constructor(_transactionsService:TransactionsService) { 
    this._ts = _transactionsService;
  }

  ngOnInit(): void {
  }

  ngOnChanges():void{
    if(this.uid.length > 0 ){
      this._ts.getTransactions(this.uid).subscribe(remoteTransactions=>{
        this.transactionsArray = remoteTransactions.docs;
        console.log('transactions array ',this.transactionsArray);
      });
    }  
  }

  getCurrentStatus(completed:boolean):string{
    if(completed){
      return "Completed";
    }
    else{
      return "Pending";
    }
  }

  getDateCompleted(transaction:any):string{
    if(transaction.completed){
      
      return transaction.date_completed.toDate();
    }
    else{
      return " - ";
    }
  }

}
