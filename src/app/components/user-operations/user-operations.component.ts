import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-operations',
  templateUrl: './user-operations.component.html',
  styleUrls: ['./user-operations.component.scss']
})
export class UserOperationsComponent implements OnInit{

  toDo:string=''
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<UserOperationsComponent>) { }

  ngOnInit(): void {
this.toDo=this.data
  }


}
