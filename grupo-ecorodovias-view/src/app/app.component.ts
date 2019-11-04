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
  public lat = 0;
  public lng = 0;
  public zoom = 15;

  constructor(private afs: AngularFirestore) {

    this.items = [];

    afs.collection<DadosSensores>('dadossensores').get()
      .subscribe((value) => {
        value.docs.forEach((item) => {
          var convertItem = item.data() as DadosSensores;

          item.data().gruposensorid.get()
            .then((value) => {
              var cast = value.data() as GruposSensores;
              convertItem.grupoSensores = cast;

              this.items.push(convertItem);
            }).catch((error) => {
              console.error('ERROR REFERENCIA:', error);
            });
        });
      },
        ((error) => {
          console.error('ERROR: ', error);
        }));
  }

  public itemSelecionado(item: DadosSensores) {
    this.lat = item.grupoSensores.geolocalizacao['_lat'];
    this.lng = item.grupoSensores.geolocalizacao['_long']
  }
}

class DadosSensores {
  public data: any;
  public gruposensorid: any;
  public sensor1: number | undefined;
  public sensor2: number | undefined;
  public sensor3: number | undefined;
  public grupoSensores: GruposSensores;
}

class GruposSensores {
  public dataultimasincronizacao: Date | undefined;
  public geolocalizacao: any;
  public id: number | undefined;
}