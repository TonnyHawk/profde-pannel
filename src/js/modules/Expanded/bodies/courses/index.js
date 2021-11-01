import React from 'react';
import SemanticDropdown from '../../../../components/SemanticDropdown'

export default function CoursesBody(properties){
   let {state, props, funcs} = properties
   let {name, themes, professor, about} = state
   let index = 0;
   // creating professor element
   let professorElem = professor.map(elem=>{
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
      index++;
      return content
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
                  <h1 class='my-5'>{props.info.mode === 'add' ? 'Додати' : 'Редагувати'}</h1>
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
                        <textarea type="text" class="form-control" id="about" name='about' placeholder="" required value={about} onChange={(e)=>funcs.handleChange(e)}/>
                     </div>
                     <div class="mb-4">
                        <label class="form-label">Теми усного мовлення</label>
                        <textarea type="text" class="form-control" data-name='themes' name='content' data-index={0} placeholder="" required value={themes[0].content} onChange={(e)=>funcs.handleChange(e)}/>
                     </div>
                     <div class="mb-4">
                        <label class="form-label">Теми граматики</label>
                        <textarea type="text" class="form-control" data-name='themes' name='content' data-index={1} placeholder="" required value={themes[1].content} onChange={(e)=>funcs.handleChange(e)}/>
                     </div>
                     <div className="mb-4">
                        {<SemanticDropdown funcs={funcs}/>}
                     </div>
                  </form>
               </div>
            </div>
            <div class="row">
               <div class="col d-flex justify-content-end">
                  <div class="btn btn-danger btn-lg px-5 py-3 my-5 mx-3" id="submit" onClick={()=>funcs.delStudent()}>Видалити</div>
                  <div class="btn btn-primary btn-lg px-5 py-3 my-5 mx-3" id="submit" onClick={()=>funcs.sendData()}>Додати</div>
                  <div class="btn btn-success my-5 d-none" id="get" onClick={()=>funcs.showInfo()}>Get Info</div>
               </div>
            </div>
         </div>
      </div>
   );
}