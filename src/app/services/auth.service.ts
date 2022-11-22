import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {

  user$: Observable<User>;
  user: User;

  constructor(
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private router: Router,
  ) {
    this.user$ = this.afauth.authState
    .pipe(
      switchMap( user =>  {
        if (user)
        {
          return this.afs.doc<User>(`user/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  } // end of constructor

  async signIn (email, password)
  {


    this.afauth.setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
    .then(()=>{
      this.afauth.signInWithEmailAndPassword(email, password)
      .then((data)=> 
      {
        if(!data.user.emailVerified)
        {
          this.afauth.signOut();
        } else {
          this.router.navigate(['views/admin/dashboard']);
          console.log(this.router.navigate);
        }
      })
      .catch(error => {
        console.log("erro!!")
      })
      .catch(error => {
        console.log("erro!!")
      })
    })
  } // endo of signIn

  async signOut()
  {

    this.afauth.signOut()
    .then(()=>{
      this.router.navigate(['/login']);
    }) 
  } //End of signout

} 


