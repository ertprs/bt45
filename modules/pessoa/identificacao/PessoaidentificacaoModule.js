import { HttpFetchHelper } from '../../helper/HttpFetchHelper.js'
import { ToWayDataBinder } from '../../helper/ToWayDataBinder.js'

export class PessoaIdentificacaoModule {

    constructor(App){

        this.HttpFetchHelper = new HttpFetchHelper();
        this.app = App;
        this.frmIdentidicacao = {
            nomeRazaoSocial: "",
            email: "",
            cpfCnpj: "",
            codigoCorporativo: "",
            protocolo: "",
            manifestacao: ""
        }
        this.events();
        this.init();
    }

    init(){
        new ToWayDataBinder('frmIdentificacao', this.frmIdentidicacao);
    }

    events(){

        document.querySelector('#btnPesquisaPessoa').addEventListener('click', (event) => {
            this.getListPessoa();
        }, false);
    }

    async getListPessoa(){

        if (this.app.isEmpty(this.frmIdentidicacao)){
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
            this.frmIdentidicacao.nomeRazaoSocial =  this.app.encrypt(this.frmIdentidicacao.nomeRazaoSocial);
        }
        
        if(this.frmIdentidicacao.cpfCnpj){
            this.frmIdentidicacao.cpfCnpj =  this.app.encrypt(this.frmIdentidicacao.cpfCnpj);
        }
        
        let data = await this.app.HttpFetchHelper.postData('/pessoa/search', this.frmIdentidicacao);
        console.log( data );
        
        //$('#Xl').modal('hide');
        return data;
    }
}