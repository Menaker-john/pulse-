export function toBytes(str){
	let   coef  = 1;
	const num   = str.replace(/[^0-9.]/g, '');
  const names = ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB','KB','MB','GB','TB','PB','EB','ZB','YB'];
  names.forEach((name,i) => {
  	if(str.toLowerCase().includes(name.toLowerCase())){
    	coef = Math.pow(i>names.length/2?1000:1024, i%(names.length/2)+1);
    }
  });
  
  return coef * num;
}

export function namedBytes(bytes, binary){
	const base  = binary?1024:1000;
	let   names = binary?['B','KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB']:['B','KB','MB','GB','TB','PB','EB','ZB','YB'];
  const format = (power) => { return `${fixed(bytes / Math.pow(base, power))} ${names[power]}`; }
	
  for(let i = 1; i < names.length; i++){
    if(bytes < Math.pow(base, i)){ return format(i-1); }
  }
  return format(names.length-1);
}

function fixed(num, n = 2, x){
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return Number(num).toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
}

export const whyDidYouUpdate = (prevProps, prevState) => {
  Object.entries(this.props).forEach(([key, val]) =>
    prevProps[key] !== val && console.log(`Prop '${key}' changed`)
  );
  if (this.state) {
    Object.entries(this.state).forEach(([key, val]) =>
      prevState[key] !== val && console.log(`State '${key}' changed`)
    );
  }
}

export const Methods = {
  Meteor: function(name, params = []){
    return new Promise((resolve, reject) => {
      Meteor.apply(name, params, {noRetry:true}, (err, result) => {
        if(!err){ resolve(result); }else{
          reject(err.toString());
        }
      });
    });
  },
};

function isStr(str, notempty){
  return typeof str === 'string' && (notempty? str !== '':true);
};

export function wordsInString(words, str){
  let check = true;
	if(!isStr(words) || !isStr(str)) return false;

  str = str.toLowerCase();
  words = words.toLowerCase();
  let checkWords = words.split(/\s+/);

  checkWords.forEach((item) =>{
    if(str.indexOf(item) === -1) check = false;
  });

  return check;
}