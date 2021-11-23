import React, { Component } from 'react';
import serverUrl from '../../globals';

let dragStartIndex;
let listItems = []

function dragStart() {
   // console.log('Event: ', 'dragstart');
   dragStartIndex = +this.closest('li').getAttribute('data-index');
 }
 
 function dragEnter() {
   // console.log('Event: ', 'dragenter');
   this.classList.add('over');
 }
 
 function dragLeave() {
   // console.log('Event: ', 'dragleave');
   this.classList.remove('over');
 }
 
 function dragOver(e) {
   // console.log('Event: ', 'dragover');
   e.preventDefault();
 }
 
 function dragDrop() {
   // console.log('Event: ', 'drop');
   const dragEndIndex = +this.getAttribute('data-index');
   swapItems(dragStartIndex, dragEndIndex);
 
   this.classList.remove('over');
 }
 
 // Swap list items that are drag and drop
 function swapItems(fromIndex, toIndex) {
    console.log(listItems);
   const itemOne = listItems[fromIndex].querySelector('.draggable');
   const itemTwo = listItems[toIndex].querySelector('.draggable');
 
   listItems[fromIndex].appendChild(itemTwo);
   listItems[toIndex].appendChild(itemOne);
 }
 
 
 function addEventListeners(rootElem) {
   const draggables = rootElem.querySelectorAll('.draggable');
   const dragListItems = rootElem.querySelectorAll('.draggable-list li');

 
   draggables.forEach((draggable, index) => {
     draggable.addEventListener('dragstart', dragStart);
     draggable.addEventListener('click', ()=>console.log('clicked'));
   });
 
   dragListItems.forEach(item => {
     item.addEventListener('dragover', dragOver);
     item.addEventListener('drop', dragDrop);
     item.addEventListener('dragenter', dragEnter);
     item.addEventListener('dragleave', dragLeave);
   });
 }

class SortList extends Component {
   constructor(props){
      super(props)
      this.sendData = this.sendData.bind(this)
   }

   rootElem = React.createRef()

   // componentDidMount() {
   //    let {items} = this.props
   //    if(this.props.filter !== 'all'){
   //       items = items.filter(elem=>elem.professor.find(item=>item === this.props.filter))
   //    }
   //    items.forEach((human, index)=>{
   //       const listItem = document.createElement('li');
 
   //       listItem.setAttribute('data-index', index);
   
   //       listItem.innerHTML = `
   //         <span class="number">${index + 1}</span>
   //         <div class="draggable" draggable="true">
   //           <p class="person-name" data-id='${human._id}'>${human.name}</p>
   //           <i class="fas fa-grip-lines"></i>
   //         </div>
   //       `;
   
   //       listItems.push(listItem);
   //       this.rootElem.current.appendChild(listItem);
   //    })
   //    addEventListeners(this.rootElem.current)
   // }

   componentDidUpdate(prevProps, prevState) {
      // cleaning old children
      // this.rootElem.current.children.forEach(elem=>{
      //    this.rootElem.current.removeChild(elem)
      // })
      if(prevProps !== this.props){
         if(this.rootElem.current.children.length > 0){
            for(let i = 0; i < this.rootElem.current.children.length; i++){
               this.rootElem.current.removeChild(this.rootElem.current.children[i])
            }
         }

         let {items} = this.props
         if(this.props.filter !== 'all'){
            items = items.filter(elem=>elem.professor.find(item=>item === this.props.filter))
         }
         items.forEach((human, index)=>{
            const listItem = document.createElement('li');
   
            listItem.setAttribute('data-index', index);
      
            listItem.innerHTML = `
            <span class="number">${index + 1}</span>
            <div class="draggable" draggable="true">
               <p class="person-name" data-id='${human._id}'>${human.name}</p>
               <i class="fas fa-grip-lines"></i>
            </div>
            `;
      
            listItems.push(listItem);
            this.rootElem.current.appendChild(listItem);
         })
         addEventListeners(this.rootElem.current)
      }
   }
   

   async sendData(){
      let {items} = this.props
      let result = []
      listItems.forEach((elem, index)=>{
         let id = elem.querySelector('.person-name').getAttribute('data-id')
         let item = items.find(human=>{
            return human._id === id
         })
         item.order[this.props.filter] = index
         result.push(item)
      })

      //setting up fields
      let reqData = new FormData()
      reqData.set('itemType', this.props.pageType.split('-')[1])
      alert('data is ready to deploy')
      console.log(result);
      reqData.set('info', JSON.stringify(result))

      // forming request string
      let reqUrl = '';
      let option = '/edit'
      let serverFunct = 'dbItem';
      reqUrl = serverUrl + serverFunct + option

      this.props.funcs.setUpLoader(true, 'Зберігаємо данні')

      let request = await fetch(reqUrl, {
         method: 'POST',
         headers: {
            encType: 'multipart/form-data'
            },
         body: reqData
         });
   
         let response = await request.text();
         this.props.funcs.setUpLoader(false)
         console.log(response);
   }
   
   render() {
      return (
         <>
         <ul class="draggable-list" id="draggable-list" ref={this.rootElem}></ul>
         <button className="btn btn-primary" onClick={this.sendData}>Зберегти</button>
         </>
      );
   }
}

export default SortList;