import moment from '../../assets/moment/dist/moment.js';

export class ToWayDataBinder {

   constructor(frm, data, module, debug) {
      this.frm = frm;      
      this.data = data;
      this.module = module;
      this.inputTypes = ["text", "email", "number", "textearea", "date", "password", "select-one"];
      this.checkTypes = ["checkbox", "radio"];
      this.debugger = debug || false;
      this.init();
    }

   init() {
      if(!this.frm || !this.data) return false;
      let node = document.querySelector(`#${this.frm}`);
      if(node instanceof HTMLFormElement) node.reset();
      
      this.listDOM(node);
   }

   //SET TAG DATA_BIND
   setDataBind(node){

      if(node && node.hasAttribute && node.getAttribute('data-bind')){
         this.setValueObjToFrmElement(node);
      }

      if(node && node.hasAttribute && node.getAttribute('table-bind')){
         this.setTableBind(node);
      }
   }
  
   setValueObjToFrmElement(node) {            
         
      let tag =  this.getData(node, node.getAttribute('data-bind'));

      if(this.checkTypes.includes(node.type) && tag && tag.includes(node.value)){
         node.checked = true;
      }

      if(Array.isArray(this.data) && tag && this.inputTypes.includes(node.type)){
         for(let i=0; i<this.data.length; i++){
            node.value = tag;            
         }
      }

      if(!Array.isArray(this.data) && tag && this.inputTypes.includes(node.type)){
         if(node.type=='date'){
            let dta = moment(tag, "DD-MM-YYYY");
            node.value = dta.format(dta.format('YYYY-MM-DD'));            
         }else{
            node.value = tag;
         }
      }
      
      node.removeEventListener('change', (event) => { this.setFrmElementValueToObj(node) }, false);
      node.addEventListener('change', (event) => { this.setFrmElementValueToObj(node) }, false);
   }

   setFrmElementValueToObj(node){

      let bind = 'data-bind';
      let tag =  this.getData(node, node.getAttribute(bind));

      if(!Array.isArray(tag)){
         if(this.checkTypes.includes(node.type) && node.checked==false){
            this.setData(node, bind, "");
         }else{
            this.setData(node, bind, node.value);
         }
      }else{
         if(node.checked==true && !tag.includes(node.value)){
            this.pushData(node, bind, node.value);
         }
         if(node.checked==false && tag.includes(node.value)){
            this.removeData(node, bind, node.value);
            tag = tag.filter(e => e !== node.value);
         }
      }
      //console.log(this.data);
   }

   setTableBind(node) {
      
      let bind = 'table-bind';
      let data = this.getData(node, node.getAttribute(bind));
      
      if(!data) return false;
      
      let tbl = node.getAttribute('id');
      let tbody = document.querySelector(`#${tbl} tbody`);
      let datakey = document.querySelector(`#${tbl} thead tr`).getAttribute('data-key');
      let ths = document.querySelectorAll(`#${tbl} th`);
      let icons = '';


      tbody.querySelectorAll('*').forEach(n => n.remove());      
      data.forEach(item => {
         let nodeTr = document.createElement('tr');
             nodeTr.setAttribute('data-key', item[datakey]);
         
         ths.forEach(th => {        
            
            let nodeTd = document.createElement('td');
            
            if(item[th.getAttribute('td-bind')]){
               nodeTd.appendChild( document.createTextNode(item[th.getAttribute('td-bind')]) );
               nodeTd.setAttribute('class', 'text-left');
            }
            
            if(th.hasAttribute('ico-bind')){
               
               let arr = th.getAttribute('ico-bind').split('.');
               icons = th.getAttribute('ico-bind');
               arr.forEach(item => {
                  let i = document.createElement('i');
                     switch(item){
                        case 'EDIT':
                           i.setAttribute('class', 'fas fa-edit');
                           break;
                        case 'TRASH':
                           i.setAttribute('class', 'fas fa-trash-alt');
                           break;
                     }
                  let a = document.createElement('a');
                     a.setAttribute('class', 'ml-2 mr-2');
                     a.setAttribute('href', '#');
                     a.appendChild(i);

                  nodeTd.appendChild(a);
                  nodeTd.setAttribute('class', 'text-right');
               });
            } 

            if(th.hasAttribute('ico-callback-bind')){
               let bind = th.getAttribute('ico-callback-bind');
               let spec = {spec: 'AUTO,SAUDE,RESIDENCIAL'};//MOCK::> ISSO DEVE VIR DO DB, CADA PESSOA DEVE SABE QUAIS SÃO SEUS ESPECS
               let ico = this.setIconCallBack( bind, Object.assign(item, spec) );
               if(ico){
                  nodeTd.appendChild( ico );
               }
            }

            nodeTr.appendChild(nodeTd);
         });

         tbody.appendChild(nodeTr);
      });

      /*
      if(this.module && icons.includes('EDIT')){
         document.querySelectorAll(`#${tbl} tbody i.fas.fa-edit`).forEach(item => {
            item.addEventListener('click', (event) => {
               eval( "this.module.edit"+tbl+"(event.target.closest('tr').getAttribute('data-key'))" );
            });
         });
      }
      if(this.module && icons.includes('TRASH')){
         document.querySelectorAll(`#${tbl} tbody i.fas.fa-trash-alt`).forEach(item => {
            item.addEventListener('click', (event) => {
               eval( "this.module.delete"+tbl+"(event.target.closest('tr').getAttribute('data-key'))" );
            });
         });
      }
      */
   }

   setIconCallBack(callBack, item){

      return eval('this.module.'+callBack+'(item)');
   }

   setIcons(icons){

      let arr = node.getAttribute('ico-bind').split('.');
      arr.forEach(item => {
         let i = document.createElement('i');
            switch(item){
               case 'EDIT':
                  i.setAttribute('class', 'fas fa-edit');
                  break;
               case 'TRASH':
                  i.setAttribute('class', 'fas fa-trash-alt');
                  break;
            }
         let a = document.createElement('a');
             a.setAttribute('class', 'ml-2 mr-2');
      });
   }

   getData(node, bind){

      if(!node) return false;

      let arr = bind.split('.');
      switch(arr.length){
         case 1: 
            try{
               if(this.data[arr[0]]) return this.data[arr[0]];
            }catch(ex){
               this.setLog(bind, ex);
               return null;
            }
         case 2: 
            try{
               if(this.data[arr[0]][arr[1]]) return this.data[arr[0]][arr[1]];
            }catch(ex){
               this.setLog(bind, ex);
               return null;
            }
         case 3: 
            try{
               if(this.data[arr[0]][arr[1]][arr[2]]) return this.data[arr[0]][arr[1]][arr[2]];
            }catch(ex){
               this.setLog(bind, ex);
               return null;
            }
         case 4: 
            try{
               if(this.data[arr[0]][arr[1]][arr[2]][arr[3]]) return this.data[arr[0]][arr[1]][arr[2]][arr[3]];
            }catch(ex){
               this.setLog(bind, ex);
               return null;
            }
         case 5: 
            try{
               if(this.data[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]]) return this.data[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]];
            }catch(ex){
               this.setLog(bind, ex);
               return null;
            }
      }
   }

   setData(node, bind, newValue){

      let arr = node.getAttribute(bind).split('.');
      switch(arr.length){
         case 1: this.data[arr[0]] = newValue; break;
         case 2: this.data[arr[0]][arr[1]] = newValue; break;
         case 3: this.data[arr[0]][arr[1]][arr[2]] = newValue; break;
         case 4: this.data[arr[0]][arr[1]][arr[2]][arr[3]] = newValue; break;
         case 5: this.data[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]] = newValue; break;
      }
   }

   pushData(node, bind, newValue){

      let arr = node.getAttribute(bind).split('.');
      switch(arr.length){
         case 1: this.data[arr[0]].push(node.value); break;
         case 2: this.data[arr[0]][arr[1]].push(node.value); break;
         case 3: this.data[arr[0]][arr[1]][arr[2]].push(node.value); break;
         case 4: this.data[arr[0]][arr[1]][arr[2]][arr[3]].push(node.value); break;
         case 5: this.data[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]].push(node.value); break;
      }
   }

   removeData(node, bind, newValue){

      let arr = node.getAttribute(bind).split('.');
      switch(arr.length){
         case 1: this.setData(node, bind, this.data[arr[0]].filter(e => e !== node.value)); break;
         case 2: this.setData(node, bind, this.data[arr[0]][arr[1]].filter(e => e !== node.value)); break;
         case 3: this.setData(node, bind, this.data[arr[0]][arr[1]][arr[2]].filter(e => e !== node.value)); break;
         case 4: this.setData(node, bind, this.data[arr[0]][arr[1]][arr[2]][arr[3]].filter(e => e !== node.value)); break;
         case 5: this.setData(node, bind, this.data[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]].filter(e => e !== node.value)); break;
      }
   }

   listDOM(node) {
      this.setDataBind(node);
      node = node.firstChild;
      while (node) {
         this.listDOM(node);
         node = node.nextSibling;
      } 
   }

   setLog(prop, ex){
      if(this.debugger)
      console.log(`Erro ao ler propriedade: data-bind='${prop}', ${ex.message}`);
   }
}