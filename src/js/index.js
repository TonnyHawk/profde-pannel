import React, { Component } from 'react';
import Expanded from './modules/Expanded';
import ReactDOM from 'react-dom';
import Loader from './components/Loader'
import serverUrl from './globals';


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
   }

   setUpLoader(display, message=''){
      this.setState({loader: {display, message}})
   }

   handleChange(e){
      this.setState({search: e.target.value})
   }

   async loadItems(){
      let items = []
      items = await getCollection(this.state.currentPage)
      console.log(items);
      this.setState({items})
   }

   async componentDidMount(){
      await this.loadItems()
      let arr = {1: ''}
      console.log(arr.length);
      if(!arr.length) console.log('arr');
      else console.log('hublo');
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


   render() {
      let {search, items, selectedItem, expandedPage, currentPage} = this.state
      items = this.nameFilter(search, items)
      items = items.map(human=>{
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
            title = 'Курси'
      }
      return (
      // <div class="page" id="page-books">
         <div class="page">
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
                     <div class="input-group gall__search">
                        <div class="input-group-append">
                          <span class="input-group-text" id="basic-addon1">@</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={search} onChange={(e)=>this.handleChange(e)}/>
                      </div>
                     </div>
                     <div class="gall__bd">
                        {items}
                     </div>
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