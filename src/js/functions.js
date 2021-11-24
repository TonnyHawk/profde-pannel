export function sortArr(arr, filter){ // sorting arr items by 'order' property and filter value
   let newArr = []
   let length = arr.length;
   // for(let i = 0; i < length; i++){
   //    let foundIndex = arr.findIndex(elem=>elem.order[filter] === i);
   //    newArr.push(arr[foundIndex])
   // }
   newArr = arr.sort((a, b)=>{
      return a.order[filter] - b.order[filter]
   })

   return newArr
}