/**
 * Usuário atual
 */
const  currentUser = PropertiesService.getUserProperties();



/**
 * função Get
 * @Params {Object} e -  Objeto recebido pelo método Get.
 * 
 * @returns {}
 */
function doGet(e) {
  if(e){
    console.log(e);
    let code = e.parameter.hasOwnProperty('code')? e.parameter.code : null;
    console.log(code);
    if(code)  getToken(code);
  }
  return loadPage('Index','');
}
/**
 * função Post
 * @Pram {Object} e - Objeto recebido pelo método Post.
 */
function doPost(e){
  if(e){
    
    
    Logger.log(e.parameter)

    let action = e.parameter.hasOwnProperty('submitRegister') ? 'register' : 'login';

    console.log(action);  

  } else{
    console
  }

  return loadPage('Index','');

}

function loadScript(){
  return loadPart("script");
}
function loadStyle(){
  return loadPart('style');
}
