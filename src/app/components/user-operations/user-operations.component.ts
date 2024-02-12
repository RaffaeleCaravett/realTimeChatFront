import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-operations',
  templateUrl: './user-operations.component.html',
  styleUrls: ['./user-operations.component.scss']
})
export class UserOperationsComponent implements OnInit{

  toDo:string=''
  modifyForm!:FormGroup
  user:any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<UserOperationsComponent>, private toastr:ToastrService) { }

  ngOnInit(): void {
    if(this.data&&this.data=='delete'){
this.toDo=this.data
    }else{
this.toDo=this.data[1]
this.user=this.data[0]
this.modifyForm=new FormGroup({
  nome: new FormControl(this.user.nome,Validators.required),
  cognome:new FormControl(this.user.cognome,Validators.required),
  eta:new FormControl(this.user.eta,[Validators.required,Validators.min(18)]),
  email:new FormControl(this.user.email,Validators.required)
})
    }
  }

  onClose(res:boolean){
if(res){
  if(this.modifyForm.valid){
    let user ={
  nome:this.modifyForm.controls['nome'].value,
  cognome:this.modifyForm.controls['cognome'].value,
  eta:this.modifyForm.controls['eta'].value,
  email:this.modifyForm.controls['email'].value,
  password:''
}
this.dialogRef.close(user)
  }else{
    this.toastr.error("Completa il form prima. O controlla l'età inserita. ")
  }
}else{
  this.dialogRef.close(null)
}
  }

}
