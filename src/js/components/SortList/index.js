import React, { Component } from 'react';
import serverUrl from '../../globals';

let dragStartIndex;

class SortList extends Component {
   constructor(props){
      super(props)
      this.sendData = this.sendData.bind(this)
      this.state = {
         listItems: props.items,
      }
   }

   rootElem = React.createRef()

   dragStart() {
      // console.log('Event: ', 'dragstart');
      dragStartIndex = +this.closest('li').getAttribute('data-index');
    }
    
   dragEnter() {
      // console.log('Event: ', 'dragenter');
      this.classList.add('over');
    }
    
   dragLeave() {
      // console.log('Event: ', 'dragleave');
      this.classList.remove('over');
    }
    
   dragOver(e) {
      // console.log('Event: ', 'dragover');
      e.preventDefault();
   }
    
    // Swap list items that are drag and drop
   swapItems(fromIndex, toIndex) {
      this.setState(state=>{
         let {listItems} = state
         let temp = listItems[fromIndex];
         listItems[fromIndex] = listItems[toIndex]
         listItems[toIndex] = temp

         state.listItems = listItems

         return state
      })
   }
   
   dragDrop(e, root) {
      // console.log('Event: ', 'drop');
      let elem = e.target
      const dragEndIndex = +elem.closest('li').getAttribute('data-index');
      root.swapItems(dragStartIndex, dragEndIndex);
      
      elem.classList.remove('over');
   }

   addEventListeners(rootElem) {
      const draggables = rootElem.querySelectorAll('.draggable');
      const dragListItems = rootElem.querySelectorAll('.draggable-list li');
      let root = this

      
      draggables.forEach((draggable, index) => {
         draggable.addEventListener('dragstart', this.dragStart);
      });
      
      dragListItems.forEach(item => {
         item.addEventListener('dragover', this.dragOver);
         item.addEventListener('drop', (e)=>this.dragDrop(e, root));
         item.addEventListener('dragenter', this.dragEnter);
         item.addEventListener('dragleave', this.dragLeave);
      });
   }

   componentDidMount() {
      this.addEventListeners(this.rootElem.current)
   }
   
   
   

   async sendData(){
      let {items} = this.props
      let {listItems} = this.state
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
      let {listItems} = this.state
      listItems = listItems.map((human, index)=>{
         return (
            <li data-index={index}>
            <span class="number">{index + 1}</span>
            <div class="draggable" draggable="true">
               <p class="person-name" data-id={human._id}>{human.name}</p>
               <i class="fas fa-grip-lines"></i>
            </div>
            </li>
         )
      })
      // items.forEach((human, index)=>{
      //    const listItem = document.createElement('li');
 
      //    listItem.setAttribute('data-index', index);
   
      //    listItem.innerHTML = `
      //      <span class="number">${index + 1}</span>
      //      <div class="draggable" draggable="true">
      //        <p class="person-name" data-id='${human._id}'>${human.name}</p>
      //        <i class="fas fa-grip-lines"></i>
      //      </div>
      //    `;
   
      //    listItems.push(listItem);
      //    this.rootElem.current.appendChild(listItem);
      // })
      // addEventListeners(this.rootElem.current)
      return (
         <>
         <ul class="draggable-list" id="draggable-list" ref={this.rootElem}>{listItems}</ul>
         <button className="btn btn-primary" onClick={this.sendData}>Зберегти</button>
         </>
      );
   }
}

export default SortList;