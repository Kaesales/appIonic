import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  vetor2: { nome: string, description: string, checked?: boolean }[] = [];
  lastDeletedItem: { nome: string, description: string, checked?: boolean } | null = null;
  lastDeletedIndex: number | null = null;
  undoTimeout: any;

  dataFormatada: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.formatarData();
  }

  formatarData() {
    const agora = new Date();

    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const diasDaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

    const dia = agora.getDate();
    const mes = meses[agora.getMonth()];
    const diaSemana = diasDaSemana[agora.getDay()];

    this.dataFormatada = `${dia} de ${mes} - ${diaSemana}`;
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Adicionar tarefa',
      inputs: [
        {
          name: 'nome',
          placeholder: 'Exemplo: Ir ao supermercado'
        },
        {
          name: 'description',
          placeholder: 'descrição',
          value: '' 
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Adicionar',
          handler: data => {
            if (data.nome) { 
              this.vetor2.push({
                nome: data.nome,
                description: data.description || '', 
                checked: false
              });
            }
          }
        }
      ],
    });
    prompt.present();
  }

  onCheckboxChange(index: number) {
    if (this.vetor2[index].checked) {
      this.excluir(index);
    }
  }

  excluir(index: number) {
    this.lastDeletedItem = { ...this.vetor2[index] };
    this.lastDeletedIndex = index;

   
    this.vetor2.splice(index, 1);


    const toast = this.toastCtrl.create({
      message: 'Tarefa excluída.',
      position: 'bottom',
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Desfazer'
    });

    toast.present();

   
    this.undoTimeout = setTimeout(() => {
      this.lastDeletedItem = null;
      this.lastDeletedIndex = null;
    }, 5000);

   
    toast.onDidDismiss((_, role) => {
      if (role === 'close') {
        this.restaurar();
        clearTimeout(this.undoTimeout); 
      }
    });
  }

  restaurar() {
    if (this.lastDeletedItem && this.lastDeletedIndex !== null) {
     
      const itemRestaurado = { ...this.lastDeletedItem, checked: false };
      this.vetor2.splice(this.lastDeletedIndex, 0, itemRestaurado);
      
     
      this.lastDeletedItem = null;
      this.lastDeletedIndex = null;
    }
  }
}