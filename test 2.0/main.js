
/* main.js - logic for navigation, samu and chatbot */
function ligarSamu(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      alert('Localização detectada:\nLatitude: '+lat+'\nLongitude: '+lon+'\nLigue para 192 e informe sua posição.');
      // in real app we could open a tel: link but browsers may block it in desktop env
      window.location.href = 'tel:192';
    }, err=>{
      alert('Não foi possível obter sua localização. Ligue para 192.');
    }, {timeout:8000});
  } else {
    alert('Geolocalização não suportada neste dispositivo. Ligue para 192.');
  }
}

/* Chat logic */
const chatDefaults = {
  initial: 'Você está conectado ao atendimento do Saúde Fácil. Como posso ajudar?'
};

function startChat(){
  window.location.href = 'chat.html';
}

/* Simple keyword-based responder */
function botResponse(text){
  text = (text||'').toLowerCase();
  if(!text) return "Desculpe, não entendi. Pode reformular?";
  if(text.includes('mal') || text.includes('doente') || text.includes('passando mal')){
    return "Mantenha a calma. Respire devagar. Deseja acionar o SAMU agora?";
  }
  if(text.includes('queim') || text.includes('queimadura')){
    return "Para queimaduras: resfrie a área com água corrente por 10-20 minutos. Não aplique pomadas.";
  }
  if(text.includes('engasgo') || text.includes('asfixia')){
    return "Se a pessoa não consegue respirar, faça a manobra de Heimlich. Chame ajuda imediatamente.";
  }
  if(text.includes('queda') || text.includes('fratura')){
    return "Evite movimentar a vítima. Controle sangramentos, se houver, e chame o SAMU.";
  }
  if(text.includes('sim') && text.includes('samu')){
    return "Entendido. Se estiver em risco, ligue imediatamente para 192. Deseja enviar sua localização?";
  }
  if(text.includes('sim') && text.length<6){
    return "Ok. Deseja que eu ligue para o SAMU?";
  }
  if(text.includes('video') || text.includes('vídeo')){
    return "Veja vídeos simples de primeiros socorros na nossa seção de orientações (ou YouTube).";
  }
  return "Posso ajudar com orientações rápidas (queimadura, engasgo, desmaio, queda). Qual o problema?";
}

/* chat page functions */
function enviarChat(){
  const input = document.getElementById('chat-input-field');
  const val = input.value.trim();
  if(!val) return;
  adicionarMsg('user', val);
  input.value = '';
  setTimeout(()=> adicionarMsg('bot', botResponse(val)), 700);
}

function adicionarMsg(tipo, texto){
  const box = document.getElementById('chat-box');
  const el = document.createElement('div');
  el.className = 'msg ' + tipo;
  el.innerText = texto;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

/* small helper for orientation card clicks */
function openOrientacao(key){
  if(key === 'emergencia'){
    alert('Em caso de emergência: ligue 192. Se possível, inicie o atendimento virtual.');
  } else if(key === 'videos'){
    window.open('https://www.youtube.com/results?search_query=primeiros+socorros','_blank');
  } else {
    alert('Conteúdo: ' + key);
  }
}

window.addEventListener('DOMContentLoaded', ()=>{
  // if we're on chat.html, prefill initial message
  if(location.pathname.endsWith('chat.html')){
    adicionarMsg('bot', chatDefaults.initial);
  }
});
