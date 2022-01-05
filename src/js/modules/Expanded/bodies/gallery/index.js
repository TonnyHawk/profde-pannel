import React from 'react';

export default function GalleryBody(properties){
   let {state, props, funcs} = properties
         let {name, photo, media, about, professor} = state

         // creating professor element
         let professorElem = professor.map((elem, index)=>{
            let content = (
            <div class="row professor-elem mb-3" data-name='professor'>
               <div class="col">
                  <select class="form-select" aria-label="select example" id="professor" 
                  name='professor'
                  data-index={index}
                  value={elem}
                  onChange={(e)=>funcs.handleChange(e)}>
                     <option value='Deutsch'>Deutsch</option>
                     <option value="English">English</option>
                  </select>
               </div>
               <div className="col-auto d-flex align-items-center align-items-md-end justify-content-end">
                  <div className="btn btn-danger"
                  data-name='professor'
                  data-index={index} onClick={(e)=>funcs.deleteField(e)}>x</div>
               </div>
            </div>
            )
            return content
         })

         let mediaElement = '';
         switch(media.type){
            case 'image':
               mediaElement = (<img src={media.link} className='mb-3' width={'100%'} alt="" />)
               break;
            case 'video':
               mediaElement = (
                  <video width={'100%'} className='mb-3' controls preload="metadata">
                     <source src={media.link} type="video/mp4"/>
                     Your browser does not support the video tag.
                  </video>
               )
               break;
         }


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
         return (
            <div style={style}>
               <div class="container" ref={c=>funcs.rootElem = c}>
               <i class="bi bi-arrow-left" style={closeIconStyle} onClick={()=>props.funcs.deselectHuman()}></i>
                  <div class="row">
                     <div class="col d-flex justify-content-center">
                        <h1 class='my-5'>{props.info.mode === 'add' ? 'Додати' : 'Редагувати'} медіа</h1>
                     </div>
                  </div>
                  <div class="row">
                     <div class="col">
                        <form action="" id='form' class="needs-validation" ref={funcs.form} noValidate>
                           <div class="mb-4">
                              <label htmlFor="name" class="form-label">Ім'я</label>
                              <input type="text" class="form-control" id="name" name='name' placeholder="" required value={name} onChange={(e)=>funcs.handleChange(e)}/>
                           </div>
                           <div class="row">
                              <div class="col-12 col-md-6">
                                 <div class="mb-4">
                                    <label htmlFor="photo" class="form-label">Медіафайл</label><br/>
                                    {mediaElement}
                                    <input class="form-control" type="file" id="media" name='media' accept="image/png, image/jpeg, video/mp4"/>
                                 </div>
                              </div>
                           </div>
                           <div class="mb-4">
                              <label htmlFor="about" class="form-label">Опис</label>
                              <textarea rows='10' class="form-control" id="about" name='about' value={about} onChange={(e)=>funcs.handleChange(e)} required></textarea>
                           </div>
                           <div class="mb-5">
                              <label class="form-label mb-2">Professor</label>
                              {professorElem}
                              <div class="btn btn-success" onClick={()=>funcs.addField('professor', 2)}>Додати Школу</div>
                           </div>
                        </form>
                     </div>
                  </div>
                  <div class="row justify-content-end">
                     <div class="col-6 col-md-auto">
                        <div class="btn btn-danger btn-lg btn-block px-5 py-3 my-5" id="submit" onClick={()=>funcs.delStudent()}>Видалити <i class="bi bi-trash"></i></div>
                     </div>
                     <div className="col-6 col-md-auto">
                        <div class="btn btn-primary btn-lg btn-block px-5 py-3 my-5" id="submit" onClick={()=>funcs.sendData()}>Зберегти <i class="bi bi-check-square"></i></div>
                     </div>
                     <div className="col d-none ">
                        <div class="btn btn-success my-5" id="get" onClick={()=>funcs.checkInfo('')}>Get Info</div>
                     </div>
                  </div>
               </div>
            </div>
         );
      }