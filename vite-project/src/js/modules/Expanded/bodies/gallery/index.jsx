import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

export default function GalleryBody(properties) {
  let { state, props, funcs } = properties;
  let { name, media, about, professor, id, showcase } = state;

  // creating professor element
  let professorElem = professor.map((elem, index) => {
    let content = (
      <div class="row professor-elem mb-3" data-name="professor">
        <div class="col">
          <select
            class="form-select"
            aria-label="select example"
            id="professor"
            name="professor"
            data-index={index}
            value={elem}
            onChange={(e) => funcs.handleChange(e)}
          >
            <option value="Deutsch">Deutsch</option>
            <option value="English">English</option>
          </select>
        </div>
        <div className="col-auto d-flex align-items-center align-items-md-end justify-content-end">
          <div
            className="btn btn-danger"
            data-name="professor"
            data-index={index}
            onClick={(e) => funcs.deleteField(e)}
          >
            x
          </div>
        </div>
      </div>
    );
    return content;
  });

  let mediaElement = '';
  switch (media.type) {
    case 'image':
      mediaElement = (
        <img src={media.link} className="mb-3" width={'100%'} alt="" />
      );
      break;
    case 'video':
      mediaElement = (
        <video width={'100%'} className="mb-3" controls preload="metadata">
          <source src={media.link} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
      break;
  }

  let showcaseElem = showcase.map((elem, index) => {
    return (
      <div className="row mb-3">
        <div className="col">
          <select
            class="form-select"
            aria-label="select example"
            id="professor"
            name="place"
            data-name="showcase"
            data-index={index}
            value={elem.place}
            onChange={(e) => funcs.handleChange(e)}
          >
            <option value={'null'}>Не визначено</option>
            <option value={'0'}>0</option>
            <option value={'1'}>1</option>
            <option value={'2'}>2</option>
            <option value={'3'}>3</option>
            <option value={'4'}>4</option>
            <option value={'5'}>5</option>
            <option value={'6'}>6</option>
            <option value={'7'}>7</option>
          </select>
        </div>
        <div className="col">
          <select
            class="form-select"
            aria-label="select example"
            id="professor"
            name="prof"
            data-name="showcase"
            data-index={index}
            value={elem.prof}
            onChange={(e) => funcs.handleChange(e)}
          >
            <option value="Deutsch">Deutsch</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>
    );
  });

  let style = {
    zIndex: 100,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'white',
    overflow: 'auto',
  };

  let closeIconStyle = {
    fontSize: '4rem',
    cursor: 'pointer',
  };

  let actionBtnStyle = {
    maxWidth: '100%',
  };
  return (
    <div style={style}>
      <div class="container" ref={(c) => (funcs.rootElem = c)}>
        <i
          class="bi bi-arrow-left"
          style={closeIconStyle}
          onClick={() => props.funcs.deselectHuman()}
        ></i>
        <div class="row">
          <div class="col d-flex justify-content-center">
            <h1 class="my-5">
              {props.info.mode === 'add' ? 'Додати' : 'Редагувати'} медіа
            </h1>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <form
              action=""
              id="form"
              class="needs-validation"
              ref={funcs.form}
              noValidate
            >
              <div class="mb-4">
                <label htmlFor="name" class="form-label">
                  Заголовок
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  name="name"
                  placeholder=""
                  value={name}
                  onChange={(e) => funcs.handleChange(e)}
                />
              </div>
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="mb-4">
                    <label htmlFor="photo" class="form-label">
                      Медіафайл{' '}
                      <strong className="seccond-text">
                        (.png, .jpg, .jpeg, mp4)
                      </strong>
                    </label>
                    <br />
                    {mediaElement}
                    <input
                      class="form-control"
                      type="file"
                      id="media"
                      name="media"
                      accept="image/png, image/jpeg, video/mp4"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <label htmlFor="about" class="form-label">
                  Опис
                </label>
                <textarea
                  rows="10"
                  class="form-control"
                  id="about"
                  name="about"
                  value={about}
                  onChange={(e) => funcs.handleChange(e)}
                ></textarea>
              </div>
              <div class="mb-5">
                <label class="form-label mb-2">Professor</label>
                {professorElem}
                <div
                  class="btn btn-success"
                  onClick={() => funcs.addField('professor', 2)}
                >
                  Додати Школу
                </div>
              </div>
              <div className="mb-5">
                <label class="form-label mb-2">
                  Місце на основній сторінці
                </label>
                <br />
                <img
                  src="/img/gallery-showcase-example.svg"
                  className="mb-2"
                  style={{ maxWidth: '30rem', width: '100%' }}
                  alt=""
                />
                {showcaseElem}
                <div
                  class="btn btn-success"
                  onClick={() => funcs.addField('showcase', 2)}
                >
                  Додати місце для іншої школи
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="row justify-content-end">
          <div class="col-6 col-md-auto">
            <div
              class={`expanded-action btn btn-danger btn-lg btn-block px-5 py-3 my-5 ${
                id === null ? 'd-none' : ''
              }`}
              id="submit"
              onClick={() => funcs.delStudent()}
            >
              Видалити <i class="bi bi-trash"></i>
            </div>
          </div>
          <div className="col-6 col-md-auto">
            <div
              class="expanded-action btn btn-primary btn-lg btn-block px-5 py-3 my-5"
              id="submit"
              onClick={() => funcs.sendData()}
            >
              Зберегти <i class="bi bi-check-square"></i>
            </div>
          </div>
          <div className="col d-none ">
            <div
              class="expanded-action btn btn-success my-5"
              id="get"
              onClick={() => funcs.checkInfo('')}
            >
              Get Info
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
