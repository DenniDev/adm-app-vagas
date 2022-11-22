import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthService } from "src/app/guards/verificador";

@Component({
  selector: "app-produtos",
  templateUrl: "./produtos.component.html",
})
export class ProdutosComponent implements OnInit {
  vagas = [];
  novo: boolean = false;
  vaga = {
    titulo: null,
    resumo: null,
    imagem: null,
    empresa: null,
    categoria: null,
    descricao: null,
    regiao: null
  }
  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  categorias = [];
  color;
  user: any;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) { }

  //Upload de imagem
  onFileSelected(event) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `imagens/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`imagems/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            //Salva a URL gerada para o arquivo
            if (url) {
              this.fb = url;
              this.vaga.imagem = this.fb;
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

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

    //Listar produtos
    this.afs.firestore.collection('vagas').get()
      .then((r) => {
        let vagas = [];
        r.forEach((rr) => {
          let obj = rr.data();
          obj['id'] = rr.id;
          vagas.push(obj);
        });

        this.vagas = vagas;
        console.log(this.vagas);
      })
  }

  ngOnInit() {
    this.auth.user$.subscribe(user =>(
      this.user = user
    ));
    this.carregar()
  }




  excluir(id) {
    this.afs.firestore.collection('vagas').doc(id).delete()
      .then(() => {
        this.carregar()
      })
  }



  

  

  salvar() {
    if (
      this.vaga.titulo && this.vaga.resumo && this.vaga.descricao && 
      this.vaga.imagem && this.vaga.categoria && this.vaga.empresa 
      && this.vaga.regiao
    ) {
      this.afs.firestore.collection('vagas').add(this.vaga)
        .then(() => {
          this.carregar();
          this.novo = false;
          this.vaga = {
            titulo: null,
            resumo: null,
            descricao: null,
            imagem: null,
            categoria: null,
            empresa: null,
            regiao: null,
          }
        })
    }
    else {
      alert('Por favor, preencha todos os campos');
    }
  }
}
