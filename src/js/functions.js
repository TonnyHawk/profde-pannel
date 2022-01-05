export function sortArr(arr, filter){ // sorting arr items by 'order' property and filter value
   let newArr = []
   let ordered = []
   let unordered = []

   // separating ordered and unordered items
   arr.forEach(elem=>{
         // if(Object.keys(elem).length > 0){
         if(typeof elem.order !== 'undefined'){
            ordered.push(elem)
         }else{
            unordered.push(elem)
         }
   })

   if(ordered.length > 0){
      // sorting an ordered list
      newArr = ordered.sort((a, b)=>{
         if(typeof a.order[filter] !== 'undefined'){
            return a.order[filter] - b.order[filter]
         }else return false;
      })
   }

   if(unordered.length > 0){
      unordered = unordered.map(elem=>{
         elem.order = {}
         return elem
      })
   }

   newArr = [...newArr, ...unordered]

   return newArr
}

export const toBase64 = file => new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => resolve(reader.result);
   reader.onerror = error => reject(error);
});