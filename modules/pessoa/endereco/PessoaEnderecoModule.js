import { ToWayDataBinder } from '../../helper/ToWayDataBinder.js'
import { PessoaEnderecoEntity } from './PessoaEnderecoEntity.js'
import { HttpFetchHelper } from '../../helper/HttpFetchHelper.js';

export class PessoaEnderecoModule {

    constructor(App) {

        this.App = App;
        this.headers = {
            "Content-Type": "application/json"
        }
        this.HttpFetchHelper = new HttpFetchHelper();
        this.PessoaEnderecoEntity = new PessoaEnderecoEntity({});
        this.init();
        this.events();
    }

    init(){
        new ToWayDataBinder('tblEndereco', this.App.PessoaEntity, this);
    }

    events() {

        document.querySelector('#btnCepLogradouro').addEventListener('click', (event) => {
            this.getCep();
        });

        document.querySelector('#frmPessoaEnderecoBtnNovo').addEventListener('click', (event) => {
            this.clean();
        });

        document.querySelector('#frmPessoaEnderecoBtnAplicar').addEventListener('click', (event) => {
            this.setEnderecoToPessoa();
        });
    }

    setEnderecoToPessoa() {

        let pos = this.getPositionInArray(this.PessoaEnderecoEntity.endereco.cep);
        if(pos != null){
            Object.assign(this.App.PessoaEntity.pessoa.endereco[pos], this.PessoaEnderecoEntity.endereco);
        }else{
            this.App.PessoaEntity.pessoa.endereco.push(this.PessoaEnderecoEntity.endereco);
        }
       
        //--> IMPLEMENTAR Proxy em ToWayDataBinder
        //--> Para não precisar sobrescrever todo comportamento a cada Insert, Updade ou Delete.
        new ToWayDataBinder('tblEndereco', this.App.PessoaEntity, this);
        this.clean();
    }

    edit(cep){
        let pos = this.getPositionInArray(cep);
        if(pos != null){
            Object.assign(this.PessoaEnderecoEntity.endereco, this.App.PessoaEntity.pessoa.endereco[pos]);
            new ToWayDataBinder('frmPessoaEndereco', this.PessoaEnderecoEntity.endereco);
        }
    }

    delete(cep){
        let pos = this.getPositionInArray(cep);
        this.App.PessoaEntity.pessoa.endereco .splice(pos);
        //--> IMPLEMENTAR Proxy em ToWayDataBinder
        //--> Para não precisar sobrescrever todo comportamento a cada Insert, Updade ou Delete.
        new ToWayDataBinder('tblEndereco', this.App.PessoaEntity, this);
    }

    clean(){
        document.querySelector('#frmPessoaEndereco').reset();
    }

    getPositionInArray(cep){
        let pos = null;
        this.App.PessoaEntity.pessoa.endereco.forEach((endereco, index) => {
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
}