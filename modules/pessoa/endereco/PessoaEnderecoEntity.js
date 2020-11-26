export class PessoaEnderecoEntity {

    constructor(_endereco) {
        this.endereco = {
            tipoEndereco: '',
            principal: 'N',
            numero: '',
            logradouro: '',
            complemento: '',
            bairro: '',
            localidade: '',
            cep: '',
            uf: ''
        };
        this.init(_endereco);
    }

    init(_endereco) {
        if (_endereco) {
            Object.assign(this.endereco, _endereco);
        }
    }
}