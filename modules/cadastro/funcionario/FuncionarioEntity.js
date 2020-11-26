export class FuncionarioEntity {

    constructor(_funcionario) {
        this.funcionario = {
            "id": 0,
            "codigoEquipe": 0
        };
        this.init(_funcionario);
    }

    init(_funcionario) {
        if (_funcionario) {
            Object.assign(this.funcionario, _funcionario);
        }
    }
}