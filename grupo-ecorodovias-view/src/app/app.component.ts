import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public okColor = "#3bc710";
  public errorColor = "#c71035";
  public attentionColor = "#e8eb34";

  public loadFinish: boolean = false;
  public displayedColumns: string[] = ['alerta', 'data', 'sensor1', 'sensor2', 'latlong'];

  public items: DadosSensores[] = [];
  public title = 'Painel Monitoramento';
  public lat = 0;
  public lng = 0;
  public zoom = 15;

  constructor(public afs: AngularFirestore) {
  }

  public ngOnInit(): void {
    const that = this;

    this.afs.collection<DadosSensores>('dadossensores').snapshotChanges()
      .subscribe((values) => {
        that.items = [];
        that.loadFinish = false;
        
        values.forEach((item) => {
          var dataItem = item.payload.doc.data();
          dataItem.data = new Date(dataItem.data.seconds * 1000);

          dataItem.gruposensorid.get()
            .then((value) => {
              var cast = value.data() as GruposSensores;
              dataItem.grupoSensores = cast;
              dataItem.alerta = that.okColor;
              
              if (dataItem.sensor1 > 10 && dataItem.sensor1 < 30) {
                dataItem.alerta = that.attentionColor;
              } else if (dataItem.sensor2 > 0) {
                dataItem.alerta = that.errorColor;
              }

              that.items.push(dataItem);

              if (that.items.length == values.length) {
                that.loadFinish = true;
              }
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
  public alerta: string;
  public data: any;
  public gruposensorid: any;
  public sensor1: number | undefined;
  public sensor2: number | undefined;
  public grupoSensores: GruposSensores;
}

class GruposSensores {
  public dataultimasincronizacao: Date | undefined;
  public geolocalizacao: any;
  public id: number | undefined;
}