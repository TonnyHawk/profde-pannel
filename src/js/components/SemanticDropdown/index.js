import { Dropdown } from 'semantic-ui-react'
// import 'semantic-ui-css/components/dropdown.min.css'

import React, { Component } from 'react';

async function getCollection(add){
   let result = [];
   // let response = await fetch('https://testproj-328917.appspot.com/'+add);
   let response = await fetch('http://127.0.0.1:3000/'+add, {});
   if (response.ok) { // если HTTP-статус в диапазоне 200-299
      result = await response.json();
   } else {
      alert("Ошибка подгрузки "+add+" (HTTP): " + response.status);
   }
   return result
}

class semanticDropdown extends Component {
   constructor(props){
      super(props)
      this.state = {
         items: [],
         selectedItems: []
      }
   }

   async componentDidMount() {
      let items = await getCollection('books')
      this.setState({items})
   }

   handleDropDownSelect = (event, data) => {
      console.log(data.value);
      this.setState({selectedItems: data.value})
   };
   componentDidUpdate(prevProps, prevState) {
      console.log(this.state.selectedItems);
   }
   
   
   render() {
      let {funcs} = this.props
      console.log(funcs.state);
      let items = this.state.items.map(elem=>{
         return { key: elem._id, text: elem.name, value: elem._id }
      })

      return (
         <Dropdown
         placeholder='Назва книги'
         fluid
         multiple
         search
         selection
         options={items}
         onChange={(e, data)=>funcs.handleDropDownSelect(e, data, funcs)}
         value={funcs.state.books}
       />
      );
   }
}

export default semanticDropdown;