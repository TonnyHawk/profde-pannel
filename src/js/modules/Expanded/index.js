import React, { Component } from 'react';
import CertificatesBody from './bodies/certificates';
import HumansBody from './bodies/humans';

function strCapitalize(str){
   return str.split(' ').map(elem=>{ // making each first letter a capital
      let newStr = elem;
      let letterIndex = 0
      while(!elem[letterIndex].toUpperCase()){
         letterIndex++
      }
      newStr = elem[letterIndex].toUpperCase() + elem.slice(letterIndex+1, elem.length);
      return newStr
   }).join(' ');
}

class Expanded extends Component {
   constructor(props){
      super(props);
      let {pageType, human} = this.props
      let state = {}
      if(pageType === 'humans'){
         state = {
            name: human.name || '',
            about: human.about || '',
            video: human.video || '',
            photo: human.photo || '',
            languages: human.languages || [{name: 'Німецька', lvl: 'A1'}],
            professor: human.professor || ['Deutsch'],
            id: human._id || null,
            role: human.role || 'student',
            certificates: human.certificates || [],
            required: ['name', 'about']
         }
      }else if(pageType === 'certificates'){
         state = {
            name: human.name || '',
            photo: human.photo || '',
            owner: human.owner || '',
            professor: human.professor || ['Deutsch'],
            id: human._id || null,
            required: ['name', 'owner']
         }
      }
      this.state = state
      this.form = React.createRef()
   }
   
   handleChange(e){
      let key = e.target.name
      let value = e.target.value
      if(e.target.getAttribute('data-index')){ // meens that we process select
         let index = e.target.getAttribute('data-index')
         let name = e.target.name
         if(e.target.getAttribute('data-name')){ // if we need to change select pair
               key = e.target.getAttribute('data-name')
               this.setState(state=>{
                  state[key][index][name] = value
                  return state
               }, ()=>{
                  // console.log(this.state[key]);
               })
         } else{ // we have a simple select
            this.setState(state=>{
               state[name][index] = value;
               return state
            })
         }
      } else{
         this.setState({
            [key]: value
         })
      }
   }

   addCertificate(){
      this.setState(state=>{
         state.certificates.push({
            name: '',
            photo: '',
         })

         return state
      })
   }

   addLangLevel(){
      this.setState(state=>{
         if(state.languages.length < 2){
            state.languages.push({
               name: '',
               lvl: ''
            })
         }
         return state
      })
   }

   addProfessor(){
      this.setState(state=>{
         if(state.professor.length < 2){
            state.professor.push([''])
         }
         return state
      })
   }

   deleteField(e){
      let key = e.target.getAttribute('data-name');
      let index = e.target.getAttribute('data-index')
      let minNumOfElements = 1
      if(key === 'certificates') minNumOfElements = 0
      this.setState(state=>{
         if(state[key].length > minNumOfElements){
            state[key] = state[key].filter(elem=>{
               if(elem !== state[key][index]){
                  return elem
               }
            })
         }
         return state
      })
   }

   validate(){
      let response = {
         access: true,
         targets: []
      };
         this.state.required.forEach(elem=>{
            if(this.state[elem] === ''){
               response.access = false
               response.targets.push(elem)
            }
         })
    
      this.form.current.classList.add('was-validated')
    
      return response
   }

   showInfo(){
      console.log(this.state)
   }

   async delStudent(){
      let id = this.state.id
      let reqData = new FormData()
      reqData.set('id', id)
      reqData.set('itemType', this.props.pageType)

      let response = await fetch('http://127.0.0.1:3000/dbItem/del', {
         method: 'POST',
         headers: {
            encType: 'multipart/form-data'
          },
         body: reqData
       });
       
       let result = await response.text();
       console.log(result);

       this.props.funcs.deselectHuman()
   }


   async sendData(){
      let validation = this.validate()
      if(!validation.access){
         alert('Здається ви заповнили форму не до кінця. будь ласка заповніть поля підсвічені червоним')
      } else{
         let {pageType} = this.props;
         let human = {}
         let formInfo = new FormData(this.form.current) // to read info from our form
         let reqData = new FormData(); // this will be send to the server

         if(pageType === 'humans'){

            // data preprocessing
            let name = strCapitalize(this.state.name)

            let certificates = this.state.certificates;
            certificates = certificates.map((elem, index)=>{
               // в якийх є файли з тих залить
               let photo = formInfo.get('cert-photo-'+index)
               if(photo.size > 0){
                  elem.photo = photo;
                  reqData.set('cert-photo-'+index, photo, 'cert-'+index+'.jpg')
               }
               return elem
            })

            // main data
            human = {
               name,
               about: this.state.about,
               video: this.state.video,
               photo: this.state.photo,
               languages: this.state.languages,
               professor: this.state.professor,
               id: this.state.id,
               role: this.state.role,
               certificates
            }

            // media files
            if(formInfo.get('video').size > 0){ // if we added a new video to the form
               let video = formInfo.get('video')
               reqData.set('video', video, 'video.mp4')
            }

         } else if(pageType === 'certificates'){

            // data preprocessing
            let owner = strCapitalize(this.state.owner)

            human = {
               name: this.state.name,
               photo: this.state.photo,
               professor: this.state.professor,
               owner,
               id: this.state.id
            }
         }

         if(formInfo.get('photo').size > 0){ // if we added a new photo to the form
            let photo = formInfo.get('photo')
            reqData.set('photo', photo, 'avatar.jpg')
         }

         alert('data is ready to deploy')
         console.log(human);
         reqData.set('info', JSON.stringify(human))

         // forming request string
         let reqUrl = '';
         let serverUrl = 'http://127.0.0.1:3000/'
         let option = ''
         if(this.props.info.mode === 'edit') option = '/edit'
         else if(this.props.info.mode === 'add') option = '/add'
         reqUrl = serverUrl + pageType + option


         let response = await fetch(reqUrl, {
            method: 'POST',
            headers: {
               encType: 'multipart/form-data'
             },
            body: reqData
          });
          
          let result = await response.text();
          console.log(result);

          this.props.funcs.deselectHuman()
      }
   }
   render() {
      let {pageType} = this.props
      if(pageType === 'humans'){
         return <HumansBody state={this.state} props={this.props} funcs={this}/>
      }else if(pageType === 'certificates'){
         return <CertificatesBody state={this.state} props={this.props} funcs={this}/>
      }
   }
}

export default Expanded;