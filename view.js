
/**
 * LoadPage
 * 
 * Função para carregar página no WebApp
 * 
 * @param {String} [pageTemplate]- Nome do arquivo html que deseja carregar(caso não informado, carrega a página inicial);
 * @param {Object} [params]- Parametros a serem incluidos na página (Ex: nome do usuário atual)(Opcional);
 * 
 * @returns {Object}- um objeto htmlOutput
 */

function loadPage(pageTemplate='Index',params='') {
   Logger.log(pageTemplate);

 
  
  let page = HtmlService.createTemplateFromFile(pageTemplate);
  page.params = params;

  return  page.evaluate();
}

loadPage()

/**
 * Load Parts
 * 
 * Função para carregar dinamicaamente o conteúdo da página.
 * 
 * @param {String} partTemplate - Nome do arquivo html que deseja carregar dentro da página;
 * @param {Object} [params] - Parametros a serem incluidos na página (Ex: nome do usuário atual)(Opcional);
 * 
 * @returns  {String} - Conteúdo html do arquivo no format de String
 */
function loadPart(partTemplate, params=''){

  
  let part;

   part = HtmlService.createHtmlOutputFromFile(partTemplate) || ''; 

  part.params = params;

  return part.getContent();
}