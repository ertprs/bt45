import { PessoaEntity } from './PessoaEntity.js';
import { ToWayDataBinder } from '../helper/ToWayDataBinder.js'
import { PessoaEnderecoModule } from './endereco/PessoaEnderecoModule.js';

export class PessoaModule {

  constructor(App) {

    this.App = App;
    this.PessoaEntity = new PessoaEntity({});
    this.PessoaEnderecoModule = new PessoaEnderecoModule(this);

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

    new ToWayDataBinder('frmPessoa', this.PessoaEntity); 
  }

  events() {

    document.querySelector('#btnGravarPessoa').addEventListener('click', (event) => {
      this.gravarPessoa(event);
    }, false);
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