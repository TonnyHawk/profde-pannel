export function sortArr(arr, filter){ // sorting arr items by 'order' property and filter value
   let newArr = []
   let ordered = []
   let unordered = []

   //splitting array on two types to avoid fails with undefined order property later
   arr.forEach(elem=>{
      if(Object.keys(elem).length > 0){
         ordered.push(elem)
      }else{
         unordered.push(elem)
      }
   })

   newArr = ordered.sort((a, b)=>{
      if(typeof a.order[filter] !== 'undefined'){
         return a.order[filter] - b.order[filter]
      }else return false;
   })

   newArr = [...newArr, ...unordered]

   return newArr
}