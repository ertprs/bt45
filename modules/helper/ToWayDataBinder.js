export class ToWayDataBinder {

   constructor(frm, data, module) {
      this.frm = frm;      
      this.data = data;
      this.module = module;
      this.inputTypes = ["text", "email", "number", "textearea", "date", "password", "select-one"];
      this.checkTypes = ["checkbox", "radio"];
      this.debugger = true;
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

      if(node.hasAttribute && node.getAttribute('data-bind')){
         this.setValueObjToFrmElement(node);
      }

      if(node.hasAttribute && node.getAttribute('table-bind')){
         this.setTableBind(node);
      }
   }
  
   setValueObjToFrmElement(node) {            
         
      let tag =  this.getData(node, 'data-bind');

      if(this.checkTypes.includes(node.type) && tag && tag.includes(node.value)){
         node.checked = true;
      }

      if(Array.isArray(this.data) && tag && this.inputTypes.includes(node.type)){
         for(let i=0; i<this.data.length; i++){
            node.value = tag;            
         }
      }

      if(!Array.isArray(this.data) && tag && this.inputTypes.includes(node.type)){
         node.value = tag;            
      }
      
      node.removeEventListener('change', (event) => { this.setFrmElementValueToObj(node) }, false);
      node.addEventListener('change', (event) => { this.setFrmElementValueToObj(node) }, false);
   }

   setFrmElementValueToObj(node){
      let bind = 'data-bind';
      let tag =  this.getData(node, bind);

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
      console.log(this.data);
   }

   setTableBind(node) {
      
      let bind = 'table-bind';
      let data = this.getData(node, bind);
      let tbody = document.querySelector(`#${node.getAttribute('id')} tbody`);
      let datakey = document.querySelector(`#${node.getAttribute('id')} thead tr`).getAttribute('data-key');
      let ths = document.querySelectorAll(`#${node.getAttribute('id')} th`);
      let icons = '';

      if(!data) return false;

      tbody.querySelectorAll('*').forEach(n => n.remove());      
      data.forEach(item => {
         let nodeTr = document.createElement('tr');
             nodeTr.setAttribute('data-key', item[datakey]);
         
         ths.forEach(th => {        
            
            let nodeTd = document.createElement('td');
            
            if(item[th.getAttribute('td-bind')]){
               nodeTd.appendChild( document.createTextNode(item[th.getAttribute('td-bind')]) );
            }
            
            if(th.getAttribute('ico-bind')){
               
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

            nodeTr.appendChild(nodeTd);
         });

         tbody.appendChild(nodeTr);
      });

      if(this.module && icons.includes('EDIT')){
         document.querySelectorAll(`#${node.getAttribute('id')} tbody i.fas.fa-edit`).forEach(item => {
            item.addEventListener('click', (event) => {
               this.module.edit(event.target.closest('tr').getAttribute('data-key'));
            });
         });
      }
      if(this.module && icons.includes('TRASH')){
         document.querySelectorAll(`#${node.getAttribute('id')} tbody i.fas.fa-trash-alt`).forEach(item => {
            item.addEventListener('click', (event) => {
               this.module.delete(event.target.closest('tr').getAttribute('data-key'));
            });
         });
      }
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

      let arr = node.getAttribute(bind).split('.');
      switch(arr.length){
         case 1: 
            try{
               if(this.data[arr[0]]) return this.data[arr[0]];
            }catch(ex){
               this.setLog(node.getAttribute(bind), ex);
               return null;
            }
         case 2: 
            try{
               if(this.data[arr[0]][arr[1]]) return this.data[arr[0]][arr[1]];
            }catch(ex){
               this.setLog(node.getAttribute(bind), ex);
               return null;
            }
         case 3: 
            try{
               if(this.data[arr[0]][arr[1]][arr[2]]) return this.data[arr[0]][arr[1]][arr[2]];
            }catch(ex){
               this.setLog(node.getAttribute(bind), ex);
               return null;
            }
         case 4: 
            try{
               if(this.data[arr[0]][arr[1]][arr[2]][arr[3]]) return this.data[arr[0]][arr[1]][arr[2]][arr[3]];
            }catch(ex){
               this.setLog(node.getAttribute(bind), ex);
               return null;
            }
         case 5: 
            try{
               if(this.data[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]]) return this.data[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]];
            }catch(ex){
               this.setLog(node.getAttribute(bind), ex);
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