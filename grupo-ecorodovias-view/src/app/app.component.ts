import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public items: DadosSensores[] = [];
  public title = 'Painel Monitoramento';
  public lat = 0;
  public lng = 0;
  public zoom = 15;

  constructor(private afs: AngularFirestore) {

    afs.collection<DadosSensores>('dadossensores').snapshotChanges()
      .subscribe((values) => {
        this.items = [];
        values.forEach((item) => {
          var dataItem = item.payload.doc.data();

          dataItem.gruposensorid.get()
            .then((value) => {
              var cast = value.data() as GruposSensores;
              dataItem.grupoSensores = cast;

              this.items.push(dataItem);
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
    if (item.grupoSensores) {
      this.lat = item.grupoSensores.geolocalizacao['_lat'];
      this.lng = item.grupoSensores.geolocalizacao['_long']  
    }
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