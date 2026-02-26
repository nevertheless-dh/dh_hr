/* 공통 TTS 모듈 - Web Speech API */
(function(){
  const LANG='ko-KR';
  const RATE=1.0;
  const PITCH=1.0;
  let currentUtterance=null;
  let isPaused=false;

  function getVoice(){
    const voices=speechSynthesis.getVoices();
    return voices.find(v=>v.lang===LANG)||voices.find(v=>v.lang.startsWith('ko'))||voices[0];
  }

  function speak(text,btn){
    if(speechSynthesis.speaking&&!isPaused){
      speechSynthesis.cancel();
      resetBtn(btn);
      return;
    }
    if(isPaused){
      speechSynthesis.resume();
      isPaused=false;
      if(btn){btn.textContent='\\u23F8 일시정지';btn.classList.add('playing');}
      return;
    }
    const utt=new SpeechSynthesisUtterance(text);
    utt.lang=LANG;
    utt.rate=RATE;
    utt.pitch=PITCH;
    utt.voice=getVoice();
    utt.onend=()=>resetBtn(btn);
    utt.onerror=()=>resetBtn(btn);
    currentUtterance=utt;
    if(btn){btn.textContent='\\u23F8 일시정지';btn.classList.add('playing');}
    speechSynthesis.speak(utt);
  }

  function pause(btn){
    if(speechSynthesis.speaking&&!isPaused){
      speechSynthesis.pause();
      isPaused=true;
      if(btn){btn.textContent='\\u25B6 계속 재생';btn.classList.remove('playing');}
    }
  }

  function stop(btn){
    speechSynthesis.cancel();
    isPaused=false;
    resetBtn(btn);
  }

  function resetBtn(btn){
    if(btn){btn.textContent='\\u25B6 음성 재생';btn.classList.remove('playing');}
    isPaused=false;
  }

  function toggle(text,btn){
    if(speechSynthesis.speaking&&!isPaused){
      pause(btn);
    }else if(isPaused){
      speak(text,btn);
    }else{
      speak(text,btn);
    }
  }

  /* 전체 재생 - 여러 섹션 순차 재생 */
  function speakAll(sections,btn){
    if(speechSynthesis.speaking){speechSynthesis.cancel();resetBtn(btn);return;}
    const allText=sections.map(s=>{
      const el=document.getElementById(s);
      return el?el.innerText.trim():'';
    }).filter(Boolean).join('.\n\n');
    speak(allText,btn);
  }

  window.TTS={speak,pause,stop,toggle,speakAll,resetBtn};
  if(speechSynthesis.onvoiceschanged!==undefined){speechSynthesis.onvoiceschanged=getVoice;}
})();
