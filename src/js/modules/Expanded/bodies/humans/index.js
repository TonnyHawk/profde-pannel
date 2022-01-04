import React from 'react';

export default function HumansBody(properties){
   let {state, props, funcs} = properties
         let {name, photo, video, about, languages, professor, certificates, role} = state

         // let v = [
         //    {
         //       link: '',
         //       professor: 'English'
         //    }
         // ]
         let videoElem = video.map((elem, index)=>{

            let video = ''
            if(elem.link !== ''){
               video = (
                  <video controls className='mb-3'>
                     <source src={elem.link} type="video/mp4"/>
                     Your browser does not support the video tag.
                  </video>
               )
            }

            let prof = (
               <div class="row professor-elem mb-3" data-name='video'>
                  <div class="col-11">
                     <select class="form-select" aria-label="select example" id="professor" 
                     name='professor'
                     data-index={index}
                     data-name={'video'}
                     value={elem.professor}
                     onChange={(e)=>funcs.handleChange(e)}>
                        <option value='Deutsch'>Deutsch</option>
                        <option value="English">English</option>
                     </select>
                  </div>
                  <div className="col-1">
                     <div className="btn btn-danger"
                     data-name='video'
                     data-index={index} onClick={(e)=>funcs.deleteField(e)}>x</div>
                  </div>
               </div>
            )

            return (
               <>
                  {video}
                  <input class="form-control mb-3" type="file" name={'video-'+elem.professor}/>
                  {prof}
               </>
            )
         })

         // creating professor element
         let professorElem = professor.map((elem, index)=>{
            let content = (
            <div class="row professor-elem mb-3" data-name='professor'>
               <div class="col-11">
                  <select class="form-select" aria-label="select example" id="professor" 
                  name='professor'
                  data-index={index}
                  value={elem}
                  onChange={(e)=>funcs.handleChange(e)}>
                     <option value='Deutsch'>Deutsch</option>
                     <option value="English">English</option>
                  </select>
               </div>
               <div className="col-1">
                  <div className="btn btn-danger"
                  data-name='professor'
                  data-index={index} onClick={(e)=>funcs.deleteField(e)}>x</div>
               </div>
            </div>
            )
            return content
         })

         // languages
         let langLevelElement = languages.map((lang, index)=>{
            let langType = (
            <select class="form-select" aria-label="Default select example" id="lang-type" 
            name='name' 
            data-index={index}
            data-name='languages' value={lang.name}
            onChange={(e)=>funcs.handleChange(e)}>
               <option value='німецька'>Німецька</option>
               <option value="англійська">Англійська</option>
            </select>
            )

            let langLvl = (
                  <select class="form-select" aria-label="Default select example" id="lang-level"
                     name='lvl'
                     data-index={index}
                     data-name='languages' value={lang.lvl}
                     onChange={(e)=>funcs.handleChange(e)}>
                     <option value="A1">A1</option>
                     <option value="A2">A2</option>
                     <option value="B1">B1</option>
                     <option value="B2">B2</option>
                     <option value="C1">C1</option>
                  </select>
               );
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
                  data-index={index-1} onClick={(e)=>funcs.deleteField(e)}>x</div>
               </div>
            </div>
            )
         })

         let certificatesElem = certificates.map((elem, index)=>{

            let prof = (
               <div class="row professor-elem mt-3" data-name='professor'>
                  <div class="col-11">
                     <select class="form-select" aria-label="select example" id="professor" 
                     name='professor'
                     data-index={index}
                     data-name='certificates'
                     value={elem.professor}
                     onChange={(e)=>funcs.handleChange(e)}>
                        <option value='Deutsch'>Deutsch</option>
                        <option value="English">English</option>
                     </select>
                  </div>
               </div>
            )

            return (
            <div className="row certificates-elem my-3">
               <div className="col-12">
                  <img src={funcs.state.certificates[index].photo} alt="" />
               </div>
               <div className="row">
                  <div className="col">
                     <input type="text" class="form-control" name='name' data-name='certificates' data-index={index} placeholder="Назва сертифікату" value={funcs.state.certificates[index].name} onChange={(e)=>funcs.handleChange(e)}/>
                  </div>
                  <div className="col">
                     <input class="form-control" type="file" name={`cert-${elem.professor}-`+index}/>
                  </div>
                  <div className="col-1">
                     <div className="btn btn-danger"
                     data-name='certificates'
                     data-index={index} onClick={(e)=>funcs.deleteField(e)}>x</div>
                  </div>
               </div>
               <div className="row">
                  <div className="col">
                     {prof}
                  </div>
               </div>
            </div>
            )
         })

         let style = {
            zIndex: 100, 
            position: 'fixed', 
            top: 0, left: 0, 
            width: '100%', height: '100%', 
            background: 'white',
            overflow: 'auto'
         }

         let closeIconStyle = {
            fontSize: '4rem',
            cursor: 'pointer'
         }

         let photoPicture = '';
         if(photo !== ''){
            photoPicture = (
               <img src={photo} width={'100%'} alt="" className='mb-3' />
         )}
         return (
            <div style={style}>
               <div class="container" ref={c=>funcs.rootElem = c}>
               <i class="bi bi-arrow-left" style={closeIconStyle} onClick={()=>props.funcs.deselectHuman()}></i>
                  <div class="row">
                     <div class="col d-flex justify-content-center">
                        <h1 class='my-5'>{props.info.mode === 'add' ? 'Додати' : 'Редагувати'}</h1>
                     </div>
                  </div>
                  <div class="row">
                     <div class="col">
                        <form action="" id='form' class="needs-validation" ref={funcs.form} noValidate>
                           <div class="mb-4">
                              <label htmlFor="name" class="form-label">Ім'я</label>
                              <input type="text" class="form-control" id="name" name='name' placeholder="" required value={name} onChange={(e)=>funcs.handleChange(e)}/>
                           </div>
                           <div className='mb-4'>
                              <label htmlFor="role" class="form-label">Роль</label>
                              <select name="role" id="role" className='form-select' onChange={(e)=>funcs.handleChange(e)} value={role}>
                                 <option value="teacher">Вчитель</option>
                                 <option value="student">Учень</option>
                              </select>
                           </div>
                           <div class="row mb-5">
                              <div class="col-12 col-md-6">
                                 <div class="mb-4">
                                    <label htmlFor="photo" class="form-label">Фото</label><br/>
                                    {photoPicture}
                                    <input class="form-control" type="file" id="photo" name='photo'/>
                                 </div>
                              </div>
                              <div class="col-12 col-md-6">
                                 <div class="mb-4 video-elem">
                                    <label class="form-label">Відео</label><br/>
                                    {videoElem}
                                    <div class="btn btn-success" onClick={()=>funcs.addField('video', 2)}>Додати Відео</div>
                                 </div>
                              </div>
                           </div>
                           <div class="mb-4">
                              <label htmlFor="about" class="form-label">Загальне інфо</label>
                              <textarea rows='10' class="form-control" id="about" name='about' value={about} onChange={(e)=>funcs.handleChange(e)} required></textarea>
                           </div>
                           <div class="mb-5">
                              <label class="form-label mb-2">Professor</label>
                              {professorElem}
                              <div class="btn btn-success" onClick={()=>funcs.addField('professor', 2)}>Додати Школу</div>
                           </div>
                           <div class="mb-3 mt-5">
                              <label class="form-label mb-0">Рівень володіння мовою</label><br/>
                              {langLevelElement}
                              <div class="btn btn-success" onClick={()=>funcs.addField('languages', 2)}>Додати Мову</div>
                           </div>
                           <div class="mb-3 mt-5">
                              <label class="form-label">Сертифікати</label><br/>
                              {certificatesElem}
                              <div class="btn btn-success" onClick={()=>funcs.addField('certificates')}>Додати Сертифікат</div>
                           </div>
                        </form>
                     </div>
                  </div>
                  <div class="row">
                     <div class="col d-flex justify-content-end">
                        <div class="btn btn-danger btn-lg px-5 py-3 my-5 mx-3" id="submit" onClick={()=>funcs.delStudent()}>Видалити</div>
                        <div class="btn btn-primary btn-lg px-5 py-3 my-5 mx-3" id="submit" onClick={()=>funcs.sendData()}>Зберегти</div>
                        <div class="btn btn-success d-none my-5" id="get" onClick={()=>funcs.checkInfo('')}>Get Info</div>
                     </div>
                  </div>
               </div>
            </div>
         );
      }