import * as FilePond from '../assets/filepond/dist/filepond.esm.js';
import FilePondPluginFileValidateSize from '../assets/filepond/dist/plugins/filepond-plugin-file-validate-size/filepond-plugin-file-validate-size.esm.js';
import FilePondPluginImagePreview from '../assets/filepond/dist/plugins/filepond-plugin-image-preview/filepond-plugin-image-preview.esm.js';
import { BrowserDetect } from '../assets/browser-detect/BrowserDetect.js';
import f from './helper/StringToDOMHelper.js';

import { HttpFetchHelper } from './helper/HttpFetchHelper.js'
import { ToWayDataBinder } from './helper/ToWayDataBinder.js'

import { PessoaEntity } from './pessoa/PessoaEntity.js';
import { PessoaEnderecoEntity } from './pessoa/endereco/PessoaEnderecoEntity.js';

import { FuncionarioEntity } from './cadastro/funcionario/FuncionarioEntity.js';
import { PessoaTipoDePublicoModule } from './cadastro/tipoDePublico/PessoaTipoDePublicoModule.js';

class App {

  constructor() {

    this.HttpFetchHelper = new HttpFetchHelper();
    this.FuncionarioEntity = new FuncionarioEntity({"id": 0, "codigoEquipe": 1});
    this.PessoaEnderecoEntity = new PessoaEnderecoEntity({}); 
    this.PessoaTipoDePublicoModule = null;
    this.PessoaIdentificacaoModule = null;
    
    this.frmIdentidicacao = {
      nomeRazaoSocial: "",
      email: "",
      cpfCnpj: "",
      codigoCorporativo: "",
      protocolo: "",
      manifestacao: ""
    }
    this.data = null;
    this.headers = {
      "Content-Type": "application/json"
    }
        
    this.init();
    this.events();
  }

  async init() {

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

    await this.carregarCombo({
      obj: "#frmPessoaTipoDePublico",
      url: `/data/tipoDePublico/combo/${this.FuncionarioEntity.funcionario.codigoEquipe}.json`
    });

    await this.carregarCombo({
      obj: "#frmPessoaEstado",
      url: '/data/estado/0.json',
      value: 'sigla',
      text: 'nome'
    });

    await this.carregarCombo({
      obj: "#frmPessoaTratamento",
      url: '/data/tratamento/0.json'
    });

    await this.carregarCombo({
      obj: "#frmPessoaEstadoCivil",
      url: '/data/estadoCivil/0.json'
    });
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

    document.querySelector('#btnGravarPessoa').addEventListener('click', (event) => {
      this.gravarPessoa(event);
    }, false);

  }

  eventsEnderecos(){

    document.querySelector('#btnCepLogradouro').addEventListener('click', (event) => {
      this.getCep();
    });

    document.querySelector('#frmPessoaEnderecoBtnNovo').addEventListener('click', (event) => {
        this.cleantblEndereco();
    });

    document.querySelector('#frmPessoaEnderecoBtnAplicar').addEventListener('click', (event) => {
        this.setEnderecoToPessoa();
    });
    
    document.querySelectorAll(`#tblEndereco tbody i.fas.fa-edit`).forEach(item => {
        item.addEventListener('click', (event) => {
          this.edittblEndereco(event.target.closest('tr').getAttribute('data-key'));
        });
    });
    
    document.querySelectorAll(`#tblEndereco tbody i.fas.fa-trash-alt`).forEach(item => {
        item.addEventListener('click', (event) => {
          this.deletetblEndereco(event.target.closest('tr').getAttribute('data-key'));
        });
    });
   
  }

  setPessoaIdentificacaoModule(){

    new ToWayDataBinder('frmIdentificacao', appModule.frmIdentidicacao);
    
    document.querySelector('#btnPesquisaPessoa').addEventListener('click', (event) => {
      appModule.getListPessoa();
    }, false);
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
        this.carregaEspecAuto(codigoPessoa);
        break;
      case "SAUDE":
        this.carregaEspecSaude(codigoPessoa);
        break;
      case "RESIDENCIAL":
        this.carregaEspecResidencial(codigoPessoa);
        break;
      case "PADRAO":
        this.carregaAtendPadrao(codigoPessoa);
        break;
    }
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

  carregaEspecAuto(codigoPessoa){

    this.mockCarregarPessoa(codigoPessoa);
  }

  async carregaEspecSaude(codigoPessoa){ 

    //--> REEMBOLSO, CARREGA TELA
    let especSolReenb = await new HttpFetchHelper().getTemplate('/modules/pessoa/solicitacaoDeReembolso/pessoaSolicitacaoDeReembolso.html');
    document.querySelector('#wrapperPessoa').appendChild( f`${especSolReenb}` );

    let linkSolReenb = `<div class="nav-item nav-scroll-item">
      <a class="nav-link" href="#lnkEspecSolicitacoesReembolso">Solicitação de Reembolso</a>
    </div>`;
    document.querySelector('#pessoalNavbarScroll').appendChild( f`${linkSolReenb}` );

    //--> REEMBOLSO, CARREGA EVENTOS DA TELA
    if(document.querySelector('#btnEspecSolicitacaoDeReembolso')){
      document.querySelector('#btnEspecSolicitacaoDeReembolso').addEventListener('click', (event) => {

        if (document.querySelector('#btnEspecSolicitacaoDeReembolso i').classList.contains('fa-window-restore')) {
          this.minimizarTabsInferiores('#btnEspecSolicitacaoDeReembolso', '#frmEspecSolicitacaoDeReembolso', false);
        } else {
          this.minimizarTabsInferiores('#btnEspecSolicitacaoDeReembolso', '#frmEspecSolicitacaoDeReembolso', true);
        }
      }, false);
    }

    this.mockCarregarPessoa(codigoPessoa);
  }

  carregaEspecResidencial(codigoPessoa){ 

    this.mockCarregarPessoa(codigoPessoa);
  }

  carregaAtendPadrao(codigoPessoa){ 
    
    this.mockCarregarPessoa(codigoPessoa);
  }

  mockCarregarPessoa(codigoPessoa){

    this.data.content.forEach(element => {
      if(element.codigoCorporativo==codigoPessoa){
        this.PessoaEntity = new PessoaEntity(element);
      }
    });

    new ToWayDataBinder('frmPessoa', this.PessoaEntity);
    new ToWayDataBinder('tblEndereco', this.PessoaEntity, this);
    this.eventsEnderecos();
  }

  gravarPessoa(event){  

    if(!this.isPessoaValida()) return false;
  }

  isPessoaValida(){
    return true;
  }

  async findPessoa() {

    let identificacao = {
      nomeRazaoSocial: document.querySelector('#frmIdentificacaoNomeRazaoSocial').value,
      email: document.querySelector('#frmIdentificacaoEmail').value,
      cpfCnpj: this.encrypt(document.querySelector('#frmIdentificacaoCpfCnpj').value),
      codigoCorporativo: document.querySelector('#frmIdentificacaoCodigoCorporativo').value,
      protocolo: document.querySelector('#frmIdentificacaoProtocolo').value,
      manifestacao: document.querySelector('#frmIdentificacaoManifestacao').value
    };

    let isEmpty = this.isEmpty(identificacao);

    if (isEmpty) {
      $.toast({
        heading: '<strong>Atenção</strong>',
        text: 'Pelo menos um parametro deve ser preenchido para identeificação!',
        position: 'top-right',
        bgColor: '#ffc107',
        hideAfter: 5000,
        textColor: '#343a40'
      });
      return false;
    }

    //SE ENCONTRAR POR NOME E OU EMAIL
    //EXECURAR:
    // - findPessoaPorNomeEouEmail()
    // - CARREGAR LISTA IDENTIFICADOS

    //SE ENCONTRAR POR CÓDIGO MANIFESTAÇÃO,
    //EXECUTAR: 
    // - CARREGAR PESSOA;
    // - CARREGAR MANIFESTAÇÃO;
    // - DESTROI MODAL IDENTIFICAÇÃO.
    return await this.HttpFetchHelper.postData('/pessoa/search', data);

    //$('#Xl').modal('hide');
  }

  isEmpty(obj) {
    for (let prop in obj) {
      if (obj[prop]) {
        return false;
      }
    }
    return true;
  }

  setEnderecoToPessoa() {

    let pos = this.getPositionInArray(this.PessoaEnderecoEntity.endereco.cep);
    if(pos != null){
        Object.assign(this.PessoaEntity.pessoa.enderecos[pos], this.PessoaEnderecoEntity.endereco);
    }else{
        this.PessoaEntity.pessoa.enderecos.push(this.PessoaEnderecoEntity.endereco);
    }
   
    //--> IMPLEMENTAR Proxy em ToWayDataBinder
    //--> Para não precisar sobrescrever todo comportamento a cada Insert, Updade ou Delete.
    new ToWayDataBinder('tblEndereco', this.PessoaEntity, this);
    this.cleantblEndereco();
    this.eventsEnderecos();
  }

  edittblEndereco(cep){
      let pos = this.getPositionInArray(cep);
      if(pos != null){
          Object.assign(this.PessoaEnderecoEntity.endereco, this.PessoaEntity.pessoa.enderecos[pos]);
          new ToWayDataBinder('frmPessoaEndereco', this.PessoaEnderecoEntity.endereco);
      }
  }

  deletetblEndereco(cep){
      let pos = this.getPositionInArray(cep);
      this.PessoaEntity.pessoa.enderecos.splice(pos);
      //--> IMPLEMENTAR Proxy em ToWayDataBinder
      //--> Para não precisar sobrescrever todo comportamento a cada Insert, Updade ou Delete.
      new ToWayDataBinder('tblEndereco', this.PessoaEntity, this);
  }

  cleantblEndereco(){
      document.querySelector('#frmPessoaEndereco').reset();
  }

  getPositionInArray(cep){
      let pos = null;
      this.PessoaEntity.pessoa.enderecos.forEach((endereco, index) => {
          if(endereco.cep === cep){
              pos = index;
          }
      });
      return pos;
  }

  async getCep() {

      let cep = document.querySelector('#frmPessoaCepLogradouro').value.replace(/\D/g, '');
      let validacep = /^[0-9]{8}$/;

      if (!validacep.test(cep)){
          $.toast({
              heading: '<strong>Atenção</strong>',
              text: 'Cep inválido!',
              position: 'top-right',
              bgColor: '#ffc107',
              hideAfter: 5000,
              textColor: '#343a40'
            });
          return false;
      }

      let retorno = await this.HttpFetchHelper.getData(`https://viacep.com.br/ws/${cep}/json/`);            
      this.PessoaEnderecoEntity = new PessoaEnderecoEntity(retorno);
      new ToWayDataBinder('frmPessoaEndereco', this.PessoaEnderecoEntity.endereco);
  }

  async getListPessoa(){

    if (this.isEmpty(this.frmIdentidicacao)){
        $.toast({
            heading: '<strong>Atenção</strong>',
            text: 'Pelo menos um campo do formulário deve ser preenchido!',
            position: 'top-right',
            bgColor: '#ffc107',
            hideAfter: 5000,
            textColor: '#343a40'
          });
        return false;
    }

    
    if(this.frmIdentidicacao.nomeRazaoSocial){
        this.frmIdentidicacao.nomeRazaoSocial =  this.encrypt(this.frmIdentidicacao.nomeRazaoSocial);
    }
    
    if(this.frmIdentidicacao.cpfCnpj){
        this.frmIdentidicacao.cpfCnpj =  this.encrypt(this.frmIdentidicacao.cpfCnpj);
    }
    
    this.data = await this.HttpFetchHelper.postData('/pessoa/search', this.frmIdentidicacao);
    new ToWayDataBinder('tblIdentificacao', this.data, this);
    
    console.log( this.data );
    
    //$('#Xl').modal('hide');
    //return data;
  }

  callbackIconsIdentificacao(data){

      let icons = '';
      if(data.spec.includes('AUTO')){
          icons += `<a href="#" class="ml-3 mr-3" onclick="appModule.getPessoa(${data.codigoCorporativo}, 'AUTO')" data-toggle="tooltip" data-placement="bottom" data-dismiss="modal" title="Seguro Auto">
                      <i class="fas fa-car-crash"></i>
                  </a>`
      }
      if(data.spec.includes('SAUDE')){
          icons += `<a href="#" class="ml-3 mr-3" onclick="appModule.getPessoa(${data.codigoCorporativo}, 'SAUDE')" data-toggle="tooltip" data-placement="bottom" data-dismiss="modal" title="Seguro Saúde">
                      <i class="fas fa-heartbeat"></i>
                  </a>`
      }
      if(data.spec.includes('RESIDENCIAL')){
          icons += `<a href="#" class="ml-3 mr-3" onclick="appModule.getPessoa(${data.codigoCorporativo}, 'RESIDENCIAL')" data-toggle="tooltip" data-placement="bottom" data-dismiss="modal" title="Seguro Residerncial">
                      <i class="fas fa-house-damage"></i>
                  </a>`
      }
      icons += `<a href="#" class="ml-3 mr-3" onclick="appModule.getPessoa(${data.codigoCorporativo}, 'PADRAO')" data-toggle="tooltip" data-placement="bottom" data-dismiss="modal" title="Atendimento Padrão">
          <i class="fas fa-bullhorn"></i>
      </a>`
      return f`${icons}`;
  }

}

document.addEventListener("DOMContentLoaded", () => {
  appModule = new App();
});