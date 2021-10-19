import React, { Component } from 'react';


class Expanded extends Component {
   constructor(props){
      super(props);
      let {human} = this.props      
      this.state = {
         name: human.name || '',
         about: human.about || '',
         video: human.video || '',
         photo: human.photo || '',
         languages: human.languages || [{name: 'Німецька', lvl: 'A1'}],
         professor: human.professor || ['Deutsch'],
         id: human._id,
         role: human.role || 'student',
         required: ['name', 'about']
      }
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
      this.setState(state=>{
         if(state[key].length > 1){
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
      reqData.set('photo', this.state.photo)
      if(this.state.video !== '') reqData.set('video', this.state.video)
      let response = await fetch('http://127.0.0.1:3000/humans/del', {
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
         // data preprocessing
         let name = this.state.name.split(' ').map(elem=>{ // making each first letter a capital
            let newStr = elem;
            let letterIndex = 0
            while(!elem[letterIndex].toUpperCase()){
               letterIndex++
            }
            newStr = elem[letterIndex].toUpperCase() + elem.slice(letterIndex+1, elem.length);
            return newStr
         }).join(' ');
         let human = {
            name,
            about: this.state.about,
            video: this.state.video,
            photo: this.state.photo,
            languages: this.state.languages,
            professor: this.state.professor,
            id: this.state.id,
            role: this.state.role
         }

         let formInfo = new FormData(this.form.current) // to read info from our form
         let reqData = new FormData(); // this will be send to the server
         if(formInfo.get('photo').size > 0){ // if we added a new photo to the form
            let photo = formInfo.get('photo')
            reqData.set('photo', photo, 'avatar.jpg')
         }
         if(formInfo.get('video').size > 0){ // if we added a new video to the form
            let video = formInfo.get('video')
            reqData.set('video', video, 'video.mp4')
         }
         // alert('data is ready to deploy')
         console.log(human);
         reqData.set('info', JSON.stringify(human))

         let reqUrl;
         if(this.props.info.mode === 'edit') reqUrl = 'http://127.0.0.1:3000/humans'
         else if(this.props.info.mode === 'add') reqUrl = 'http://127.0.0.1:3000/humans/add'
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
      let {human} = this.props
      let {name, photo, video, about, languages, professor, certificates, role} = this.state
      let index = 0;
      // creating professor element
      // let professorElem = ''
      let professorElem = professor.map(elem=>{
         let content = (
         <div class="row professor-elem" data-name='professor'>
            <div class="col-11">
               <select class="form-select" aria-label="select example" id="professor" 
               name='professor'
               data-index={index}
               value={elem}
               onChange={(e)=>this.handleChange(e)}>
                  <option value='Deutsch'>Deutsch</option>
                  <option value="English">English</option>
               </select>
            </div>
            <div className="col-1">
               <div className="btn btn-danger"
               data-name='professor'
               data-index={index} onClick={(e)=>this.deleteField(e)}>x</div>
            </div>
         </div>
         )
         index++;
         return content
      })

      index = 0;
      // languages
      let langLevelElement = languages.map(lang=>{
         let langType = (
         <select class="form-select" aria-label="Default select example" id="lang-type" 
         name='name' 
         data-index={index}
         data-name='languages' value={lang.name}
         onChange={(e)=>this.handleChange(e)}>
            <option value='німецька'>Німецька</option>
            <option value="англійська">Англійська</option>
         </select>
         )

         let langLvl = (
               <select class="form-select" aria-label="Default select example" id="lang-level"
                  name='lvl'
                  data-index={index}
                  data-name='languages' value={lang.lvl}
                  onChange={(e)=>this.handleChange(e)}>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
               </select>
            );
            index++;
         return (
         <div class="row language-elem my-3" data-name='lang-level'>
            <div class="col">
               {langType}
            </div>
            <div class="col">
               {langLvl}
            </div>
            <div className="col-1">
               <div className="btn btn-danger"
               data-name='languages'
               data-index={index-1} onClick={(e)=>this.deleteField(e)}>x</div>
            </div>
         </div>
         )
      })

      if(video !== ''){
         video = (
            <video controls>
               <source src={video} type="video/mp4"/>
               Your browser does not support the video tag.
            </video>
         )
      }

      let style = {
         zIndex: 100, 
         position: 'fixed', 
         top: 0, left: 0, 
         width: '100%', height: '100%', 
         background: 'white',
         overflow: 'auto'
      }
      return (
      <div style={style}>
      <div class="container" ref={c=>this.rootElem = c}>
         <div class="row">
            <div class="col d-flex justify-content-center">
               <h1 class='my-5'>{this.props.info.mode === 'add' ? 'Додати' : 'Редагувати'}</h1>
            </div>
         </div>
         <div class="row">
            <div class="col">
               <form action="" id='form' class="needs-validation" ref={this.form} noValidate>
                  <div class="mb-4">
                     <label htmlFor="name" class="form-label">Ім'я</label>
                     <input type="text" class="form-control" id="name" name='name' placeholder="" required value={name} onChange={(e)=>this.handleChange(e)}/>
                  </div>
                  <div className='mb-4'>
                     <label htmlFor="role" class="form-label">Роль</label>
                     <select name="role" id="role" className='form-select' onChange={(e)=>this.handleChange(e)} value={role}>
                        <option value="teacher">Вчитель</option>
                        <option value="student">Учень</option>
                     </select>
                  </div>
                  <div className="row">
                     <div className="col-12 col-md-6">
                        <img src={photo} height={100} alt="" />
                     </div>
                     <div className="col-12 col-md-6">
                        {video}
                     </div>
                  </div>
                  <div class="row">
                     <div class="col-12 col-md-6">
                        <div class="mb-4">
                           <label htmlFor="photo" class="form-label">Фото</label>
                           <input class="form-control" type="file" id="photo" name='photo'/>
                        </div>
                     </div>
                     <div class="col-12 col-md-6">
                        <div class="mb-4">
                           <label htmlFor="video" class="form-label">Відео</label>
                           <input class="form-control" type="file" id="video" name='video'/>
                        </div>
                     </div>
                  </div>
                  <div class="mb-4">
                     <label htmlFor="about" class="form-label">Загальне інфо</label>
                     <textarea class="form-control" id="about" name='about' rows="3" value={about} onChange={(e)=>this.handleChange(e)} required></textarea>
                  </div>
                  <div class="mb-5">
                     <label class="form-label mb-2">Professor</label>
                     {professorElem}
                     <div class="btn btn-success mt-3" onClick={()=>this.addProfessor()}>Додати Школу</div>
                  </div>
                  <div class="mb-3 mt-5">
                     <h4 class="mt-5 mb-4">Рівень володіння мовою</h4>
                     {langLevelElement}
                     <div class="btn btn-success" onClick={()=>this.addLangLevel()}>Додати Мову</div>
                  </div>
               </form>
            </div>
         </div>
         <div class="row">
            <div class="col d-flex justify-content-end">
               <div class="btn btn-danger btn-lg px-5 py-3 my-5 mx-3" id="submit" onClick={()=>this.delStudent()}>Видалити</div>
               <div class="btn btn-primary btn-lg px-5 py-3 my-5 mx-3" id="submit" onClick={()=>this.sendData()}>Додати</div>
               <div class="btn btn-success my-5 d-none" id="get" onClick={()=>this.showInfo()}>Get Info</div>
            </div>
         </div>
      </div>
   </div>
      );
   }
}

export default Expanded;