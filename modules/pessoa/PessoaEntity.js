export class PessoaEntity {

    constructor(_pessoa) {
        this.pessoa = {
            "id": "",
            "codigoCorporativo": "",
            "naoContactar": [],
            "tratamento": "",
            "nomeRazaoSocial": "",
            "pessoaFisicaJuridica": "",
            "tipoDePublico": "",
            "genero": "",
            "estadoCivil": "",
            "telefoneResidencial": "",
            "telefoneComercial": "",
            "telefoneCelular": "",
            "emailPrincipal": "",
            "emailAlternativo": "",
            "rgIe": "",
            "cpfCnpj": "",
            "passaporte": "",
            "dataDeNascimento": "",
            "profissao": "",
            "cargo": "",
            "enderecos": [],
            "solicitacaoDereembolso": []
        };
        this.init(_pessoa);
    }

    init(_pessoa) {
        if (_pessoa) {
            Object.assign(this.pessoa, _pessoa);
        }
    }
}