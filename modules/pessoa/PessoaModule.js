import { PessoaEntity } from './PessoaEntity.js';
import { ToWayDataBinder } from '../helper/ToWayDataBinder.js'
import { PessoaEnderecoModule } from './endereco/PessoaEnderecoModule.js';
import { HttpFetchHelper } from '../helper/HttpFetchHelper.js';
import f from '../helper/StringToDOMHelper.js';

export class PessoaModule {

  constructor(App) {

    this.App = App;
    this.PessoaEntity = new PessoaEntity({});
    
    this.init();
    this.events();
  }

  async init() {

    await this.App.carregarCombo({
      obj: "#frmPessoaTipoDePlublico",
      url: `/data/tipoDePublico/combo/${this.App.FuncionarioEntity.funcionario.codigoEquipe}.json`
    });

    await this.App.carregarCombo({
      obj: "#frmPessoaEstado",
      url: '/data/estado/0.json',
      value: 'sigla',
      text: 'nome'
    });

    await this.App.carregarCombo({
      obj: "#frmPessoaTratamento",
      url: '/data/tratamento/0.json'
    });

    await this.App.carregarCombo({
      obj: "#frmPessoaEstadoCivil",
      url: '/data/estadoCivil/0.json'
    }); 
  }

  events() {

    document.querySelector('#btnGravarPessoa').addEventListener('click', (event) => {
      this.gravarPessoa(event);
    }, false);
  }

  carregaEspecAuto(codigoPessoa){

    this.mockCarregarPessoa();
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
          this.App.minimizarTabsInferiores('#btnEspecSolicitacaoDeReembolso', '#frmEspecSolicitacaoDeReembolso', false);
        } else {
          this.App.minimizarTabsInferiores('#btnEspecSolicitacaoDeReembolso', '#frmEspecSolicitacaoDeReembolso', true);
        }
      }, false);
    }

    this.mockCarregarPessoa();
  }

  carregaEspecResidencial(codigoPessoa){ 

    this.mockCarregarPessoa();
  }

  carregaAtendPadrao(codigoPessoa){ 
    
    this.mockCarregarPessoa();
  }

  mockCarregarPessoa(){

    this.PessoaEntity = new PessoaEntity({
      "id": 0,
      "codigoCorporativo": "1111111",
      "naoContactar": ["SMS", "EMAIL"],
      "tratamento": "v.",
      "nomeRazaoSocial": "bbbbbbbbbbbbb",
      "pessoaFisicaJuridica": "J",
      "tipoDePublico": 6,
      "genero": "N/A",
      "estadoCivil": "CASADO",
      "telefoneResidencial": "(21) 95555-5555",
      "telefoneComercial": "(11) 98888-8888",
      "telefoneCelular": "(19) 93333-3333",
      "emailPrincipal": "eee@eee.com",
      "emailAlternativo": "fff@fff.com",
      "rgIe": "010101010101010",
      "cpfCnpf": "020202020",
      "passaporte": "0303030303030",
      "dataDeNascimento": "1973-05-19",
      "profissao": "mmmmmmmmmmm",
      "cargo": "nnnnnnnnnnnnn",
      "endereco": [
          {
              "bairro": "Tijuca",
              "cep": "20520-060",
              "complemento": "apto 401",
              "localidade": "Rio de Janeiro",
              "logradouro": "Rua Moura Brito",
              "numero": "189",
              "principal": "N",
              "tipoEndereco": "",
              "uf": "RJ"
          }, {
              "bairro": "Tijuca",
              "cep": "20520-050",
              "complemento": "até 0223 - lado ímpar",
              "localidade": "Rio de Janeiro",
              "logradouro": "Rua Conde de Bonfim",
              "numero": "1",
              "principal": "N",
              "tipoEndereco": "",
              "uf": "RJ"
          }
      ],
      "solicitacaoDereembolso": []
    });
    new ToWayDataBinder('frmPessoa', this.PessoaEntity);
    this.PessoaEnderecoModule = new PessoaEnderecoModule(this);

    

  }

  gravarPessoa(event){  

    if(!this.isPessoaValida()) return false;
    console.log( this.PessoaEntity );
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
    return await this.App.HttpFetchHelper.postData('/pessoa/search', data);

    //$('#Xl').modal('hide');
  }

  findPessoaPorNomeEouEmail() {

  }

  getPessoa(codigoCorporativo) {

  }

  getPessoaPorManifestacao(codigoCorporativo) {

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