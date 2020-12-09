import * as FilePond from '../assets/filepond/dist/filepond.esm.js';
import FilePondPluginFileValidateSize from '../assets/filepond/dist/plugins/filepond-plugin-file-validate-size/filepond-plugin-file-validate-size.esm.js';
import FilePondPluginImagePreview from '../assets/filepond/dist/plugins/filepond-plugin-image-preview/filepond-plugin-image-preview.esm.js';
import { BrowserDetect } from '../assets/browser-detect/BrowserDetect.js';

import { HttpFetchHelper } from './helper/HttpFetchHelper.js'

import { PessoaIdentificacaoModule } from './pessoa/identificacao/PessoaidentificacaoModule.js';
import { FuncionarioEntity } from './cadastro/funcionario/FuncionarioEntity.js';
import { PessoaModule } from './pessoa/PessoaModule.js';
import { PessoaTipoDePublicoModule } from './cadastro/tipoDePublico/PessoaTipoDePublicoModule.js';

class App {

  constructor() {

    this.HttpFetchHelper = new HttpFetchHelper();
    this.FuncionarioEntity = new FuncionarioEntity({"id": 0, "codigoEquipe": 2});
    this.PessoaModule = new PessoaModule(this);  
    this.PessoaTipoDePublicoModule = null;
    this.PessoaIdentificacaoModule = null;
        
    this.init();
    this.events();
  }

  init() {

    FilePond.registerPlugin(FilePondPluginFileValidateSize, FilePondPluginImagePreview);
    FilePond.setOptions({
      allowDrop: true,
      allowReplace: false,
      instantUpload: false,
      server: {
        url: 'http://localhost:8080/app',
        process: './process.php',
        revert: './revert.php',
        restore: './restore.php?id=',
        fetch: './fetch.php?data='
      }
    });

    $('[data-toggle="tooltip"]').tooltip();
  }

  events() {

    document.querySelectorAll('#btnIdentificacao').forEach(element => {
      element.addEventListener('click', (event) => {
        let options = {
          size: 'Xl',
          app: '/modules/pessoa/identificacao/pessoaIdentificacao.html',
          title: 'Identificação',
          callBack: this.setPessoaIdentificacaoModule
        };
        this.getModal(options);
      }, false);
    });
    
    document.querySelectorAll('#btnCancelarAtendimento').forEach(element => {

      element.addEventListener('click', (event) => {
        let options = {
          size: 'Sm',
          app: '/modules/cancelarAtendimento.html',
          title: 'Cancelar Atendimento'
        };
        this.getModal(options);
      }, false);
    });

    document.querySelectorAll('#btnConcluirAtendimento').forEach(element => {

      element.addEventListener('click', (event) => {
        $.toast({
          heading: 'Positioning',
          text: 'Use the predefined ones, or specify a custom position object.',
          position: 'top-right',
          stack: false
        });
      }, false);
    });

    document.querySelectorAll('#btnOpenLftMnu').forEach(element => {

      element.addEventListener("click", (event) => {

        //let offcanvas_id = $('#btnOpenLftMnu').attr('data-canvas');
        $('#asideMenu').toggleClass("show");
        $('body').toggleClass("offcanvas-active");
        $(".screen-overlay").toggleClass("show");
        $('#btnOpenLftMnu').tooltip('hide');
        event.preventDefault();
        event.stopPropagation();
      }, false);
    });

    document.querySelector('body').addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.closeCanvasLeftMenu();
      }
    }, false);

    document.querySelector(".btn-close, .screen-overlay").addEventListener('click', (event) => {
      this.closeCanvasLeftMenu();
    }), false;

    document.querySelector('#icoControlWindow').addEventListener('click', (event) => {

      if (document.querySelector('#icoControlWindow i').classList.contains('fa-window-minimize')) {
        this.minimizarTabsInferiores('#icoControlWindow', '#wrapperHistVencidos', true);
        this.minimizarTabsInferiores('#icoControlWindow', '#wrapperHistPendentes', true);
        this.minimizarTabsInferiores('#icoControlWindow', '#wrapperCorresp', true);
        this.maximizarTabsSuperiores('#wrapperPessoa', true);
        this.maximizarTabsSuperiores('#wrapperManif', true);
      } else {
        this.minimizarTabsInferiores('#icoControlWindow', '#wrapperHistVencidos', false);
        this.minimizarTabsInferiores('#icoControlWindow', '#wrapperHistPendentes', false);
        this.minimizarTabsInferiores('#icoControlWindow', '#wrapperCorresp', false);
        this.maximizarTabsSuperiores('#wrapperPessoa', false);
        this.maximizarTabsSuperiores('#wrapperManif', false);
      }

    });

    document.querySelector('#btnEnderecos').addEventListener('click', (event) => {

      if (document.querySelector('#btnEnderecos i').classList.contains('fa-window-restore')) {
        this.minimizarTabsInferiores('#btnEnderecos', '#frmEndereco', false);
      } else {
        this.minimizarTabsInferiores('#btnEnderecos', '#frmEndereco', true);
      }
    }, false);
  }

  setPessoaIdentificacaoModule(){
    this.PessoaIdentificacaoModule = new PessoaIdentificacaoModule(appModule);
  }

  carregaCadastroTipoDePublico(){
    this.PessoaTipoDePublicoModule = new PessoaTipoDePublicoModule(appModule);
  }

  async carregarCombo(options){

    if(!options.value){ 
      options['value'] = 'id';
    }
    if(!options.text){ 
      options['text'] = 'descricao';
    }

    let data = await this.HttpFetchHelper.getData(options.url);
    let combo = `<option value="">Selecione</option>`;
    data.content.forEach(item => {
        combo += `<option value="${item[options.value]}">${item[options.text]}</option>`      
    });
    document.querySelector(options.obj).insertAdjacentHTML('afterbegin', combo);
  }

  getPessoa(codigoPessoa, espec){

    switch(espec){
      case "AUTO":
        this.PessoaModule.carregaEspecAuto(codigoPessoa);
        break;
      case "SAUDE":
        this.PessoaModule.carregaEspecSaude(codigoPessoa);
        break;
      case "RESIDENCIAL":
        this.PessoaModule.carregaEspecResidencial(codigoPessoa);
        break;
      case "PADRAO":
        this.PessoaModule.carregaAtendPadrao(codigoPessoa);
        break;
    }
  }

  findPessoa() {
    //this.ModulePessoa.findPessoa();
  }

  closeCanvasLeftMenu() {
    document.querySelector(".offcanvas").classList.remove("show");
    document.querySelector("body").classList.remove("offcanvas-active");
  }

  confirmDelete(element) {
    $.confirm({
      title: '&nbsp;Remover!',
      content: 'Você realmente quer remover este item do sistema?',
      icon: 'fas fa-trash-alt',
      theme: 'supervan',
      closeIcon: true,
      animation: 'scale',
      type: 'orange',
      buttons: {
        Cancelar: {
          btnClass: 'btn-default',
          action: function () { }
        },
        Ok: {
          btnClass: 'btn-blue',
          action: function () {
            if (element.func && element.id) {
              element.func(element.id);
            }
          }
        }
      }
    });
  }

  removerManifestacaoFicha(id) {
    console.log(`Removendo Manifestação: ${id}`);
  }

  async getModal(modal) {

    if (!modal.size && !modal.app) {
      return false;
    }

    let modalTitle = document.querySelector(`#${modal.size} .modal-title`);
    let modalBody = document.querySelector(`#${modal.size} .modal-body`);
    let include = await this.getInclude(`${modal.app}`);

    modalBody.innerHTML = include;

    if (modal.title) {
      modalTitle.innerHTML = modal.title;
    }

    if (modal.file) {
      modal.file.forEach(item => {
        FilePond.create(document.querySelector(`#${item}`));
      });
    }

    $(`#${modal.size}`).on('shown.bs.modal', function (event) {
      
      if(modal.callBack){
        modal.callBack();
      }

      $('[data-toggle="tooltip"]').tooltip();
      console.log(`Carregando dados para Modal:${modal.app}`);
    });

    $(`#${modal.size}`).on('hidden.bs.modal', function (event) {
      while (modalBody.firstChild) {
        console.log(`Destruindo Modal:${modal.app}`);
        modalBody.removeChild(modalBody.firstChild);
      }
    });

    $(`#${modal.size}`).modal('show');
  }

  minimizarTabsInferiores(_icon, _tabInferior, _isMin) {

    let tabInferior = document.querySelector(_tabInferior);
    let icon = document.querySelector(_icon);
    let displayTab = 'none';
    let title = 'Rest. Tamanho';
    let removeClass = 'fa-window-minimize';
    let addClass = 'fa-window-restore';

    if (!_isMin) {
      displayTab = 'block';
      title = 'Minimizar';
      removeClass = 'fa-window-restore';
      addClass = 'fa-window-minimize';
    }

    tabInferior.style.display = displayTab;
    $(icon).tooltip('hide').attr('data-original-title', title);
    document.querySelector(`${_icon} i`).classList.remove(removeClass);
    document.querySelector(`${_icon} i`).classList.add(addClass);
  }

  getBrowserid() {
    return navigator.userAgent;
  }

  maximizarTabsSuperiores(_tabSuperior, _isMax) {

    let wrp = "wrapper";
    let wrp2 = "wrapper2";
    if (new BrowserDetect().getBrowser() == "Microsoft Edge") {
      wrp = "wrapper-edge";
      wrp2 = "wrapper2-edge";
    }

    let tabSuperior = document.querySelector(_tabSuperior);
    let removeClass = wrp;
    let addClass = wrp2;

    if (!_isMax) {
      removeClass = wrp2;
      addClass = wrp;
    }

    tabSuperior.classList.remove(removeClass);
    tabSuperior.classList.add(addClass);
  }

  navbarScrollLeft(navBar) {
    document.querySelector(navBar).setAttribute('data-position', -1);
    this.navbarScrollRight(navBar);
  }

  navbarScrollRight(navBar) {

    let position = new Number(document.querySelector(navBar).getAttribute('data-position'));
    position++;
    let filler = document.querySelector(navBar);
    filler.style.left = -(position * 100) + "px";
    document.querySelector(navBar).setAttribute('data-position', position);
  }

  async getInclude(url) {
    const response = await fetch(url, {
      method: 'GET'
    });
    return await response.text();
  }

  setHistorico(tab) {
    let id = tab.replace('-tab', '');
    document.querySelector('#historico-tab').innerText = `Histórico (${this.capitalize(id)})`;
    $(`#myTab2 a[href="#${id}"]`).tab('show')
  }

  capitalize([first, ...rest], locale = navigator.language) {
    return [first.toLocaleUpperCase(locale), ...rest].join('');
  }

  isEmpty(obj) {
    for (let prop in obj) {
      if (obj[prop]) {
        return false;
      }
    }
    return true;
  }

  encrypt(word) {

    if (!word) return '';

    let key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
  }


  decrypt(word) {

    let key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
    let decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  appModule = new App();
});