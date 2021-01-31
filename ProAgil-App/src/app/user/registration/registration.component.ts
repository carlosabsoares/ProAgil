import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/_services/auth.service';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  user: any={};

  constructor(private authService: AuthService
             , public fb: FormBuilder
             , public router: Router
             , private toastr: ToastrService) { 
               
             }

  ngOnInit() {
    this.validation();
  }

  validation(){
    this.registerForm = this.fb.group({
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
    const confirmaSenhaCtrl = fb.get('confirmPassword');
    if(confirmaSenhaCtrl.errors == null || 'mismatch' in confirmaSenhaCtrl.errors ){
      if(fb.get('password').value !== confirmaSenhaCtrl.value){
        confirmaSenhaCtrl.setErrors({ mismatch: true});
      }else{
        fb.get('password').setErrors(null);
      }
      
    }
  }

  cadastrarUsuario(){
    if(this.registerForm.valid){
      this.user = Object.assign(
        {password: this.registerForm.get('passwords.password').value}, 
        this.registerForm.value);
        //console.log(this.user);
        this.authService.register(this.user).subscribe(
          ()=>{
              this.router.navigate(['/user/login']);
              this.toastr.success('Cadastro Realizado');
          }, error =>{
            const erro = error.error();
            erro.forEach(element => {
                switch(element.code){
                  case 'DuplicateUserName':
                    this.toastr.error('Cadastro Duplicado!');
                    break;

                  default:
                    this.toastr.error(`Erro no Cadastro! Code: ${element.code}`);
                    break;
                }
            });
            
          }
           
        )
    }
  }

}
