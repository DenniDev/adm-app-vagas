import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router'; 
import firebase from 'firebase/app'
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor(
    private afAuth: AngularFireAuth,
    private auth: AuthService,
    private afs: AngularFirestore,
    private router: Router
  ) {

  }

  ngOnInit() {
  }

  fazerLogin() {
    if(this.email && this.password)
    {
      this.auth.signIn(this.email, this.password);
    }else {
      alert('Please enter your email & password!');
    }
  }
}
