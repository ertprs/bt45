export class BindHelper {

   constructor(frm, data) {
      this.frm = frm;      
      this.data = data;
      this.inputTypes = ["text", "email", "number", "textearea", "date", "password", "select-one"];
      this.checkTypes = ["checkbox", "radio"];
      this.init();
    }

   init() {
      if(!this.frm || !this.data) return false;
      let node = document.querySelectorAll(`#${this.frm}`);
      if(node instanceof HTMLFormElement) node[0].reset();
      
      this.listDOM(node[0]);
   }

   setDataBind(node) {

      if(node.id=="frmPessoaLogradouro"){
         console.log(node);
      }

      if(node.hasAttribute && node.getAttribute('data-bind')){         
         
         let dataBind = node.getAttribute('data-bind');
         let arr = dataBind.split(".");

         if(arr.length==1){ 
            //dataBind = this.data[arr[0]]; 
            if(this.checkTypes.includes(node.type) && this.data[arr[0]] && this.data[arr[0]].includes(node.value) ){
               node.checked = true;
            }

            if(!Array.isArray(this.data)){
               if(this.inputTypes.includes(node.type)){
                  for(let i=0; i<this.data.length; i++){
                     node.value = this.data[0][arr[0]];            
                  }
               }
            }else{
               if(this.inputTypes.includes(node.type)){
                  node.value = this.data[arr[0]];            
               }            
            }

            if(node.tagName == 'SPAN'){
               node.innerHTML = this.data[arr[0]];
            }
         }
         if(arr.length==2){ 
            //dataBind = this.data[arr[0]][arr[1]];
            if(this.checkTypes.includes(node.type) && this.data[arr[0]][arr[1]] && this.data[arr[0]][arr[1]].includes(node.value) ){
               node.checked = true;
            }
            if(Array.isArray(this.data[arr[0]])){
               if(this.inputTypes.includes(node.type)){
                  for(let i=0; i<this.data[arr[0]].length; i++){
                     node.value = this.data[arr[0]][0][arr[1]];            
                  }
               }
            }else{
               if(this.inputTypes.includes(node.type)){
                  node.value = this.data[arr[0]][arr[1]];            
               }            
            }

            if(node.tagName == 'SPAN'){
               node.innerHTML = this.data[arr[0]][arr[1]];
            } 
         }

         if(node.type=="select-one"){
            node.dispatchEvent(new Event('change'));
         }
         
         node.removeEventListener('change', (event) => { this.changeData(node) }, false);
         node.addEventListener('change', (event) => { this.changeData(node) }, false);
      }
   }

   changeData(node) {
      
      let dataBind = node.getAttribute('data-bind');
      let arr = dataBind.split(".");

      if(arr.length==1){ 
         if(!Array.isArray(this.data[arr[0]])){
         
            if(this.checkTypes.includes(node.type) && node.checked==false ){
               this.data[arr[0]] = "";
            }else{
               this.data[arr[0]] = node.value;
            }         
         }else{
            if(node.checked==true && !this.data[arr[0]].includes(node.value)){
               this.data[arr[0]].push(node.value);
            }
            if(node.checked==false && this.data[arr[0]].includes(node.value)){
               this.data[arr[0]] = this.data[arr[0]].filter(e => e !== node.value);
            }
         }
      }

      if(arr.length==2){ 
         if(!Array.isArray(this.data[arr[0]][arr[1]])){
         
            if(this.checkTypes.includes(node.type) && node.checked==false ){
               this.data[arr[0]][arr[1]] = "";
            }else{
               this.data[arr[0]][arr[1]] = node.value;
            }         
         }else{
            if(node.checked==true && !this.data[arr[0]][arr[1]].includes(node.value)){
               this.data[arr[0]][arr[1]].push(node.value);
            }
            if(node.checked==false && this.data[arr[0]][arr[1]].includes(node.value)){
               this.data[arr[0]][arr[1]] = this.data[arr[0]][arr[1]].filter(e => e !== node.value);
            }
         }
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
}