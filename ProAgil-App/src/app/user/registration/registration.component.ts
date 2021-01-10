import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registeForm: FormGroup;

  constructor(public fb: FormBuilder
             , private toastr: ToastrService) { 
               
             }

  ngOnInit() {
    this.validation();
  }

  validation(){
    this.registeForm = this.fb.group({
      fullName:['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      userName:['', Validators.required],
      passwords: this.fb.group({
        password:['', Validators.required, Validators.minLength(4)],
        confirmPassword:['', Validators.required]
      },{validator: this.compararSenhas})
    });
  }


  compararSenhas(fb: FormGroup){
    const confirmaSenhaCtrl = fb.get('confirmarPassword');
    if(confirmaSenhaCtrl.errors == null || 'mismatch' in confirmaSenhaCtrl.errors ){
      if(fb.get('password').value !== confirmaSenhaCtrl.value){
        confirmaSenhaCtrl.setErrors({ mismatch: true});
      }else{
        fb.get('password').setErrors(null);
      }
      
    }
  }

  cadastrarUsuarios(){}

  cadastrarUsuario(){
    console.log();
  }

}
