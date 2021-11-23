import React, { Component } from 'react';
import Expanded from './modules/Expanded';
import ReactDOM from 'react-dom';
import Loader from './components/Loader'
import serverUrl from './globals';
import SortList from './components/SortList'

import './style.css';

async function getCollection(add){
   let result = [];
   let response = await fetch(serverUrl+add, {});
   if (response.ok) { // если HTTP-статус в диапазоне 200-299
      result = await response.json();
   } else {
      alert("Ошибка подгрузки "+add+" (HTTP): " + response.status);
   }
   return result
}

class App extends Component {
   constructor(props){
      super(props)
      this.state = {
         search: '',
         items: [],
         selectedItem: '',
         expandedPage: {
            state: false,
            mode: ''
         },
         // all, Deutsch, English
         filter: 'all',
         // available pages: humans, certificates, books, courses
         currentPage: 'humans',
         loader: {display: false, message: ''}
      }
      this.rootElem = React.createRef()
   }

   setUpLoader(display, message=''){
      this.setState({loader: {display, message}})
   }

   handleChange(e){
      this.setState({search: e.target.value})
   }

   async loadItems(){
      let items = [];
      let collection = null;
      switch(this.state.currentPage){
         case 'sort-humans':
            collection = 'humans';
            break;
         default:
            collection = this.state.currentPage;
            break;
      }
      items = await getCollection(collection)
      this.setState({items})
   }

   async componentDidMount(){
      await this.loadItems()
   }

   propertyFilter(items, prop, value){
      if(value !== 'all'){
         return items.filter(elem=>{
            if(typeof elem[prop] === 'object'){
               if(elem[prop].length){ // if it is an array
                  for(let i = 0; i < elem[prop].length; i++){
                     if(elem[prop][i] === value) {
                        return elem
                     }
                  }
               }
            }else {
               if(elem[prop] === value){
                  return elem
               }
            }
         })
      }else{
         return items
      }
   }

   nameFilter(str, arr){
      arr = this.propertyFilter(arr, 'professor', this.state.filter)
      return arr.filter(elem=>{
         let name = elem.name.toLowerCase()
         str = str.toLowerCase()
         if(name.includes(str)) return elem
      })
   }

   toggleFilter(val){
      this.setState(state=>{
         state.filter = val
         return state
      })
   }

   changePage(name){
      console.log('changing a page to '+name);
      this.setState({currentPage: name}, ()=>this.loadItems())
   }

   addItem(){
      this.setState({
         selectedItem: '',
         expandedPage: {
            state: true,
            mode: 'add'
         }
      })
   }

   selectHuman(human){
      this.setState({
         selectedItem: human,
         expandedPage: {
            state: true,
            mode: 'edit'
         }
      })
   }
   async deselectHuman(){
      await this.loadItems()
      this.setState({
         selectedItem: '',
         expandedPage: {state: false},
      })
   }

   // sendData(){
   //    let {items} = this.props
   //    let result = []
   //    listItems.forEach((elem, index)=>{
   //       let id = elem.querySelector('.person-name').getAttribute('data-id')
   //       let item = items.find(human=>{
   //          return human._id === id
   //       })
   //       item.order[this.props.filter] = index
   //       result.push(item)
   //    })
   //    console.log(result);

   //    //setting up fields
   //    reqData.set('itemType', this.props.pageType)
   //    alert('data is ready to deploy')
   //    console.log(human);
   //    reqData.set('info', JSON.stringify(human))

   //    // forming request string
   //    let reqUrl = '';
   //    let option = ''
   //    let serverFunct = 'dbItem';
   //    if(this.props.info.mode === 'edit') option = '/edit'
   //    else if(this.props.info.mode === 'add') {option = '/add';}
   //    // reqUrl = serverUrl + pageType + option
   //    reqUrl = serverUrl + serverFunct + option

   //    this.props.funcs.setUpLoader(true, 'Зберігаємо данні')

   //    let response = await fetch(reqUrl, {
   //       method: 'POST',
   //       headers: {
   //          encType: 'multipart/form-data'
   //          },
   //       body: reqData
   //       });
   
   //       let result = await response.text();
   //       this.props.funcs.setUpLoader(false)
   //       console.log(result);
   // }


   render() {
      let {search, items, selectedItem, expandedPage, currentPage} = this.state

      items = this.nameFilter(search, items)
      items = items.map((human, ind)=>{
         return (
            <div class="gall__item gall-item" onClick={()=>this.selectHuman(human)}>
               <div class="gall-item__photo">
                  <img src={human.photo} alt="" class="gall-item__img" />
               </div>
               <p class="gall-item__title">{human.name}</p>
               {/* <p class="gall-item__descr">Анна Богуцька</p> */}
            </div>
         )
      })

      let content;
      if(currentPage === 'sort-humans'){

         content = <SortList items={this.state.items} filter={this.state.filter} pageType={currentPage} funcs={this}/>

      }else{
         content = (
            <div class="gall__bd">
               {items}
            </div>
         )
      }

      let expandedPageElem = expandedPage.state ? <Expanded info={expandedPage} pageType={currentPage} human={selectedItem} funcs={this}/> : '';
      let title = ''
      switch(currentPage){
         case 'humans':
            title = 'Люди'
            break;
         case 'certificates':
            title = 'Сертифікати'
            break;
         case 'books':
            title = 'Книги';
            break;
         case 'courses':
            title = 'Курси';
            break;
         default:
            title = 'Впорядкування';
      }
      return (
      // <div class="page" id="page-books">
      <div class="page" ref={this.rootElem}>
         <div class="page__inner">
            <div class="page__hd">
               <p class="page__title">{title}</p>
               <nav role="navigation" id='nav'>
                  <div id="menuToggle">
                     {/* <!--
                     A fake / hidden checkbox is used as click reciever,
                     so you can use the :checked selector on it.
                     --> */}
                     <input type="checkbox" />
                     
                     {/* <!--
                     Some spans to act as a hamburger.
                     
                     They are acting like a real hamburger,
                     not that McDonalds stuff.
                     --> */}
                     <span></span>
                     <span></span>
                     <span></span>
                     
                     {/* <!--
                     Too bad the menu has to be inside of the button
                     but hey, it's pure CSS magic.
                     --> */}
                     <ul id="menu">
                        <a onClick={()=>this.changePage('humans')}><li>Люди</li></a>
                        <a onClick={()=>this.changePage('certificates')}><li>Сертифікати</li></a>
                        <a onClick={()=>this.changePage('books')}><li>Книги</li></a>
                        <a onClick={()=>this.changePage('courses')}><li>Курси</li></a>
                     </ul>
                  </div>
               </nav>
               {/* <div class="page__icon page__icon--left page__close-icon">
                  <i class="bi bi-arrow-left"></i>
               </div> */}
            </div>
            <div class="page__bd">
               <div class='gall gall--books'>
                  <div class="gall__inner">
                     <div class="gall__hd">
                        <div class="gall__filters">
                        <p class={`gall__filter ${this.state.filter === 'all' ? 'is-active' : ''} bg-active-main`} onClick={()=>this.toggleFilter('all')}>Всі</p>
                        <p class={`gall__filter ${this.state.filter === 'Deutsch' ? 'is-active' : ''} bg-active-deu`} onClick={()=>this.toggleFilter('Deutsch')}>Deutsch</p>
                        <p class={`gall__filter ${this.state.filter === 'English' ? 'is-active' : ''} bg-active-eng`} onClick={()=>this.toggleFilter('English')}>English</p>
                     </div>
                     <div className="btn btn-primary btn-lg" onClick={()=>this.addItem()}>+</div>
                     <div className="btn btn-primary btn-lg" onClick={()=>this.changePage('sort-humans')}>Sort</div>
                     <div class="input-group gall__search">
                        <div class="input-group-append">
                          <span class="input-group-text" id="basic-addon1">@</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={search} onChange={(e)=>this.handleChange(e)}/>
                      </div>
                     </div>
                     {content}
                  </div>
               </div>
            </div>
         </div>
         {expandedPageElem}
         {this.state.loader.display ? <Loader message={this.state.loader.message}/> : ''}
      </div>
      );
   }
}


ReactDOM.render(
    <App/>,
  document.getElementById('root')
);