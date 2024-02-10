import React, { Component } from 'react';
import './Loader.css'

class Loader extends Component {
   render() {
      return (
         <div class="loader" id="loader">
            <div class="loader__bg"></div>
            <div class="loader__content">
               <div class="loader__spinner spinner loadingio-spinner-rolling-c55z9beacq">
                  <div class="ldio-tam1aegang">
                     <div></div>
                  </div>
               </div>
               <p className="loader__text">{this.props.message}</p>
            </div>
         </div>
      );
   }
}

export default Loader;