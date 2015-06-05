module.exports = function(url){
  return new Promise(function(resolve, reject){
    var req = new XMLHttpRequest();
    req.addEventListener('load', function(){
      resolve(this.responseText);
    });
    req.addEventListener('error', function(){
      reject(this.statusText);
    });
    req.responseType = 'text';
    req.open('GET', url, true);
    req.send();
  });
};
