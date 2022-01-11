import React, { Component } from 'react';
import CertificatesBody from './bodies/certificates';
import HumansBody from './bodies/humans';
import BooksBody from './bodies/books';
import CoursesBody from './bodies/courses';
import GalleryBody from './bodies/gallery';
import serverUrl from '../../globals';
import {toBase64, clearPageType} from '../../functions';


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

function mimeCheck(file, acceptableType){
   let allowedExtensions = '';
   switch(acceptableType){
      case 'image':
         allowedExtensions = /(\jpg|\jpeg|\png)$/i;
         break;
      case 'video':
         allowedExtensions = /(\mp4)$/i;
         break;
      default:
         allowedExtensions = /(\jpg|\jpeg|\png\mp4)$/i;
   }
   if(!allowedExtensions.exec(file.type)) return false
   else return true
}


class Expanded extends Component {
   constructor(props){
      super(props);
      let {pageType, human} = this.props
      let state = {}
      let type = clearPageType(pageType)

      switch(type){
         case 'humans':
            state = {
               name: human.name || '',
               about: human.about || '',
               video: human.video || [],
               photo: human.photo || '',
               languages: human.languages || [{name: 'Німецька', lvl: 'A1'}],
               professor: human.professor || ['Deutsch'],
               id: human._id || null,
               role: human.role || 'student',
               certificates: human.certificates || [],
               order: human.order || {},
               required: ['name', 'about']
            }
            break;
         case 'gallery':
            state = {
               name: human.name || '',
               about: human.about || '',
               media: human.media || {link: '', type: ''},
               professor: human.professor || ['Deutsch'],
               id: human._id || null,
               showcase: human.showcase || 'null',
               required: ['media']
            }
            break;
         case 'certificates':
            state = {
               name: human.name || '',
               photo: human.photo || '',
               owner: human.owner || '',
               professor: human.professor || ['Deutsch'],
               id: human._id || null,
               required: ['name', 'owner']
            }
            break;
         case 'books':
            state = {
               name: human.name || '',
               photo: human.photo || '',
               about: human.about || '',
               professor: human.professor || ['Deutsch'],
               id: human._id || null,
               required: ['name', 'about', 'professor']
            }
            break;
         case 'courses':
            state = {
               name: human.name || '',
               about: human.about || '',
               professor: human.professor || ['Deutsch'],
               features: human.features || [],
               themes: human.themes || [{title: 'grammar', content: ''}, {title: 'speaking', content: ''}],
               id: human._id || null,
               books: human.books || [],
               features: human.features || [{text:'', photo: ''}],
               required: ['name', 'about', 'professor']
            }
            break;
      }
      this.state = state
      this.form = React.createRef()
   }
   
   handleChange(e){
      let key = e.target.name
      let value = e.target.value
      if(e.target.getAttribute('data-index')){ // meens that we deal with an array
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


   handleDropDownSelect = (e, data=null, binding=null) => {
      binding.setState({books: data.value})
   };

   addField(key, limit=null){
      let template;
      let errors = null;
      switch(key){
         case 'certificates':
            template = {
               name: '',
               photo: '',
               professor: 'Deutsch',
            }
            break;
         case 'languages':
            template = {
               name: '',
               lvl: ''
            }
            break;
         case 'professor':
            template = [''];
            break;
         case 'video':
            template = {link: '', professor: 'Deutsch'};
            break;
         case 'features':
            template = {text: '', photo: ''};
            break;
         default:
            errors = 'function addField is not correct fulfield'
      }

      if(!errors){

         this.setState(state=>{
            if(limit !== null){ // if the limit is setted up
               if(state[key].length < limit){
                  state[key].push(template)
               }
            }else{ // if there is no limit
               state[key].push(template)
            }

            return state
         })

      }else{
         console.log(errors)
      }
   }

   deleteField(e){
      let key = e.target.getAttribute('data-name');
      let index = e.target.getAttribute('data-index')
      let minNumOfElements = 1
      if(key === 'certificates' || key === 'video' || key === 'features') minNumOfElements = 0
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
            if(elem === 'media'){
               let formInfo = new FormData(this.form.current)
               let file = formInfo.get('media')
               if(file.size == 0){
                  if(this.state.media.link === ''){
                     response.access = false
                     response.targets.push(elem)
                  }
               }
            }else if(this.state[elem] === ''){
               response.access = false
               response.targets.push(elem)
            }
         })
    
      this.form.current.classList.add('was-validated')
    
      return response
   }

   showInfo(){
      console.log(this.state.features)
   }

   async delStudent(){
      let id = this.state.id
      let reqData = new FormData()
      reqData.set('id', id)
      reqData.set('itemType', this.props.pageType)

      this.props.funcs.setUpLoader(true, 'Видалення...')

      let response = await fetch(`${serverUrl}dbItem/del`, {
         method: 'POST',
         headers: {
            encType: 'multipart/form-data'
          },
         body: reqData
       });
       
       let result = await response.text();
       console.log(result);

       this.props.funcs.setUpLoader(false);

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
               let photo = formInfo.get(`cert-${elem.professor}-`+index)
               if(photo.size > 0){
                  elem.photo = photo
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
               certificates,
               order: this.state.order,
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
         } else if(pageType === 'books'){
            human = {
               name: this.state.name,
               photo: this.state.photo,
               professor: this.state.professor,
               about: this.state.about,
               id: this.state.id
            }
         }else if(pageType === 'gallery'){
            human = {
               name: this.state.name,
               professor: this.state.professor,
               about: this.state.about,
               id: this.state.id,
               media: this.state.media,
               showcase: this.state.showcase
            }
         } else if(pageType === 'courses'){

            let features = this.state.features;
            features = await Promise.all(features.map(async (elem, index)=>{
               // в якийх є файли з тих залить
               let photo = formInfo.get(`feature-${index}`)
               if(photo.size > 0){
                  await toBase64(photo).then(res=>elem.photo=res);
               }
               return elem
            }))

            human = {
               name: this.state.name,
               about: this.state.about,
               professor: this.state.professor,
               features,
               themes: this.state.themes,
               books: this.state.books,
               id: this.state.id
            }

            console.log(human.features);
         }

         reqData.set('info', '')

         if(pageType === 'humans'){
            // media files
            human.video.forEach(elem=>{
               let file = formInfo.get('video-'+elem.professor);
               if(file.size > 0){ // if we added a new video to the form
                  let video = file
                  reqData.set('video-'+elem.professor, video, `video-${elem.professor}.mp4`)
               }
            })

            this.state.certificates.forEach((elem, index)=>{
               // в якийх є файли з тих залить
               let fieldName = `cert-${elem.professor}-`+index
               let photo = formInfo.get(fieldName)
               if(photo.size > 0){
                  elem.photo = photo;
                  reqData.set(fieldName, photo, 'cert-'+index+'.jpg')
               }
               return elem
            })
         }
         try{
            let file = formInfo.get('photo')
            if(file.size > 0){ // if we added a new photo to the form
               let photo = file
               reqData.set('photo', photo, 'avatar')
            }
         }catch{
            console.log('no photo file existed in this form');
         }

         if(pageType === 'gallery'){
            let file = formInfo.get('media')
            if(file.size > 0){
               let mediaFile = file
               reqData.set('media', mediaFile, 'media-file')
               let type = mediaFile.type.split('/')[0]
               human.media = {link: '', type}
            }
         }


         console.log(human.features);

         reqData.set('itemType', this.props.pageType)
         reqData.set('info', JSON.stringify(human))

         // forming request string
         let reqUrl = '';
         let option = ''
         let serverFunct = 'dbItem';
         if(this.props.info.mode === 'edit') option = '/edit'
         else if(this.props.info.mode === 'add') {option = '/add';}
         // reqUrl = serverUrl + pageType + option
         reqUrl = serverUrl + serverFunct + option

         this.props.funcs.setUpLoader(true, 'Зберігаємо данні')

         let response = await fetch(reqUrl, {
            method: 'POST',
            headers: {
               encType: 'multipart/form-data'
            },
            body: reqData
         });
      
         let result = await response.text();
         this.props.funcs.setUpLoader(false)
         console.log(result);

         this.props.funcs.deselectHuman()
      }
   }
   render() {
      let {pageType} = this.props
      let type = clearPageType(pageType)
      switch(type){
         case 'humans':
            return <HumansBody state={this.state} props={this.props} funcs={this}/>
         case 'certificates':
            return <CertificatesBody state={this.state} props={this.props} funcs={this}/>
         case 'books':
            return <BooksBody state={this.state} props={this.props} funcs={this}/>
         case 'courses':
            return <CoursesBody state={this.state} props={this.props} funcs={this}/>
         case 'gallery':
            return <GalleryBody state={this.state} props={this.props} funcs={this}/>
         default:
            return <p>Something went wrong! Please refresh the page</p>
      }
   }
}

export default Expanded;