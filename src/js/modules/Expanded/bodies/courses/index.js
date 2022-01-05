import React from 'react';
import SemanticDropdown from '../../../../components/SemanticDropdown'

export default function CoursesBody(properties){
   let {state, props, funcs} = properties
   let {name, themes, professor, about, features, id} = state
   // creating professor element
   let professorElem = professor.map((elem, index)=>{
      return(
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
         <div className="col-auto">
            <div className="btn btn-danger"
            data-name='professor'
            data-index={index} onClick={(e)=>funcs.deleteField(e)}>x</div>
         </div>
      </div>
      )
   })

   let featuresElem = features.map((elem, index)=>{
      let image = '';
      if(elem.photo !== '') image = <img src={elem.photo} className='mb-3' alt="" />
      return (
         <>
         {image}
      <div className="row mb-3">
         <div className="col-auto d-flex align-items-center align-items-md-end justify-content-start">
            <p>{index+1}.</p>
         </div>
         <div className="col">
            <div className="row">
               <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <label class="form-sublabel">Значок (картинка)</label>
                  <input type="file" class="form-control" name={`feature-${index}`} required onChange={(e)=>funcs.handleChange(e)} accept="image/png, image/jpeg, image/svg"/>
               </div>
               <div className="col-12 col-md-6">
                  <label class="form-sublabel">Текст</label>
                  <input type="text" data-index={index} class="form-control" data-name='features' name='text' placeholder="" required value={elem.text} onChange={(e)=>funcs.handleChange(e)}/>
               </div>
            </div>
         </div>
         <div className="col-auto d-flex align-items-center align-items-md-end justify-content-end">
            <div className="btn btn-danger"
               data-name='features'
               data-index={index} onClick={(e)=>funcs.deleteField(e)}>x</div>
         </div>
      </div>
      </>)
   })

   let style = {
      zIndex: 100, 
      position: 'fixed', 
      top: 0, left: 0, 
      width: '100%', height: '100%', 
      background: 'white', fontSize: '16px',
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
                  <h1 class='my-5'>{props.info.mode === 'add' ? 'Додати' : 'Редагувати'} курс</h1>
               </div>
            </div>
            <div class="row">
               <div class="col">
                  <form action="" id='form' class="needs-validation" ref={funcs.form} noValidate>
                     <div class="mb-4">
                        <label htmlFor="name" class="form-label">Назва</label>
                        <input type="text" class="form-control" id="name" name='name' placeholder="" required value={name} onChange={(e)=>funcs.handleChange(e)}/>
                     </div>
                     <div class="mb-5">
                        <label class="form-label mb-2">Professor</label>
                        {professorElem}
                        <div class="btn btn-success" onClick={()=>funcs.addField('professor', 2)}>Додати Школу</div>
                     </div>
                     <div class="mb-4">
                        <label class="form-label">Про Курс</label>
                        <textarea rows='10' type="text" class="form-control" id="about" name='about' placeholder="" required value={about} onChange={(e)=>funcs.handleChange(e)}/>
                     </div>
                     <div className="mb-4">
                        <label class="form-label">Короткі деталі курсу</label><br/>
                        {featuresElem}
                        <div class="btn btn-success" onClick={()=>funcs.addField('features')}>Додати особливість</div>
                     </div>
                     <div class="mb-4">
                        <label class="form-label">Теми усного мовлення</label>
                        <textarea rows='10' type="text" class="form-control" data-name='themes' name='content' data-index={0} placeholder="" required value={themes[0].content} onChange={(e)=>funcs.handleChange(e)}/>
                     </div>
                     <div class="mb-4">
                        <label class="form-label">Теми граматики</label>
                        <textarea rows='10' type="text" class="form-control" data-name='themes' name='content' data-index={1} placeholder="" required value={themes[1].content} onChange={(e)=>funcs.handleChange(e)}/>
                     </div>
                     <div className="mb-4">
                        <label class="form-label">Підручники</label>
                        {<SemanticDropdown funcs={funcs}/>}
                     </div>
                  </form>
               </div>
            </div>
            <div class="row justify-content-end">
               <div class="col-6 col-md-auto">
                  <div class={`expanded-action btn btn-danger btn-lg btn-block px-5 py-3 my-5 ${id === null ? 'd-none' : ''}`} id="submit" onClick={()=>funcs.delStudent()}>Видалити <i class="bi bi-trash"></i></div>
               </div>
               <div className="col-6 col-md-auto">
                  <div class="expanded-action btn btn-primary btn-lg btn-block px-5 py-3 my-5" id="submit" onClick={()=>funcs.sendData()}>Зберегти <i class="bi bi-check-square"></i></div>
               </div>
               <div className="col d-none ">
                  <div class="expanded-action btn btn-success my-5" id="get" onClick={()=>funcs.checkInfo('')}>Get Info</div>
               </div>
            </div>
         </div>
      </div>
   );
}