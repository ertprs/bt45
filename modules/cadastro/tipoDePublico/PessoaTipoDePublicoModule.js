export class PessoaTipoDePublicoModule {

  constructor(App) {
    
    this.App = App;
    this.dualListTipoDePublico = null;

    this.events();
  }
  
  events() {

    document.querySelector('#frmPessoaTipoDePublicoEquipe').addEventListener('change', (event) => {
      this.carregarTipoDePublicoPorEquipe();
    }, false);
  }

  async carregarTipoDePublicoPorEquipe() {
    let codEquipe = document.querySelector('#frmPessoaTipoDePublicoEquipe').value;
    let data = await appModule.HttpFetchHelper.getData(`/data/tipoDePublico/cadastro/${!codEquipe?0:codEquipe}.json`);
    let options = {
      "dataArray": data.content,
      "tabNameText": "Tipo de publico",
      "rightTabNameText": "Equipe: Administradores",
      "itemName": "descricao",
      "valueName": "id"
    };
    $("#transfer2").transfer(options);
  }
}