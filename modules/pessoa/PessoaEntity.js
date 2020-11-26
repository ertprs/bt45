export class PessoaEntity {

    constructor(_pessoa) {
        this.pessoa = {
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
        };
        this.init(_pessoa);
    }

    init(_pessoa) {
        if (_pessoa) {
            Object.assign(this.pessoa, _pessoa);
        }
    }
}