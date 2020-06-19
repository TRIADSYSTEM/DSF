import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ChatService } from './chat.service';
import { Chat } from './chat';
import { HttpEventType } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormularioService } from '../formulario-dinamico/formulario.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  // Formulario com os dados do chamado
  formulario: FormGroup;
  // Id do chamado
  idChamado: number;
  // Id do usuario
  idUsuario: any = localStorage.getItem('id');
  // Dados do chat
  listaChat: Chat[];
  // Mensagem envio chat
  mensagemEnvio: String;
  // Mensagen erro carregar mensagens chats
  mensagemChat: String;
  // Lista com os arquivos selecionados
  selectedFiles: Set<File>;
  // Nome exibido na leble selecionar arquivos
  nomeArquivos: String = "Add Media";
  // Mensagem envio arquivos
  mensagemArquivos: String;
  //
  arquivoSelecionado: boolean = false;
  // Exbibe o proguesso do upload
  progress = 0;
  // Atualiza o chat automaticamente
  intervalChat: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ChatService,
    private spinner: NgxSpinnerService,
    private formularioService: FormularioService
  ) { }

  ngOnInit() {
    // Carrega o id do chat
    this.carregarIdChat();
    // Carrega o formulario
    this.configurarFormulario();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalChat);
  }

  /*
   * Carrega o id do chamado
   */
  carregarIdChat() {
    this.route.params.subscribe(
      (params: any) => {
        const id = params['idChamado'];
        this.idChamado = id;
        this.carregarChat(this.idChamado);
      }
    );
  }

  /*
   * Carrega as mensagens do chat
   * @param idChamado
   */
  carregarChat(idChamado: number) {
    // Exibe o carregando
    this.spinner.show();
    this.service.carregarChat(idChamado).subscribe(
      dados => {
        this.listaChat = dados;
        // Exibe o carregando
        this.spinner.hide();
        // Atualiza automaticamento
        this.atualizarChat();
      }, error => {
        console.debug(error);
        // Exibe o carregando
        this.spinner.hide();
        this.mensagemChat = 'Desculpe, não foi possível carregar as mensagens do chat, por favor, tente novamente mais tarde. '
      }
    );
  }

  /**
   * Atualiza o chat automaticamente
   */
  atualizarChat() {
    this.intervalChat = setInterval(
      () => {
        this.service.carregarChat(this.idChamado).subscribe(
          dados => this.listaChat = dados,
          () => {
            clearInterval(this.intervalChat);
            this.listaChat = [];
            this.mensagemChat = 'Desculpe, não foi possível carregar as mensagens do chat, por favor, tente novamente mais tarde. '
          }
        );
      }, 8000
    );
  }

  /*
   *  Configura os dados do formulario
   */
  configurarFormulario() {
    this.formulario = this.fb.group({
      content: [null, [Validators.required]],
      tickets_id: [this.idChamado],
      users_id: [this.idUsuario]
    });
  }

  /*
   * Envia as mensagens do chat
   */
  enviarMensagem() {
    if (this.formulario.valid) {
      this.spinner.show();
      clearInterval(this.intervalChat);
      this.service.enviarMensagem(this.formulario.value).subscribe(
        response => {
          if (response != null) {
            this.formulario.reset();
            this.ngOnInit();
          } else {
            this.exibirMensagens("Erro ao enviar seu comentário, por favor, tente novamente.");
          }
          this.spinner.hide();
        }, error => {
          console.debug(error);
          this.spinner.hide();
          this.exibirMensagens("Erro ao enviar seu comentário, por favor, tente novamente.");
        });
    } else {
      this.exibirMensagens("O campo comentário deve ser informado.");
    }
  }

  selecionarArquivo(event: any) {
    // Arquivos anexados
    let listaArquivos = event.target.files;
    this.nomeArquivos = "Add Media";
    this.mensagemArquivos = null;
    this.arquivoSelecionado = false;
    try {
      // Valida cada imagem anexada
      for (let arquivo of listaArquivos) {
        // Valida o formato de cada arquivo
        this.validarFormatoArquivo(arquivo);
        // Valida o tamanho de cada arquivo
        this.validarTamanhoImagem(arquivo);
      }
      this.selectedFiles = listaArquivos;
      // Altera o nome do campo de upload de arquivos
      if (listaArquivos.length > 0) {
        this.arquivoSelecionado = true;
        this.nomeArquivos = listaArquivos.length + ' arquivo (s).';
      }
    } catch (erro) {
      this.nomeArquivos = "Add Media";
      this.selectedFiles = null;
      this.mensagemArquivos = erro;
    }
  }

  /*
   * Valida o formato do arquivo a ser anexado
   * @param arquivo
   */
  validarFormatoArquivo(arquivo: File) {
    let ext = arquivo.name.match(/\.(.+)$/)[1];
    if (ext.toLocaleLowerCase() !== 'jpeg' && ext.toLocaleLowerCase() !== 'png'
      && ext.toLocaleLowerCase() !== 'jpg' && ext.toLocaleLowerCase() !== 'mpg'
      && ext.toLocaleLowerCase() !== 'mp3' && ext.toLocaleLowerCase() !== 'ogg'
      && ext.toLocaleLowerCase() !== 'm4a') {
      throw `O formato do arquivo " ${arquivo.name} " é inválido. Apenas arquivos nos formatos JPEG, PNG, JPG, MPG, OGG, MP3 e m4a são permitidos.`;
    }
  }

  /*
   * Valida o tamanho do arquivo anexado
   * @param arquivo
   */
  validarTamanhoImagem(arquivo: File) {
    if (arquivo.size > 20971520) {
      throw `O tamanho do arquivo " ${arquivo.name} " é inválido. Só são permitidos arquivos com no máximo 20MB.`;
    }
  }

  /*
   * Gera o nome da pasta para salvar os arquivos
   */
  gerarNomePasta() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    let nomePasta = '';
    for (var i = 0; i < 2; i++) {
      nomePasta += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return nomePasta;
  }

  /*
   * Faz o upload do arquivo
   */
  fazerUpload() {
    if (this.arquivoSelecionado) {
      // Nome aleatorio da pasta
      let nomePasta = this.gerarNomePasta();
      clearInterval(this.intervalChat);
      this.service.carregarArquivos(this.selectedFiles, this.idChamado, nomePasta)
        .subscribe(
          (event: any) => {
            if (event.type === HttpEventType.Response) {
              this.nomeArquivos = "Add Media";
              this.selectedFiles = null;
              setTimeout(() => {
                this.progress = 0;
                this.ngOnInit();
              }, 50);
            } else if (event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((event.loaded * 100) / event.total);
              if (percentDone == 100) {
                this.spinner.show();
              }
              this.progress = percentDone;
            }
          }, () => {
            this.spinner.hide();
            this.exibirMensagens("Erro ao fazer o upload, por favor, tente novamente.");
          }
        );
    } else {
      this.exibirMensagens("Deve ser selecionado pelo menos um arquivo.");
    }
  }

  /*
   * Baixa os arquivos do chat
   * @param idDocumento
   * @param nmArquivo
   */
  baixarItem(idDocumento: number, nmArquivo: string) {
    this.spinner.show();
    this.service.baixarItem(idDocumento, localStorage.getItem('session')).subscribe(
      dados => {
        this.formularioService.handleFile(dados, nmArquivo);
        this.spinner.hide();
      }, () => {
        this.exibirMensagens("Desculpe, ocorreu um erro ao baixar o item solicitado.");
        this.spinner.hide();
      }
    );
  }

  /*
   * Exibe a mensagem do sistema
   * @param mensagem
   */
  exibirMensagens(mensagem: String) {
    this.mensagemEnvio = mensagem;
    setTimeout(() => {
      this.mensagemEnvio = null;
    }, 3000);
  }

  /*
   * Volta para pagina de home
   */
  voltarHome() {
    this.router.navigate(['/home']);
  }

}
