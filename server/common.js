export const BasicDoc = {
  new: function(doc,_type,_collection){
    const obj = {
      _type,
      _collection,
      _rev: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    Object.assign(doc, obj);
    return doc;
  },

  set: function(doc){
    const obj = {
      updatedAt: new Date(),
    }
    if(isNaN(doc._rev)){
      doc._rev = 1;
    }else{
      doc._rev++;
    }
    Object.assign(doc, obj);
    return doc;
  },
}

export const sameDate = (first, second) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth()    === second.getMonth()    &&
    first.getDate()     === second.getDate()
  );
}
  
export const sameYearMonth = (first, second) => {
  return(
    first.getFullYear() === second.getFullYear() &&
    first.getMonth()    === second.getMonth() );
}

export function parseBetween(open, close, content){
  const start = content.indexOf(open);
  const end   = content.indexOf(close, start+open.length);

  if(start === -1 || end === -1) return '';
  return content.substring(start+open.length, end);
}

export function buildFields(arr, include=1){
  let fields = {};
  arr.forEach(field => { fields[field] = include; });
  return fields;
}
