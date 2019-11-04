import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public items: DadosSensores[];
  public title = 'Painel Monitoramento';
  public lat = -23.5870834;
  public lng = -46.5026512;
  public zoom = 15;

  constructor(private afs: AngularFirestore){

    this.items = [];

    afs.collection<DadosSensores>('dadossensores').get()
    .subscribe((value) => {
      console.log('SUCESSO: ', value.docs);

      value.docs.forEach((item) =>{
         var convertItem = item.data() as DadosSensores;
         this.items.push(convertItem);
      });
    }, 
    ((error) => {
      console.error('ERROR: ', error);
    }));
  }
}

class DadosSensores {
  public data: any;
  public gruposensorid: any;
  public sensor1: number | undefined;
  public sensor2: number | undefined;
  public sensor3: number | undefined;
}