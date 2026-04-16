// NeuralHire JavaScript Module
// Extracted from app/index.html for better maintainability

// Global state
let recognition = null, isListening = false;
let mockRecognition = null, mockIsListening = false;
let currentAnswer = '', currentQuestion = '', currentMockQ = '';
let selectedCompany = 'General';
let selectedRole = 'General';
let selectedLevel = 'Mid-level';
let answerMode = 'concise';
let history = [], settings = {}, resumeText = '';

// Company Profile Database
const COMPANY_PROFILES = {
  'General': {
    name: 'General',
    values: ['Technical excellence', 'Clear communication', 'Problem-solving'],
    interviewStyle: 'Balanced technical and behavioral',
    emphasis: ['Fundamentals', 'Communication skills', 'Adaptability']
  },
  'Google': {
    name: 'Google',
    values: ['Focus on the user', 'Technical excellence', 'Fast iteration', 'Think big'],
    interviewStyle: 'Data-driven and structured with emphasis on algorithms',
    emphasis: ['Scalability', 'Algorithm complexity', 'System design', 'Data structures']
  },
  'Amazon': {
    name: 'Amazon',
    values: ['Customer obsession', 'Ownership', 'Bias for action', 'Learn and be curious', 'Earn trust'],
    interviewStyle: 'Leadership Principles focused with operational excellence',
    emphasis: ['Operational excellence', 'Metrics-driven decisions', 'Customer impact', 'Leadership examples']
  },
  'Microsoft': {
    name: 'Microsoft',
    values: ['Growth mindset', 'Customer focus', 'Diversity and inclusion', 'One Microsoft'],
    interviewStyle: 'Collaborative and structured with emphasis on teamwork',
    emphasis: ['Team collaboration', 'Technical depth', 'Customer scenarios', 'Learning agility']
  },
  'Startup': {
    name: 'Startup',
    values: ['Move fast', 'Resourcefulness', 'Impact over process', 'Ownership mentality'],
    interviewStyle: 'Practical and hands-on with focus on execution',
    emphasis: ['Getting things done', 'Adaptability', 'Wearing multiple hats', 'Impact measurement']
  }
};

let lastOnlineState = navigator.onLine;
try {
  history = JSON.parse(localStorage.getItem('nh_history') || '[]');
  settings = JSON.parse(localStorage.getItem('nh_settings') || '{}');
  resumeText = localStorage.getItem('nh_resume') || '';
  selectedRole = localStorage.getItem('nh_role') || 'General';
  selectedLevel = localStorage.getItem('nh_level') || 'Mid-level';
  selectedCompany = localStorage.getItem('nh_company') || 'General';
} catch(e) {}

let interimTranscript = '', finalTranscript = '';

let timerInterval = null;
let timerRemaining = 120;
let timerRunning = false;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 20;

// Utility functions
function $(id) { return document.getElementById(id); }
function $all(sel) { return document.querySelectorAll(sel); }
function safeText(el, text) { if(el) el.textContent = text; }
function safeHTML(el, html) { if(el) el.innerHTML = html; }
function safeClass(el, action, cls) { if(el) el.classList[action](cls); }

// Online status handling
function isOnline() { return navigator.onLine; }

function handleOnlineStatus() {
  const nowOnline = isOnline();
  if(nowOnline !== lastOnlineState) {
    lastOnlineState = nowOnline;
    if(nowOnline) { showToast('Back online', 'success'); }
    else { showToast('You are offline', 'error'); setStatus('Offline', 'error'); }
  }
}

window.addEventListener('online', handleOnlineStatus);
window.addEventListener('offline', handleOnlineStatus);

// Speech recognition functions
function checkSpeechSupport() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn = $('micBtn');
  const chromeBanner = $('chromeBanner');
  if(!SpeechRecognition) {
    setStatus('Speech not supported — use Chrome', 'error');
    if(micBtn) { micBtn.disabled = true; micBtn.style.opacity = '0.4'; }
    if(chromeBanner) chromeBanner.style.display = 'block';
  } else {
    if(chromeBanner) chromeBanner.style.display = 'none';
  }
}

function toggleListen() {
  if(!getApiKey()) { showToast('Add API key in Setup', 'error'); switchTab('setup'); return; }
  if(!isOnline()) { showToast('You are offline', 'error'); return; }
  if(isListening) {
    stopListening();
    showToast('Stopped listening', 'success');
    return;
  }
  startListening();
}

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition) { showToast('Use Chrome browser for voice', 'error'); return; }
  try { recognition = new SpeechRecognition(); } catch(e) { showToast('Failed to start', 'error'); return; }
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;
  finalTranscript = '';
  interimTranscript = '';
  
  recognition.onstart = () => {
    isListening = true;
    const micBtn = $('micBtn');
    const micLabel = $('micLabel');
    const liveBadge = $('liveBadge');
    const transcriptBox = $('transcriptBox');
    if(micBtn) { micBtn.textContent = 'STOP'; micBtn.classList.add('recording'); }
    if(micLabel) micLabel.textContent = 'Listening...';
    if(liveBadge) liveBadge.style.display = 'flex';
    if(transcriptBox) { transcriptBox.classList.add('show'); transcriptBox.textContent = '...'; }
    setStatus('Listening — speak clearly', '');
    animateFill(0, 60, 8000);
  };
  
  recognition.onresult = (event) => {
    interimTranscript = '';
    finalTranscript = '';
    for(let i = event.resultIndex; i < event.results.length; i++) {
      if(event.results[i].isFinal) { finalTranscript += event.results[i][0].transcript; }
      else { interimTranscript += event.results[i][0].transcript; }
    }
    const box = $('transcriptBox');
    const transcript = finalTranscript + interimTranscript;
    if(box) { 
      box.textContent = transcript || '...'; 
      box.className = 'transcript-box show' + (interimTranscript && !finalTranscript ? ' interim' : ''); 
    }
  };
  
  recognition.onerror = (e) => {
    isListening = false;
    switch(e.error) {
      case 'no-speech': setStatus('No speech detected', 'error'); break;
      case 'not-allowed': showToast('Mic access denied', 'error'); break;
      case 'network': showToast('Network error', 'error'); break;
      case 'aborted': break;
      default: setStatus('Error: ' + e.error, 'error');
    }
    resetMicUI();
  };
  
  recognition.onend = () => {
    if(isListening) {
      // Only process if we have a final transcript and user hasn't manually stopped
      const q = finalTranscript.trim();
      if(q) {
        isListening = false;
        resetMicUI();
        processQuestion(q);
      } else {
        // No speech detected, restart listening for continuous operation
        try { recognition.start(); } catch(e) {
          isListening = false;
          resetMicUI();
          setStatus('Mic error - tap again', 'error');
        }
      }
    }
  };
  
  try { recognition.start(); } catch(e) { showToast('Failed to start mic', 'error'); }
}

function stopListening() {
  isListening = false;
  if(recognition) {
    try {
      recognition.stop();
      // Process any captured speech before stopping
      const q = finalTranscript.trim();
      if(q) {
        processQuestion(q);
      }
    } catch(e) {}
  }
  resetMicUI();
}

function resetMicUI() {
  isListening = false;
  const micBtn = $('micBtn');
  const micLabel = $('micLabel');
  const liveBadge = $('liveBadge');
  const transcriptBox = $('transcriptBox');
  const timerDisplay = $('timerDisplay');
  stopTimer();
  if(timerDisplay) timerDisplay.classList.remove('active', 'warning', 'critical');
  if(micBtn) { micBtn.textContent = 'MIC'; micBtn.classList.remove('recording'); micBtn.classList.remove('thinking'); }
  if(micLabel) micLabel.textContent = 'Tap to listen';
  if(liveBadge) liveBadge.style.display = 'none';
  if(transcriptBox) transcriptBox.classList.remove('show');
}

// Timer functions
function getTimerDuration() {
  const el = $('timerDuration');
  return el ? parseInt(el.value) || 120 : 120;
}

function isTimerEnabled() {
  const el = $('timerToggle');
  return el ? el.checked : false;
}

function startTimer() {
  if(!isTimerEnabled()) return;
  const duration = getTimerDuration();
  timerRemaining = duration;
  timerRunning = true;
  const timerDisplay = $('timerDisplay');
  const timerToggleBtn = $('timerToggleBtn');
  if(timerDisplay) timerDisplay.classList.add('active');
  if(timerToggleBtn) timerToggleBtn.textContent = 'II';
  updateTimerDisplay();
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if(!timerRunning) return;
    timerRemaining--;
    updateTimerDisplay();
    if(timerRemaining <= 0) { 
      stopTimer(); 
      showToast('Time is up!', 'error'); 
      playTimerSound(); 
    }
  }, 1000);
}

function stopTimer() {
  timerRunning = false;
  if(timerInterval) { 
    clearInterval(timerInterval); 
    timerInterval = null; 
  }
  const timerToggleBtn = $('timerToggleBtn');
  if(timerToggleBtn) timerToggleBtn.textContent = '>';
}

function toggleTimer() {
  if(timerRunning) { 
    stopTimer(); 
  } else {
    if(timerRemaining <= 0) { 
      timerRemaining = getTimerDuration(); 
    }
    timerRunning = true;
    const timerToggleBtn = $('timerToggleBtn');
    if(timerToggleBtn) timerToggleBtn.textContent = 'II';
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if(!timerRunning) return;
      timerRemaining--;
      updateTimerDisplay();
      if(timerRemaining <= 0) { 
        stopTimer(); 
        showToast('Time is up!', 'error'); 
        playTimerSound(); 
      }
    }, 1000);
  }
}

function resetTimer() {
  stopTimer();
  timerRemaining = getTimerDuration();
  updateTimerDisplay();
  const timerDisplay = $('timerDisplay');
  if(timerDisplay) { 
    timerDisplay.classList.remove('warning', 'critical'); 
  }
}

function updateTimerDisplay() {
  const timerText = $('timerText');
  const timerLabel = $('timerLabel');
  const timerRingFill = $('timerRingFill');
  const timerDisplay = $('timerDisplay');
  const mins = Math.floor(timerRemaining / 60);
  const secs = timerRemaining % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
  
  if(timerText) timerText.textContent = timeStr;
  const duration = getTimerDuration();
  const progress = timerRemaining / duration;
  const offset = TIMER_CIRCUMFERENCE * (1 - progress);
  
  if(timerRingFill) { 
    timerRingFill.style.strokeDashoffset = offset; 
  }
  
  const isWarning = timerRemaining <= 30 && timerRemaining > 10;
  const isCritical = timerRemaining <= 10;
  
  if(timerDisplay) { 
    timerDisplay.classList.toggle('warning', isWarning || isCritical); 
  }
  
  if(timerText) { 
    timerText.classList.toggle('warning', isWarning || isCritical); 
  }
  
  if(timerLabel) { 
    timerLabel.classList.toggle('warning', isWarning || isCritical);
    timerLabel.textContent = isCritical ? 'HURRY!' : isWarning ? 'LOW TIME' : 'ANSWER TIMER';
  }
  
  if(timerRingFill) { 
    timerRingFill.classList.toggle('warning', isWarning || isCritical);
    timerRingFill.style.stroke = (isCritical || isWarning) ? 'var(--rose)' : 'var(--amber)';
  }
}

function playTimerSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch(e) {}
}

// PDF handling
async function handlePdfUpload(event) {
  const input = event.target;
  const file = input?.files?.[0];
  if(!file) return;
  if(file.type !== 'application/pdf') { 
    showToast('Please upload a PDF file', 'error'); 
    return; 
  }
  if(file.size > 10 * 1024 * 1024) { 
    showToast('PDF too large — max 10MB', 'error'); 
    return; 
  }
  
  setStatus('Reading PDF...', '');
  if(typeof pdfjsLib === 'undefined') { 
    showToast('PDF reader not loaded', 'error'); 
    setStatus('', ''); 
    return; 
  }
  
  try {
    const ab = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    if(pdf.numPages === 0) { 
      throw new Error('PDF has no pages'); 
    }
    
    let text = '';
    const maxPages = Math.min(pdf.numPages, 8);
    
    for(let i = 1; i <= maxPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str || '').join(' ');
        text += pageText + '\n';
      } catch(e) {}
    }
    
    text = text.trim();
    
    if(!text || text.length < 50) { 
      showToast('Scanned PDF detected. Please use a text-layer PDF.', 'error'); 
      setStatus('', ''); 
      return; 
    }
    
    resumeText = text;
    try { 
      localStorage.setItem('nh_resume', text); 
      localStorage.setItem('nh_resumename', file.name); 
    } catch(e) { 
      showToast('Storage full', 'error'); 
      return; 
    }
    
    const resumeTextEl = $('resumeText');
    const pdfPreview = $('pdfPreview');
    
    if(resumeTextEl) resumeTextEl.value = text;
    if(pdfPreview) pdfPreview.style.display = 'block';
    showPdfSuccess(file.name);
    
    showToast('Resume uploaded!', 'success');
    setStatus('Resume loaded', 'success');
    
  } catch(e) { 
    showToast('PDF read failed', 'error'); 
    setStatus('', ''); 
  }
}

function showPdfSuccess(name) {
  const pdfDrop = $('pdfDrop');
  const pdfSuccess = $('pdfSuccess');
  const pdfName = $('pdfName');
  
  if(pdfDrop) pdfDrop.style.display = 'none';
  if(pdfSuccess) pdfSuccess.classList.add('show');
  if(pdfName) pdfName.textContent = name;
}

function clearPdf() {
  resumeText = '';
  try { 
    localStorage.removeItem('nh_resume'); 
    localStorage.removeItem('nh_resumename'); 
  } catch(e) {}
  
  const pdfDrop = $('pdfDrop');
  const pdfSuccess = $('pdfSuccess');
  const pdfPreview = $('pdfPreview');
  const resumeTextEl = $('resumeText');
  const pdfInput = $('pdfInput');
  
  if(pdfDrop) pdfDrop.style.display = 'block';
  if(pdfSuccess) pdfSuccess.classList.remove('show');
  if(pdfPreview) pdfPreview.style.display = 'none';
  if(resumeTextEl) resumeTextEl.value = '';
  if(pdfInput) pdfInput.value = '';
  
  showToast('Resume cleared', '');
}

// Mock interview functions
function toggleMockListen() {
  const btn = $('mockMicBtn');
  if(mockIsListening) {
    mockIsListening = false;
    if(mockRecognition) { 
      try { mockRecognition.stop(); } catch(e) {} 
    }
    if(btn) { 
      btn.textContent = 'VOICE'; 
      btn.style.color = ''; 
    }
    const status = $('mockTranscriptStatus');
    if(status) status.textContent = '';
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition) { 
    showToast('Use Chrome for voice', 'error'); 
    return; 
  }
  
  try { 
    mockRecognition = new SpeechRecognition(); 
  } catch(e) { 
    showToast('Failed to start', 'error'); 
    return; 
  }
  
  mockRecognition.continuous = true;
  mockRecognition.interimResults = true;
  mockRecognition.lang = 'en-US';
  
  mockRecognition.onresult = (e) => {
    const mockFinal = Array.from(e.results).filter(r => r.isFinal).map(r => r[0].transcript).join(' ');
    const mockAnswer = $('mockAnswer');
    const status = $('mockTranscriptStatus');
    const transcript = mockFinal || Array.from(e.results).map(r=>r[0].transcript).join(' ');
    
    if(mockAnswer) mockAnswer.value = transcript;
    if(status) { 
      status.textContent = 'Listening...'; 
    }
  };
  
  mockRecognition.onend = () => {
    mockIsListening = false;
    if(btn) { 
      btn.textContent = 'VOICE'; 
      btn.style.color = ''; 
    }
    const status = $('mockTranscriptStatus');
    if(status) status.textContent = '';
  };
  
  mockRecognition.onerror = (e) => {
    mockIsListening = false;
    if(btn) { 
      btn.textContent = 'VOICE'; 
      btn.style.color = ''; 
    }
    if(e.error === 'not-allowed') { 
      showToast('Mic access denied', 'error'); 
    }
  };
  
  try { 
    mockRecognition.start(); 
    mockIsListening = true; 
    if(btn) { 
      btn.textContent = 'STOP'; 
      btn.style.color = 'var(--rose)'; 
    } 
  } catch(e) { 
    showToast('Failed to start', 'error'); 
  }
}

async function getMockQuestion() {
  if(!getApiKey()) { 
    showToast('Add API key in Setup', 'error'); 
    return; 
  }
  if(!isOnline()) { 
    showToast('You are offline', 'error'); 
    return; 
  }
  
  const btn = $('getQBtn');
  if(btn) btn.disabled = true;
  
  try {
    const typeEl = $('qType');
    const type = typeEl?.value || 'behavioral';
    
    const q = await callAIProvider([{ 
      role:'user', 
      content:`Generate ONE ${type} interview question. Return ONLY the question.` 
    }]);
    
    currentMockQ = q;
    const mockQuestion = $('mockQuestion');
    const mockAnswer = $('mockAnswer');
    const scoreSection = $('scoreSection');
    const modelAnswerCard = $('modelAnswerCard');
    
    if(mockQuestion) mockQuestion.textContent = q;
    if(mockAnswer) mockAnswer.value = '';
    if(scoreSection) scoreSection.style.display = 'none';
    if(modelAnswerCard) modelAnswerCard.style.display = 'none';
    
  } catch(e) { 
    showToast('Error: ' + (e.message || 'Failed'), 'error'); 
  } 
  finally { 
    if(btn) btn.disabled = false; 
  }
}

function selectCompany(el, company) {
  $all('#companyChips .chip').forEach(c => c.classList.remove('active'));
  if(el) el.classList.add('active');
  selectedCompany = company;
}

async function scoreMockAnswer() {
  if(!getApiKey()) { 
    showToast('Add API key in Setup', 'error'); 
    return; 
  }
  if(!isOnline()) { 
    showToast('You are offline', 'error'); 
    return; 
  }
  
  const answerEl = $('mockAnswer');
  const answer = answerEl?.value.trim() || '';
  
  if(!answer) { 
    showToast('Write or record your answer first', 'error'); 
    return; 
  }
  if(!currentMockQ) { 
    showToast('Get a question first', 'error'); 
    return; 
  }
  
  const btn = $('scoreBtn');
  if(btn) btn.disabled = true;
  
  try {
    const jobDescEl = $('jobDesc');
    const jd = jobDescEl?.value.trim() || '';
    
    const prompt = `Evaluate this interview answer. Score 1-10 on relevance, specificity, star format. Return ONLY valid JSON: {"relevance":7,"specificity":6,"star":7,"feedback":"2-3 sentences.","model_answer":"3-4 sentences."}
Question: "${currentMockQ}" ${jd ? `Role: ${jd}` : ''} Answer: "${answer}"`;
    
    const raw = await callAIProvider([{ 
      role:'user', 
      content:prompt 
    }], 'llama-3.1-8b-instant');
    
    const clean = raw.replace(/```json|```/g,'').trim();
    let scores;
    
    try { 
      scores = JSON.parse(clean); 
    } catch(e) { 
      throw new Error('Failed to parse response'); 
    }
    
    scores.relevance = Number(scores.relevance);
    scores.specificity = Number(scores.specificity);
    scores.star = Number(scores.star);
    
    if(isNaN(scores.relevance)) { 
      throw new Error('Invalid scores'); 
    }
    
    setScore('Rel', Math.max(1, Math.min(10, Math.round(scores.relevance))));
    setScore('Spec', Math.max(1, Math.min(10, Math.round(scores.specificity))));
    setScore('Star', Math.max(1, Math.min(10, Math.round(scores.star))));
    
    const feedbackText = $('feedbackText');
    const modelAnswerText = $('modelAnswerText');
    const scoreSection = $('scoreSection');
    const modelAnswerCard = $('modelAnswerCard');
    
    if(feedbackText) feedbackText.textContent = scores.feedback || 'No feedback';
    if(modelAnswerText) modelAnswerText.innerHTML = formatAnswer(scores.model_answer || 'No answer');
    if(scoreSection) scoreSection.style.display = 'flex';
    if(modelAnswerCard) modelAnswerCard.style.display = 'block';
    
    addToHistory({ 
      type:'mock', 
      question:currentMockQ, 
      answer:scores.model_answer, 
      scores, 
      time:Date.now(), 
      company:selectedCompany, 
      role:selectedRole, 
      level:selectedLevel 
    });
    
    updateStats();
    updateFooterStats();
    
  } catch(e) { 
    showToast('Scoring error — ' + (e.message || 'try again'), 'error'); 
  } 
  finally { 
    if(btn) btn.disabled = false; 
  }
}

function setScore(id, val) {
  const cls = val >= 8 ? 'high' : val >= 6 ? 'mid' : 'low';
  const el = $('score'+id);
  const fill = $('fill'+id);
  
  if(el) { 
    el.textContent = val+'/10'; 
    el.className = 'score-val ' + cls; 
  }
  if(fill) { 
    fill.style.width = (val*10)+'%'; 
    fill.className = 'score-fill ' + cls; 
  }
}

// Answer formatting and utilities
function formatAnswer(text) {
  if(!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
    .replace(/\n\n/g,'</p><p style="margin-top:8px">')
    .replace(/\n/g,'<br>');
}

function copyAnswer() {
  if(!currentAnswer) return;
  navigator.clipboard.writeText(currentAnswer)
    .then(() => { showToast('Copied!', 'success'); })
    .catch(e => { showToast('Failed to copy', 'error'); });
}

function copyModelAnswer() {
  const el = $('modelAnswerText');
  if(!el) return;
  navigator.clipboard.writeText(el.innerText)
    .then(() => { showToast('Copied!', 'success'); })
    .catch(e => { showToast('Failed', 'error'); });
}

function getScoreClass(val) {
  if(val >= 8) return 'high';
  if(val >= 6) return 'mid';
  return 'low';
}

function getScoreLabel(cls) {
  if(cls === 'high') return 'Excellent';
  if(cls === 'mid') return 'Good';
  return 'Needs Work';
}

function downloadScoreReport() {
  const scoreSection = $('scoreSection');
  if(!scoreSection || scoreSection.style.display === 'none') { 
    showToast('Complete a mock first', 'error'); 
    return; 
  }
  
  const rel = $('scoreRel')?.textContent?.replace('/10','') || '—';
  const spec = $('scoreSpec')?.textContent?.replace('/10','') || '—';
  const star = $('scoreStar')?.textContent?.replace('/10','') || '—';
  const feedback = $('feedbackText')?.innerText || '';
  const modelAnswer = $('modelAnswerText')?.innerText || '';
  const userAnswer = $('mockAnswer')?.value || '';
  const question = currentMockQ || '';
  
  const relNum = parseInt(rel) || 0;
  const specNum = parseInt(spec) || 0;
  const starNum = parseInt(star) || 0;
  const avg = Math.round((relNum + specNum + starNum) / 3);
  
  let gradeClass, gradeText;
  if(avg >= 8) { 
    gradeClass = 'excellent'; 
    gradeText = 'Excellent'; 
  } else if(avg >= 7) { 
    gradeClass = 'good'; 
    gradeText = 'Good'; 
  } else if(avg >= 5) { 
    gradeClass = 'average'; 
    gradeText = 'Average'; 
  } else { 
    gradeClass = 'poor'; 
    gradeText = 'Needs Work'; 
  }
  
  const relCls = getScoreClass(relNum);
  const specCls = getScoreClass(specNum);
  const starCls = getScoreClass(starNum);
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday:'long', 
    year:'numeric', 
    month:'long', 
    day:'numeric' 
  });
  
  const reportHTML = `<div style="padding:20px;max-width:800px;margin:0 auto;font-family:sans-serif">
    <div style="border-bottom:2px solid var(--amber);padding-bottom:12px;margin-bottom:20px">
      <div style="font-family:Outfit,sans-serif;font-size:20px;font-weight:700">NeuralHire Report</div>
      <div style="font-size:12px;color:#666;margin-top:4px">${dateStr} - ${selectedCompany}</div>
    </div>
    
    <div style="margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#666;margin-bottom:8px">Question</div>
      <div style="background:#f5f5f5;padding:12px;border-radius:8px;font-size:14px">${escHtml(question)}</div>
    </div>
    
    <div style="margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#666;margin-bottom:8px">Your Answer</div>
      <div style="padding-left:12px;border-left:3px solid var(--amber)">${escHtml(userAnswer) || '<em>No answer</em>'}</div>
    </div>
    
    <div style="display:flex;gap:12px;margin-bottom:20px">
      <div style="flex:1;background:#f5f5f5;padding:12px;border-radius:8px;text-align:center">
        <div style="font-family:Outfit,sans-serif;font-size:24px;font-weight:700;color:${relCls==='high'?'#22c55e':relCls==='mid'?'#fb923c':'#ef4444'}">${rel}/10</div>
        <div style="font-size:10px;color:#666">RELEVANCE</div>
      </div>
      <div style="flex:1;background:#f5f5f5;padding:12px;border-radius:8px;text-align:center">
        <div style="font-family:Outfit,sans-serif;font-size:24px;font-weight:700;color:${specCls==='high'?'#22c55e':specCls==='mid'?'#fb923c':'#ef4444'}">${spec}/10</div>
        <div style="font-size:10px;color:#666">SPECIFICITY</div>
      </div>
      <div style="flex:1;background:#f5f5f5;padding:12px;border-radius:8px;text-align:center">
        <div style="font-family:Outfit,sans-serif;font-size:24px;font-weight:700;color:${starCls==='high'?'#22c55e':starCls==='mid'?'#fb923c':'#ef4444'}">${star}/10</div>
        <div style="font-size:10px;color:#666">STAR</div>
      </div>
    </div>
    
    <div style="margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#666;margin-bottom:8px">FEEDBACK</div>
      <div style="background:#f5f5f5;padding:12px;border-radius:8px;font-size:14px">${escHtml(feedback)}</div>
    </div>
    
    <div style="margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#666;margin-bottom:8px">Model Answer</div>
      <div style="background:#f5f5f5;padding:12px;border-radius:8px;font-size:14px">${escHtml(modelAnswer)}</div>
    </div>
    
    <div style="margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#666;margin-bottom:8px">Overall Grade</div>
      <div style="font-family:Outfit,sans-serif;font-size:24px;font-weight:700;color:${gradeClass === 'excellent' ? '#22c55e' : gradeClass === 'good' ? '#fb923c' : '#ef4444'}">${gradeText}</div>
    </div>
  </div>`;
  
  const printDiv = $('printReport');
  if(printDiv) { 
    printDiv.innerHTML = reportHTML; 
    window.print(); 
    setTimeout(() => { 
      if(printDiv) printDiv.innerHTML = ''; 
    }, 500); 
  }
}

function copyHistAnswer() {
  const el = $('histModalA');
  if(!el) return;
  navigator.clipboard.writeText(el.innerText)
    .then(() => { showToast('Copied!', 'success'); })
    .catch(e => { showToast('Failed', 'error'); });
}

function speakAnswer() {
  if(!currentAnswer) return;
  try { 
    window.speechSynthesis.cancel(); 
    const utt = new SpeechSynthesisUtterance(currentAnswer.replace(/<[^>]*>/g,'')); 
    utt.rate = 0.92; 
    window.speechSynthesis.speak(utt); 
  } catch(e) {}
}

function clearAnswer() {
  const answerCard = $('answerCard');
  const qDisplay = $('qDisplay');
  const transcriptBox = $('transcriptBox');
  const answerActions = $('answerActions');
  const answerModes = $('answerModes');
  const codeEditor = $('codeEditor');
  
  if(answerCard) answerCard.classList.remove('show');
  if(qDisplay) qDisplay.style.display = 'none';
  if(transcriptBox) transcriptBox.classList.remove('show');
  if(answerActions) answerActions.style.display = 'none';
  if(answerModes) answerModes.style.display = 'none';
  if(codeEditor) codeEditor.style.display = 'none';
  
  currentAnswer = '';
  currentQuestion = '';
  
  setStatus('Ready to start', '');
}

function nextQuestion() {
  if(!getApiKey()) { 
    showToast('Add API key in Setup', 'error'); 
    switchTab('setup'); 
    return; 
  }
  
  clearAnswer();
  toggleListen();
}

function setStatus(msg, type) {
  const el = $('statusLine');
  if(el) { 
    el.textContent = msg; 
    el.className = 'status-line ' + (type || ''); 
  }
}

let fillTimer;
function animateFill(from, to, duration) {
  clearInterval(fillTimer);
  const fill = $('progressFill');
  if(!fill) return;
  
  let current = from;
  const step = duration > 0 ? (to-from) / (duration/100) : 0;
  
  fillTimer = setInterval(() => {
    current += step;
    if((step > 0 && current >= to) || (step < 0 && current <= to) || step === 0) { 
      current = to; 
      clearInterval(fillTimer); 
    }
    fill.style.width = Math.max(0, Math.min(100, current)) + '%';
  }, 100);
}

function addToHistory(item) {
  history.unshift(item);
  if(history.length > 100) history = history.slice(0,100);
  try { 
    localStorage.setItem('nh_history', JSON.stringify(history)); 
  } catch(e) {}
}

function updateFooterStats() {
  const footerScore = $('footerScore');
  const footerAvg = $('footerAvg');
  const footerCount = $('footerCount');
  const scoreCard1 = $('scoreCard1');
  const scoreCard2 = $('scoreCard2');
  
  const liveCount = history.filter(h => h.type === 'live').length;
  const mockSessions = history.filter(h => h.type === 'mock' && h.scores);
  
  if(footerCount) footerCount.textContent = String(history.length);
  if(scoreCard1) scoreCard1.textContent = String(liveCount);
  
  if(mockSessions.length > 0) {
    const totalScore = mockSessions.reduce((sum, s) => sum + (s.scores.relevance + s.scores.specificity + s.scores.star) / 3, 0);
    const avgScore = (totalScore / mockSessions.length).toFixed(1);
    
    if(footerAvg) footerAvg.textContent = avgScore;
    if(scoreCard2) scoreCard2.textContent = avgScore;
  } else {
    if(footerAvg) footerAvg.textContent = '0';
    if(scoreCard2) scoreCard2.textContent = '0';
  }
}

function renderHistory() {
  const list = $('historyList');
  const clearBtn = $('clearHistBtn');
  
  if(!list) return;
  
  if(!history.length) {
    list.innerHTML = `<div class="empty-state"><div class="eso">H</div><p>No sessions yet.<br><span style="color:var(--text-dim)">Start a live interview or mock session.</span></p></div>`;
    if(clearBtn) clearBtn.style.display = 'none';
    return;
  }
  
  if(clearBtn) clearBtn.style.display = 'block';
  
  const mockSessions = history.filter(h => h.type === 'mock' && h.scores);
  let summaryHTML = '';
  
  if(mockSessions.length > 0) {
    const totalScore = mockSessions.reduce((sum, s) => sum + (s.scores.relevance + s.scores.specificity + s.scores.star) / 3, 0);
    const avgScore = (totalScore / mockSessions.length).toFixed(1);
    
    summaryHTML = `<div class="history-summary">
      <div class="history-summary-title">Performance Summary</div>
      <div class="history-summary-grid">
        <div class="history-summary-stat">
          <div class="stat-val">${mockSessions.length}</div>
          <div class="stat-label">SESSIONS</div>
        </div>
        <div class="history-summary-stat">
          <div class="stat-val">${avgScore}/10</div>
          <div class="stat-label">AVG SCORE</div>
        </div>
        <div class="history-summary-stat">
          <div class="stat-val">${history.length}</div>
          <div class="stat-label">QUESTIONS</div>
        </div>
      </div>
    </div>`;
  }
  
  list.innerHTML = summaryHTML + history.map((item,i) => {
    const d = new Date(item.time);
    const dateStr = d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const typeLabel = item.type === 'mock' ? 'Mock' : 'Live';
    
    let scoreHTML = '';
    if(item.scores) {
      const avg = ((item.scores.relevance + item.scores.specificity + item.scores.star) / 3).toFixed(1);
      const scoreClass = avg >= 8 ? 'excellent' : avg >= 6.5 ? 'good' : avg >= 5 ? 'average' : 'poor';
      scoreHTML = `<span class="history-score ${scoreClass}">${avg}/10</span>`;
    }
    
    return `<div class="history-item ${item.scores ? 'has-scores' : ''}" data-index="${i}" onclick="openHistModal(${i})" style="animation-delay:${Math.min(i * 0.03, 0.3)}s">
      <div class="history-head">
        <div class="history-q">${escHtml(item.question)}</div>
        <div class="history-time">${dateStr} - ${timeStr}</div>
      </div>
      <div class="history-meta">
        <span class="meta-tag">${typeLabel}</span>
        ${scoreHTML}
      </div>
    </div>`;
  }).join('<div style="height:.5rem"></div>');
}

function openHistModal(i) {
  const item = history[i];
  if(!item) return;
  
  const modalQ = $('histModalQ');
  const modalA = $('histModalA');
  const modalMeta = $('histModalMeta');
  const modal = $('histModal');
  
  if(modalQ) modalQ.textContent = item.question;
  if(modalA) modalA.innerHTML = formatAnswer(item.answer);
  
  const d = new Date(item.time);
  let metaText = d.toLocaleString();
  if(item.elapsed) metaText += ` - ${item.elapsed}s`;
  if(item.company) metaText += ` - ${item.company}`;
  
  if(modalMeta) modalMeta.textContent = metaText;
  if(modal) modal.classList.add('show');
}

function closeHistModal(e) {
  const modal = $('histModal');
  if(!modal) return;
  if(!e || e.target.id==='histModal') closeHistModalBtn();
}

function closeHistModalBtn() {
  const modal = $('histModal');
  if(modal) modal.classList.remove('show');
}

function clearHistory() {
  if(!confirm('Clear all history?')) return;
  history = [];
  try { 
    localStorage.removeItem('nh_history'); 
  } catch(e) {}
  renderHistory();
  updateStats();
  updateFooterStats();
  showToast('History cleared', '');
}

function updateStats() {
  const statLive = $('statLive');
  const statMock = $('statMock');
  
  if(statLive) statLive.textContent = String(history.filter(h=>h.type==='live').length);
  if(statMock) statMock.textContent = String(history.filter(h=>h.type==='mock').length);
}

function resetAll() {
  if(!confirm('Delete all data?')) return;
  
  history = [];
  resumeText = '';
  settings = {};
  currentAnswer = '';
  currentQuestion = '';
  currentMockQ = '';
  
  try { 
    localStorage.clear(); 
  } catch(e) {}
  
  const apiKeyInput = $('apiKeyInput');
  const jobDesc = $('jobDesc');
  
  if(apiKeyInput) apiKeyInput.value = '';
  if(jobDesc) jobDesc.value = '';
  
  updateApiStatus(false);
  clearPdf();
  renderHistory();
  updateStats();
  updateFooterStats();
  showToast('All data cleared', '');
}

function showToast(msg, type) {
  const t = $('toast');
  if(!t) return;
  
  t.textContent = msg;
  t.className = 'toast show '+(type||'');
  
  if(t._t) clearTimeout(t._t);
  t._t = setTimeout(() => { 
    t.classList.remove('show'); 
  }, 2800);
}

function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Monaco Editor Integration
let monacoEditor = null;

async function initMonacoEditor() {
  return new Promise((resolve) => {
    require.config({
      paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.53.0/min/vs' }
    });
    
    require(['vs/editor/editor.main'], function() {
      const container = document.getElementById('codeEditorContainer');
      if (!container) return resolve();
      
      monacoEditor = monaco.editor.create(container, {
        value: '// Write or paste your code here\nfunction example() {\n return "Hello, World!";\n}',
        language: 'javascript',
        theme: 'vs-dark',
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly: false,
        minimap: { enabled: false },
        automaticLayout: true
      });
      
      resolve();
    });
  });
}

function showCodeEditor(language = 'javascript') {
  const codeEditor = document.getElementById('codeEditor');
  const answerCard = document.getElementById('answerCard');
  
  if (codeEditor && answerCard) {
    answerCard.style.display = 'none';
    codeEditor.style.display = 'block';
    
    if (monacoEditor) {
      const model = monacoEditor.getModel();
      monaco.editor.setModelLanguage(model, language);
      document.getElementById('codeLanguage').textContent = language;
    }
  }
}

function hideCodeEditor() {
  const codeEditor = document.getElementById('codeEditor');
  const answerCard = document.getElementById('answerCard');
  
  if (codeEditor && answerCard) {
    codeEditor.style.display = 'none';
    answerCard.style.display = 'block';
  }
}

function copyCode() {
  if (monacoEditor) {
    const code = monacoEditor.getValue();
    navigator.clipboard.writeText(code)
      .then(() => {
        showToast('Code copied to clipboard!', 'success');
      })
      .catch(() => {
        showToast('Failed to copy code', 'error');
      });
  }
}

function detectCodeLanguage(text) {
  const patterns = {
    javascript: /(function|const|let|var|=>|console\.log)/,
    python: /(def|import|from|print|lambda|#)/,
    java: /(public|class|static|void|System\.out\.println)/,
    cpp: /(#include|using namespace|cout|endl)/,
    html: /(<html|<head|<body|<div|class=")/,
    css: /(\.|#|@media|margin|padding|color)/
  };
  
  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) return lang;
  }
  
  return 'plaintext';
}

function hasCodeContent(text) {
  const codePatterns = [
    /function\s+\w+\s*\(/, // function declarations
    /class\s+\w+/, // class declarations
    /const\s+\w+\s*=/, // const assignments
    /let\s+\w+\s*=/, // let assignments
    /var\s+\w+\s*=/, // var assignments
    /import\s+["']/, // import statements
    /from\s+["']/, // from statements
    /<[^>]+>/, // HTML tags
    /\/\/.*$/, // single line comments
    /\/\*[\s\S]*?\*\//, // multi-line comments
    /def\s+\w+\s*\(/, // Python functions
    /public\s+\w+\s+\w+\s*\(/ // Java methods
  ];
  
  return codePatterns.some(pattern => pattern.test(text));
}

// Initialize speech support on load
checkSpeechSupport();