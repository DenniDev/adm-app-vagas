import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthService } from "src/app/guards/verificador";

@Component({
  selector: "app-categorias",
  templateUrl: "./categorias.component.html",
})
export class CategoriasComponent implements OnInit {

  user: any;
  categorias = [];
  novo: boolean = false;
  categoria = {
    modalidade: null
  }
  color;


  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) { }

  carregar() {
    //Listar categorias
    this.afs.firestore.collection('categorias').get()
      .then((r) => {
        let categorias = [];
        r.forEach((rr) => {
          let obj = rr.data();
          obj['id'] = rr.id;
          categorias.push(obj);
        });

        this.categorias = categorias;
        // console.log(this.categorias);
      })
  }

  excluir(id){
    this.afs.firestore.collection('categorias').doc(id).delete()
    .then(() => {
      this.carregar()
    })
  }

  ngOnInit(){
    this.auth.user$.subscribe(user =>(
      this.user = user
    ));
    this.carregar()
  }

  adicionar() {
    if (this.categoria.modalidade) {
      this.afs.firestore.collection('categorias').add(this.categoria)
        .then(() => {
          this.novo = false;
          this.carregar()
        })
    }
  }
}
