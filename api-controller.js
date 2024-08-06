//const userData = PropertiesService.getUserProperties();

//userData.setProperty('apiToken', null);




function getToken(code) {

  const urlBase = 'https://www.bling.com.br/Api/v3/oauth/token';
  const clientId = '';
  const clientSecret = '';

  const credentials64 = Utilities.base64Encode(`${clientId}:${clientSecret}`);


  let options = {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    headers: {
      'Accept': '1.0',
      'Authorization': 'Basic ' + credentials64,
    },
    payload: {
      'grant_type': 'authorization_code',
      'code': code,
    }
  };

  
  const request = UrlFetchApp.fetch(urlBase,options);

  console.log(JSON.parse(request))

  
}

function refreshToken() {

  const urlBase = 'https://www.bling.com.br/Api/v3/oauth/token';
  const clientId = '0312b2f7b97fe8cdbb1d76056f880cd201abf33b';
  const clientSecret = '8c65b6a703a992eefa4d20c3c376b421f4d1e97a7d55cc5ecc7b3622fa21';
  const refresh = '996c5d1c58ef53a6ee9dadcf09242ddbc7fade5f';

  const credentials64 = Utilities.base64Encode(`${clientId}:${clientSecret}`);


  let options = {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    headers: {
      'Accept': '1.0',
      'Authorization': 'Basic ' + credentials64,
    },
    payload: {
      'grant_type': 'refresh_token',
      'refresh_token': refresh,
    }
  };

  
  const request = UrlFetchApp.fetch(urlBase,options);

  console.log(JSON.parse(request))
}



function getOrders(){

   const s = SpreadsheetApp.openById('1-IhuLHr1KVWjVN2PJEHdrXXxNYKHOotk8FPTb4PvJeo');
  const ss = s.getSheetByName('Sheet1');
  const lastDay = new Date(ss.getRange(ss.getLastRow(),11).getValue()) ;
  const lista = ss.getRange(1,4,ss.getLastRow(), 1).getValues();

const lastDayFormat = `${lastDay.getFullYear()}-${(lastDay.getMonth()+1).toString().padStart(2,'0')}-${lastDay.getDate()}`;

  const token = '6fec31633f95c60ac10916f2693351998b112e0c';
  const urlBase = 'https://www.bling.com.br/Api/v3/pedidos/vendas?';
  let page = 1;

  while(true){
    var options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+ token,
      }
    }

    let parameters ={
      'pagina' : page,
      'idsSituacoes[]' : '78023',
      'dataInicial' : '2023-11-01',
      'dataFinal' : lastDayFormat,
    } 

    let queryString = Object.keys(parameters).map(key=>{return `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`}).join('&');

    let request = UrlFetchApp.fetch(urlBase+queryString,options);
    let response = JSON.parse(request.getContentText()).data;
    Utilities.sleep(300);
    response.forEach(pedido=>{
     // Utilities.sleep(300);
      if(lista.filter(numero => pedido.numero == numero).length<1){
        getOrder(pedido.id);
      }
      
    });

    page++

  }

}

function getOrder(id){
  const token = '6fec31633f95c60ac10916f2693351998b112e0c';
  const urlBase = 'https://www.bling.com.br/Api/v3/pedidos/vendas/'+id;

  const loja={
    "204130807": "Mercado Livre",
    "204620977": "Shopee",
    "204555211": "Magalu",
    "204659884": "Shein",
  };
  


    var options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+ token,
        'Accept': 'application/json',
      }
    }
  /*
    let parameters ={
      'pagina' : page,
      'idSituacoes[]' : '78023',
      'dataInicial' : '2023-11-01',
      'dataFinal' : '2023-12-31',
    } 

    let queryString = Object.keys(parameters).map(key=>{return `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`}).join('&');

  */

    let request = UrlFetchApp.fetch(urlBase,options);
    let response = JSON.parse(request.getContentText()).data;
    
    let contato = getContato(response.contato.id);

    let data = {
      canal: loja[response.loja.id],
      cliente: contato.nome,
      documento: contato.numeroDocumento,
      pedido: response.numero,
      produtos: response.itens.map(item=> {return item.descricao} ).join(', '),
      valor: response.totalProdutos,
      telefone: contato.telefone ?? contato.celular,
      email: contato.email,
      endereco: `${response.transporte.etiqueta.endereco}, ${response.transporte.etiqueta.numero}`,
      cidade: `${response.transporte.etiqueta.municipio}/${response.transporte.etiqueta.uf}`,
      data: response.data
    }

    fillFile(data);

}


function getContato(id){
  const token = '6fec31633f95c60ac10916f2693351998b112e0c';
  const urlBase = 'https://www.bling.com.br/Api/v3/contatos/'+id;
   var options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+ token,
        'Accept': 'application/json',
      }
    }

  let response = UrlFetchApp.fetch(urlBase,options);

 return JSON.parse(response.getContentText()).data;


}

function fillFile(data){



  const s = SpreadsheetApp.openById('1-IhuLHr1KVWjVN2PJEHdrXXxNYKHOotk8FPTb4PvJeo');
  const ss = s.getSheetByName('Sheet1');
  const lista = ss.getRange(1,4,ss.getLastRow(), 1).getValues();


  let filtered = lista.filter(id=> id == data.pedido);


  if (filtered.length < 1){
    ss.appendRow([data.canal,data.cliente, data.documento, data.pedido, data.produtos, data.valor, data.endereco, data.cidade, data.email, data.telefone, data.data ]);
  }
  

}

/**
 * status dos pedidos
 *
 * {"data":[{"id":6,"nome":"Em aberto","idHerdado":0,"cor":"#E9DC40"},{"id":9,"nome":"Atendido","idHerdado":0,"cor":"#3FB57A"},{"id":12,"nome":"Cancelado","idHerdado":0,"cor":"#CBCBCB"},{"id":15,"nome":"Em andamento","idHerdado":0,"cor":"#0065F9"},{"id":18,"nome":"Venda Agenciada","idHerdado":0,"cor":"#FF7835"},{"id":21,"nome":"Em digita\u00e7\u00e3o","idHerdado":0,"cor":"#FF66E3"},{"id":24,"nome":"Verificado","idHerdado":0,"cor":"#85F39E"},{"id":69261,"nome":"Separa\u00e7\u00e3o","idHerdado":15,"cor":"#f58f00"},{"id":71998,"nome":"Full","idHerdado":9,"cor":"#ad1fe0"},{"id":78023,"nome":"Finalizado","idHerdado":9,"cor":"#000000"},{"id":88635,"nome":"Faturado","idHerdado":15,"cor":"#ff3838"},{"id":88679,"nome":"A Enviar","idHerdado":15,"cor":"#16bd00"}]}
 */

function getSituacoes(){
  const token = '6fec31633f95c60ac10916f2693351998b112e0c';
  const urlBase = 'https://www.bling.com.br/Api/v3/situacoes/modulos/98310';
  var options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+ token,
      }
    }

    let response = UrlFetchApp.fetch(urlBase,options);
    
}
