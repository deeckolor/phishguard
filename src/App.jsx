import { useState, useEffect } from "react";

const LEVELS = [
  {
    id:1, difficulty:"Rookie", color:"#f472b6", xp:50,
    description:"Obvious scams with glaring red flags",
    scenarios:[
      {
        type:"email", from:"Nigerian.Prince@hotmail.com",
        subject:"YOU HAVE WON $5,000,000 DOLLARS!!!",
        body:`Dear Beloved Friend,\n\nI am Prince Adebayo of Nigeria. My father the king has died and left me $47,000,000 but I cannot access it without YOUR HELP!!!\n\nI need you to send $500 to unlock the funds. You will receive $5,000,000 in return. This is 100% REAL and LEGAL.\n\nPlease send your bank details, SSN, and $500 Western Union to:\nPO Box 1234, Lagos\n\nGOD BLESS YOU,\nPrince Adebayo`,
        isPhishing:true,
        redFlags:["Unsolicited email from a stranger promising huge money","Requesting $500 upfront — classic advance-fee fraud","Hotmail address for a 'prince'","Asking for SSN and bank details","Excessive exclamation marks and urgency"],
        lesson:"Advance-fee fraud (419 scam) promises large rewards in exchange for a small upfront payment. Legitimate windfalls never require you to pay money first.",
      },
      {
        type:"email", from:"support@paypa1.com",
        subject:"Your account has been limited - Act Now!",
        body:`Dear Customer,\n\nWe have detected unusual activity on your PayPal account. Your account has been TEMPORARILY LIMITED.\n\nTo restore access click the link below IMMEDIATELY:\nhttp://paypa1.support-login.xyz/verify\n\nYou must verify within 24 HOURS or your account will be permanently closed and funds seized.\n\nPayPal Security Team`,
        isPhishing:true,
        redFlags:["Sender domain is 'paypa1.com' — not 'paypal.com' (letter 'l' replaced with '1')","Link goes to 'paypa1.support-login.xyz' — not paypal.com","Urgent 24-hour deadline creates panic","Threats of account closure to pressure action","No personalization — uses 'Dear Customer'"],
        lesson:"Domain spoofing replaces letters with lookalikes (l→1, o→0). Always hover over links before clicking and check the real sender domain carefully.",
      },
      {
        type:"email", from:"noreply@amazon.com",
        subject:"Your Amazon order #114-2847591 has shipped",
        body:`Hello Jane,\n\nYour order has shipped! Here are the details:\n\nOrder #114-2847591\nItem: Sony WH-1000XM5 Headphones\nEstimated delivery: Thursday, March 14\n\nTrack your package: amazon.com/track/114-2847591\n\nQuestions? Visit amazon.com/help\n\nThanks for shopping with Amazon.`,
        isPhishing:false, redFlags:[],
        lesson:"This is a legitimate shipping confirmation. It uses your real name, a real order number, links only to amazon.com, and doesn't ask for sensitive information or any unusual action.",
      },
    ],
  },
  {
    id:2, difficulty:"Cadet", color:"#c084fc", xp:100,
    description:"More convincing fakes — look closely",
    scenarios:[
      {
        type:"email", from:"security@accounts-google.com",
        subject:"Critical security alert for your Google Account",
        body:`Hi,\n\nWe detected a new sign-in to your Google Account from:\nDevice: Windows PC\nLocation: Kyiv, Ukraine\nTime: March 11, 2026 at 3:42 AM\n\nIf this was you, you can ignore this email.\n\nIf you didn't sign in, secure your account immediately:\n→ Review activity: accounts-google.com/security/review\n\nThe Google Accounts Team`,
        isPhishing:true,
        redFlags:["Sender domain is 'accounts-google.com' — NOT 'google.com'. Real Google emails come from @google.com","Link goes to 'accounts-google.com' — a fake domain","Designed to create fear about unauthorized access","No account username mentioned"],
        lesson:"Phishers register convincing domains like 'accounts-google.com'. Legitimate companies' emails always come from their official domain. Check the full domain — everything after the @ symbol.",
      },
      {
        type:"sms", from:"+1 (800) 935-9935",
        body:`USPS: Your package could not be delivered due to an incomplete address. Update your delivery preferences at: usps-deliveryupdate.com/track?id=9400111899223397978 Reply STOP to opt out.`,
        isPhishing:true,
        redFlags:["URL is 'usps-deliveryupdate.com' — not 'usps.com'","USPS never sends texts asking you to visit external sites","'Reply STOP' mimics legitimate opt-outs to seem real","Vague 'incomplete address' claim with no specifics"],
        lesson:"Package delivery scams ('smishing') are extremely common. The real USPS website is usps.com. Never click — go directly to the official site and enter your tracking number.",
      },
      {
        type:"email", from:"no-reply@github.com",
        subject:"Your GitHub account: new SSH key added",
        body:`Hi devuser,\n\nA new public SSH key was added to your GitHub account.\n\nKey fingerprint: SHA256:uNiVztksCsDhcc0u9e8BujQXVUpKZIDTMczCvj3tD2s\n\nIf you added this key, you can ignore this notification.\nIf you did NOT add this key, remove it immediately: github.com/settings/keys\n\nGitHub Security\ngithub.com`,
        isPhishing:false, redFlags:[],
        lesson:"This is a legitimate GitHub security notification. It comes from @github.com, addresses you by username, links only to github.com, and asks you to act only if you didn't perform the action — no urgency, no credential harvesting.",
      },
    ],
  },
  {
    id:3, difficulty:"Analyst", color:"#22d3ee", xp:150,
    description:"Sophisticated attacks targeting professionals",
    scenarios:[
      {
        type:"email", from:"hr@yourcompany-benefits.com",
        subject:"2026 Open Enrollment — Action Required by Friday",
        body:`Hi Team,\n\nOpen enrollment for 2026 benefits closes this Friday, March 14.\n\nIf you don't make your selections, you'll be auto-enrolled in last year's plan. New this year: HSA contribution limits increased to $4,300.\n\nLog in to update your selections:\n→ yourcompany-benefits.com/enroll2026\n\nFor questions, reply to this email or call HR at ext. 4400.\n\nHuman Resources\nYourCompany`,
        isPhishing:true,
        redFlags:["Email is from 'yourcompany-benefits.com' — NOT your actual company domain","Deadline pressure ('closes this Friday') designed to rush action","Login link goes to the fake domain, harvesting credentials","Correct-sounding details (HSA limits) build false credibility","Phone number cannot be verified from this email"],
        lesson:"Spear phishing uses company-specific context to seem legitimate. Always verify HR emails come from your actual company domain and bookmark your benefits portal directly.",
      },
      {
        type:"email", from:"docusign@docusign.net",
        subject:"Sarah Chen has sent you a document to review and sign",
        body:`DocuSign\n\nSarah Chen (s.chen@partnerfirm.com) has sent you a document.\n\nDOCUMENT: Q1 2026 Partnership Agreement — Final\n\nPlease review and sign by: March 13, 2026\n\n→ REVIEW DOCUMENT\n\nThis message was sent to you by DocuSign. Questions? Visit docusign.com/contact`,
        isPhishing:false, redFlags:[],
        lesson:"This appears to be a legitimate DocuSign notification from @docusign.net. To be safest, log in directly to docusign.com and check your pending documents rather than clicking the link.",
      },
      {
        type:"email", from:"billing@microsoft365-invoice.com",
        subject:"Invoice #INV-2026-03114: Microsoft 365 Business — $1,847.00",
        body:`Microsoft 365 Business Invoice\n\nInvoice #: INV-2026-03114\nDate: March 11, 2026\nAmount Due: $1,847.00\nDue Date: March 18, 2026\n\nThis charge covers annual renewal for 14 Business Premium licenses.\n\nIf you did not authorize this charge or want to cancel:\n→ Cancel subscription: microsoft365-invoice.com/cancel\n\nQuestions? Call: 1-888-247-6381\n\nMicrosoft Billing`,
        isPhishing:true,
        redFlags:["Sender domain is 'microsoft365-invoice.com' — NOT microsoft.com","Large unexpected charge designed to trigger immediate panic","Cancellation link goes to the fake domain","Phone number routes to scammers, not Microsoft","Real Microsoft invoices are in the admin center, not emails from third-party domains"],
        lesson:"Billing panic attacks create urgency with a surprising charge. Microsoft billing emails ONLY come from @microsoft.com. Always go directly to admin.microsoft.com to verify.",
      },
    ],
  },
  {
    id:4, difficulty:"Expert", color:"#fb923c", xp:200,
    description:"Near-perfect fakes — extreme attention to detail needed",
    scenarios:[
      {
        type:"email", from:"security-noreply@apple.com",
        subject:"Your Apple ID was used to sign in to iCloud on a new device",
        body:`Your Apple ID (j.smith@email.com) was used to sign in to iCloud via a web browser.\n\nDate and Time: March 11, 2026 at 9:14 AM PST\nBrowser: Chrome\nOperating System: Windows\nLocation: Approximate location based on IP: Chicago, IL\n\nIf you recently signed in, you can disregard this email.\n\nIf you did not sign in, your Apple ID may be compromised. Review it now:\n→ appleid.apple.com\n\nApple Support`,
        isPhishing:false, redFlags:[],
        lesson:"This is a legitimate Apple security notification. It comes from @apple.com, includes your real email, and links only to appleid.apple.com. Apple's real security emails are concise, non-urgent, and only link to apple.com subdomains.",
      },
      {
        type:"email", from:"notifications@linkedln.com",
        subject:"You appeared in 14 searches this week",
        body:`LinkedIn\n\nHi Alex,\n\nYou appeared in 14 searches this week. See who's looking at your profile.\n\n› 3 people from Fortune 500 companies viewed your profile\n› Your profile ranks higher than 72% of Software Engineers in your network\n\nSee all your viewers:\nlinkedln.com/in/alex/viewers\n\nAlso: Marcus Rodriguez wants to connect with you.\n\nThe LinkedIn Team\nUnsubscribe · Help Center`,
        isPhishing:true,
        redFlags:["Sender and links use 'linkedln.com' — NOT 'linkedin.com'. The 'i' and 'n' are swapped to form 'ln' instead of 'in'","This is an extremely subtle typosquat — nearly invisible at a glance","The email content perfectly mimics real LinkedIn emails","Entices clicks with flattering profile view stats"],
        lesson:"'linkedln.com' vs 'linkedin.com' — just two transposed letters. Expert attackers register near-identical domains. Always hover links and check domain names character by character.",
      },
      {
        type:"sms", from:"Chase Bank",
        body:`Chase: Unusual activity detected on your account ending in 4821. A $2,340 transfer was initiated. If not you, call us immediately: 1-800-935-9935 or reply FREEZE to block.`,
        isPhishing:true,
        redFlags:["Real Chase fraud alerts never ask you to 'reply FREEZE' — they direct you to the number on the back of your card","The phone number should be verified against your card or chase.com — never trust a text","Spoofed sender name 'Chase Bank' — SMS sender names are trivially spoofed","Designed to create immediate panic with a large transfer amount"],
        lesson:"SMS sender names are completely spoofable. Real banks will NEVER ask you to reply with commands. If you receive a fraud alert, ignore the text and call the number on the back of your card.",
      },
    ],
  },
];

const BADGES = [
  { score:50,   name:"First Steps",      icon:"🌱", desc:"Started your security journey" },
  { score:150,  name:"Skeptic",          icon:"🔍", desc:"Developing a suspicious eye" },
  { score:300,  name:"Red Flag Spotter", icon:"🚩", desc:"Catching obvious phish" },
  { score:500,  name:"Security Aware",   icon:"🛡️", desc:"Above-average phishing defense" },
  { score:750,  name:"Cyber Guardian",   icon:"⚔️", desc:"Protecting yourself and others" },
  { score:1000, name:"Phish Hunter",     icon:"🎯", desc:"Elite threat detector" },
];

// In-memory high score store (persists during session)
let SCORE_STORE = [];

function saveHighScore(name, score, accuracy) {
  SCORE_STORE = [...SCORE_STORE, {
    name, score, accuracy,
    date: new Date().toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" })
  }].sort((a,b) => b.score - a.score).slice(0, 20);
}

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#fdf2f8", bgCard:"#ffffff", bgSoft:"#fce7f3", bgDeep:"#fdf4ff",
  border:"#fbcfe8", borderSoft:"#f9a8d4",
  pink:"#db2777", pinkL:"#f472b6", pinkXL:"#fce7f3",
  teal:"#0e7490", tealL:"#22d3ee", tealXL:"#cffafe",
  violet:"#7c3aed", violetL:"#c084fc",
  gold:"#d97706", goldL:"#fbbf24",
  green:"#059669", greenL:"#6ee7b7",
  red:"#dc2626", redL:"#fca5a5",
  text:"#1e1b2e", textMd:"#4a3f5c", textSm:"#9580a8",
};

export default function App() {
  const [screen, setScreen]             = useState("home");
  const [playerName, setPlayerName]     = useState("");
  const [nameInput, setNameInput]       = useState("");
  const [nameError, setNameError]       = useState("");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore]               = useState(0);
  const [levelScore, setLevelScore]     = useState(0);
  const [streak, setStreak]             = useState(0);
  const [maxStreak, setMaxStreak]       = useState(0);
  const [showResult, setShowResult]     = useState(false);
  const [correct, setCorrect]           = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [newBadge, setNewBadge]         = useState(null);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [lives, setLives]               = useState(3);
  const [levelResults, setLevelResults] = useState([]);
  const [highScores, setHighScores]     = useState([]);
  const [dots, setDots]                 = useState([]);

  useEffect(() => {
    setDots(Array.from({length:20},(_,i)=>({
      id:i, x:Math.random()*100, y:Math.random()*100,
      r:2+Math.random()*3.5, dur:5+Math.random()*7, del:Math.random()*4,
      c: i%3===0 ? C.pinkL : i%3===1 ? C.tealL : C.violetL,
    })));
  }, []);

  const level    = LEVELS[currentLevel];
  const scenario = level?.scenarios[currentScenario];
  const accuracy = totalAnswered>0 ? Math.round((totalCorrect/totalAnswered)*100) : 0;

  function tryBadges(ns, current) {
    let updated = [...current]; let toast = null;
    for (const b of BADGES) {
      if (ns >= b.score && !updated.find(e=>e.name===b.name)) {
        updated.push(b); toast = b;
      }
    }
    return { updated, toast };
  }

  function handleAnswer(choice) {
    if (showResult) return;
    const isCorrect = (choice==="phishing") === scenario.isPhishing;
    setCorrect(isCorrect);
    setShowResult(true);
    setTotalAnswered(p=>p+1);
    if (isCorrect) {
      const newStreak = streak+1;
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setStreak(newStreak);
      setTotalCorrect(p=>p+1);
      const pts = level.xp + Math.min(streak,4)*10;
      const ns  = score + pts;
      setScore(ns);
      setLevelScore(p=>p+pts);
      const {updated, toast} = tryBadges(ns, earnedBadges);
      setEarnedBadges(updated);
      if (toast) { setNewBadge(toast); setTimeout(()=>setNewBadge(null),3500); }
      setLevelResults(p=>[...p,{correct:true,pts}]);
    } else {
      setStreak(0);
      const newLives = lives-1;
      setLives(newLives);
      setLevelResults(p=>[...p,{correct:false,pts:0}]);
    }
  }

  function nextScenario() {
    setShowResult(false); setCorrect(null);
    const newLives = correct ? lives : lives-1;
    const outOfLives = !correct && lives<=1;
    const lastScenario = currentScenario+1 >= level.scenarios.length;
    if (outOfLives || lastScenario) {
      setScreen("levelComplete");
    } else {
      setCurrentScenario(p=>p+1);
    }
  }

  function nextLevel() {
    if (currentLevel+1 >= LEVELS.length) {
      saveHighScore(playerName, score, accuracy);
      setHighScores([...SCORE_STORE]);
      setScreen("final");
    } else {
      setCurrentLevel(p=>p+1);
      setCurrentScenario(0); setLevelScore(0); setLevelResults([]); setLives(3);
      setScreen("game");
    }
  }

  function startGame() {
    if (!nameInput.trim()) { setNameError("Please enter your name to continue. 🌸"); return; }
    setPlayerName(nameInput.trim()); setNameError("");
    setCurrentLevel(0); setCurrentScenario(0);
    setScore(0); setLevelScore(0); setStreak(0); setMaxStreak(0);
    setShowResult(false); setCorrect(null);
    setEarnedBadges([]); setNewBadge(null);
    setTotalAnswered(0); setTotalCorrect(0);
    setLives(3); setLevelResults([]);
    setScreen("game");
  }

  function openScores() { setHighScores([...SCORE_STORE]); setScreen("scores"); }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
    *{box-sizing:border-box;}
    body{margin:0;background:${C.bg};}
    .root{font-family:'Nunito',sans-serif;min-height:100vh;}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes fadeUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes slideIn{from{transform:translateX(80px);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes popIn{0%{transform:scale(.8);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
    .shimmer{
      background:linear-gradient(90deg,${C.pink},${C.violet},${C.teal},${C.pink});
      background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
      animation:shimmer 3s linear infinite;
    }
    .card{background:#fff;border:1.5px solid ${C.border};border-radius:20px;padding:22px;box-shadow:0 2px 20px rgba(219,39,119,.07);}
    .chip{background:#fff;border:1.5px solid ${C.border};border-radius:14px;padding:8px 16px;text-align:center;box-shadow:0 2px 10px rgba(219,39,119,.06);}
    .level-card{background:#fff;border:1.5px solid ${C.border};border-radius:16px;padding:16px;transition:all .2s;}
    .level-card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(219,39,119,.15);}
    .pill{display:flex;align-items:center;gap:8px;background:${C.bgSoft};border:1.5px solid ${C.border};border-radius:50px;padding:7px 14px;}
    .btn-phish{background:linear-gradient(135deg,${C.red},#b91c1c);border:2px solid ${C.redL};color:#fff;cursor:pointer;padding:13px 28px;border-radius:50px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;letter-spacing:.5px;transition:all .2s;box-shadow:0 4px 14px rgba(220,38,38,.25);}
    .btn-phish:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(220,38,38,.4);}
    .btn-legit{background:linear-gradient(135deg,${C.green},#047857);border:2px solid ${C.greenL};color:#fff;cursor:pointer;padding:13px 28px;border-radius:50px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;letter-spacing:.5px;transition:all .2s;box-shadow:0 4px 14px rgba(5,150,105,.25);}
    .btn-legit:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(5,150,105,.4);}
    .btn-main{background:linear-gradient(135deg,${C.pink},${C.violet});border:none;color:#fff;cursor:pointer;padding:14px 36px;border-radius:50px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;letter-spacing:.5px;transition:all .25s;box-shadow:0 6px 22px rgba(219,39,119,.35);}
    .btn-main:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(219,39,119,.5);}
    .btn-out{background:transparent;border:2px solid ${C.pink};color:${C.pink};cursor:pointer;padding:12px 28px;border-radius:50px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;transition:all .2s;}
    .btn-out:hover{background:${C.pink};color:#fff;transform:translateY(-1px);}
    .btn-next{background:linear-gradient(135deg,${C.teal},${C.violet});border:none;color:#fff;cursor:pointer;padding:11px 26px;border-radius:50px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;transition:all .2s;box-shadow:0 4px 14px rgba(14,116,144,.3);}
    .btn-next:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(14,116,144,.45);}
    .inp{background:#fff;border:2px solid ${C.border};border-radius:14px;padding:13px 18px;font-family:'Nunito',sans-serif;font-size:15px;color:${C.text};width:100%;transition:border .2s;outline:none;}
    .inp:focus{border-color:${C.pink};box-shadow:0 0 0 3px rgba(219,39,119,.14);}
    .flag{animation:fadeUp .3s ease forwards;opacity:0;}
    .score-row{display:flex;align-items:center;gap:12px;border-radius:12px;padding:10px 14px;transition:background .15s;}
    .score-row:nth-child(odd){background:${C.bgSoft};}
    .score-row:hover{background:${C.pinkXL};}
  `;

  return (
    <div className="root" style={{background:C.bg,color:C.text,position:"relative",overflow:"hidden"}}>
      <style>{css}</style>

      {/* Background blobs + particles */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-140,right:-140,width:450,height:450,borderRadius:"50%",background:`radial-gradient(circle,${C.pinkL}20,transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:-100,left:-100,width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${C.tealL}18,transparent 70%)`}}/>
        <div style={{position:"absolute",top:"35%",left:"45%",width:320,height:320,borderRadius:"50%",background:`radial-gradient(circle,${C.violetL}14,transparent 70%)`}}/>
        {dots.map(d=>(
          <div key={d.id} style={{position:"absolute",left:`${d.x}%`,top:`${d.y}%`,width:d.r*2,height:d.r*2,borderRadius:"50%",background:d.c,opacity:.3,animation:`float ${d.dur}s ease-in-out ${d.del}s infinite`}}/>
        ))}
      </div>

      {/* Badge toast */}
      {newBadge && (
        <div style={{position:"fixed",top:20,right:20,zIndex:300,background:"#fff",border:`2px solid ${C.goldL}`,borderRadius:18,padding:"14px 20px",boxShadow:`0 8px 36px rgba(217,119,6,.28)`,animation:"slideIn .4s ease",maxWidth:270}}>
          <div style={{fontSize:10,fontWeight:800,color:C.gold,letterSpacing:2,marginBottom:4}}>🏆 BADGE UNLOCKED</div>
          <div style={{fontSize:20,fontWeight:900}}>{newBadge.icon} {newBadge.name}</div>
          <div style={{fontSize:12,color:C.textSm,marginTop:3}}>{newBadge.desc}</div>
        </div>
      )}

      {/* ── HOME ──────────────────────────────────────────────────────── */}
      {screen==="home" && (
        <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto",padding:"40px 20px 70px"}}>
          {/* Branding bar */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:28}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:50,padding:"8px 22px",boxShadow:`0 2px 14px rgba(219,39,119,.1)`}}>
              <span style={{fontSize:18}}>💜</span>
              <span style={{fontSize:12,fontWeight:800,color:C.textMd,letterSpacing:.5}}>Girls in ICT Day · ITU</span>
              <span style={{width:1,height:16,background:C.border,display:"inline-block"}}/>
              <span style={{fontSize:12,fontWeight:800,color:C.teal}}>DICT Region IV-A</span>
            </div>
          </div>

          <div style={{textAlign:"center",marginBottom:36}}>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(40px,8vw,72px)",fontWeight:900,margin:"0 0 10px",lineHeight:1.05}}>
              <span className="shimmer">PhishGuard</span>
            </h1>
            <div style={{fontSize:13,fontWeight:700,letterSpacing:3,color:C.textSm,textTransform:"uppercase",marginBottom:18}}>
              Cyber Threat Detection Simulator
            </div>
            <p style={{color:C.textMd,maxWidth:530,margin:"0 auto",lineHeight:1.8,fontSize:15}}>
              Learn to spot phishing attacks through real-world scenarios.<br/>
              Protect yourself and your community — because every woman in tech deserves to stay cyber-safe. 🌸
            </p>
          </div>

          {/* Name entry */}
          <div className="card" style={{maxWidth:460,margin:"0 auto 32px",textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:800,color:C.pink,letterSpacing:1,marginBottom:14}}>✨ ENTER YOUR NAME TO BEGIN</div>
            <input className="inp" placeholder="Your name or username…" value={nameInput}
              onChange={e=>{setNameInput(e.target.value);setNameError("");}}
              onKeyDown={e=>e.key==="Enter"&&startGame()} maxLength={30}/>
            {nameError && <div style={{fontSize:12,color:C.red,marginTop:8,fontWeight:600}}>{nameError}</div>}
            <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:18,flexWrap:"wrap"}}>
              <button className="btn-main" onClick={startGame}>▶ Start Training</button>
              <button className="btn-out" onClick={openScores}>🏆 High Scores</button>
            </div>
          </div>

          {/* Level cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(168px,1fr))",gap:12,marginBottom:28}}>
            {LEVELS.map((lvl,i)=>(
              <div key={i} className="level-card">
                <div style={{fontSize:10,fontWeight:800,color:lvl.color,letterSpacing:2,marginBottom:6}}>LEVEL {lvl.id}</div>
                <div style={{fontSize:15,fontWeight:900,color:C.text,marginBottom:5}}>{lvl.difficulty}</div>
                <div style={{fontSize:11,color:C.textSm,lineHeight:1.55}}>{lvl.description}</div>
                <div style={{marginTop:10,fontSize:11,fontWeight:800,color:lvl.color}}>+{lvl.xp} XP / correct</div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="card">
            <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.textSm,marginBottom:14}}>EARNABLE BADGES</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {BADGES.map((b,i)=>(
                <div key={i} className="pill">
                  <span style={{fontSize:18}}>{b.icon}</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:800,color:C.text}}>{b.name}</div>
                    <div style={{fontSize:10,color:C.textSm}}>{b.score} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{textAlign:"center",marginTop:36,fontSize:12,color:C.textSm,lineHeight:2}}>
            <strong style={{color:C.pink}}>Girls in ICT Day</strong> · Facilitated by <strong style={{color:C.teal}}>DICT Region IV-A</strong> · In partnership with <strong style={{color:C.violet}}>ITU</strong><br/>
            Empowering women and girls in technology 💜
          </div>
        </div>
      )}

      {/* ── HIGH SCORES ───────────────────────────────────────────────── */}
      {screen==="scores" && (
        <div style={{position:"relative",zIndex:1,maxWidth:600,margin:"0 auto",padding:"50px 20px 70px"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontSize:56,marginBottom:12,animation:"popIn .4s ease"}}>🏆</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:36,margin:"0 0 8px",color:C.text}}>Hall of Fame</h2>
            <div style={{fontSize:13,color:C.textSm}}>Girls in ICT Day · PhishGuard Champions</div>
          </div>
          <div className="card" style={{marginBottom:24}}>
            {SCORE_STORE.length===0 ? (
              <div style={{textAlign:"center",padding:"36px 0",color:C.textSm}}>
                <div style={{fontSize:40,marginBottom:12}}>🎮</div>
                No scores yet — be the first to play!
              </div>
            ) : SCORE_STORE.map((s,i)=>(
              <div key={i} className="score-row">
                <div style={{width:34,height:34,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,flexShrink:0,
                  background:i===0?`linear-gradient(135deg,#f59e0b,#d97706)`:i===1?`linear-gradient(135deg,#9ca3af,#6b7280)`:i===2?`linear-gradient(135deg,#b45309,#92400e)`:C.bgSoft,
                  color:i<3?"#fff":C.textSm}}>
                  {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:14,color:C.text}}>{s.name}</div>
                  <div style={{fontSize:11,color:C.textSm}}>{s.date} · {s.accuracy}% accuracy</div>
                </div>
                <div style={{fontWeight:900,fontSize:20,color:C.pink}}>{s.score.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center"}}>
            <button className="btn-main" onClick={()=>setScreen("home")}>← Back to Home</button>
          </div>
        </div>
      )}

      {/* ── GAME ──────────────────────────────────────────────────────── */}
      {screen==="game" && scenario && (
        <div style={{position:"relative",zIndex:1,maxWidth:840,margin:"0 auto",padding:"20px 16px 40px"}}>
          {/* HUD */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,flexWrap:"wrap"}}>
            <div className="chip" style={{borderColor:`${level.color}55`}}>
              <div style={{fontSize:10,fontWeight:700,color:C.textSm,letterSpacing:2}}>LEVEL</div>
              <div style={{fontSize:14,fontWeight:900,color:level.color}}>{level.difficulty}</div>
            </div>
            <div className="chip">
              <div style={{fontSize:10,fontWeight:700,color:C.textSm,letterSpacing:2}}>SCORE</div>
              <div style={{fontSize:14,fontWeight:900,color:C.pink}}>{score.toLocaleString()}</div>
            </div>
            <div className="chip">
              <div style={{fontSize:10,fontWeight:700,color:C.textSm,letterSpacing:2}}>STREAK</div>
              <div style={{fontSize:14,fontWeight:900,color:C.gold}}>{streak>0?`🔥 ${streak}`:"—"}</div>
            </div>
            <div className="chip">
              <div style={{fontSize:10,fontWeight:700,color:C.textSm,letterSpacing:2}}>LIVES</div>
              <div style={{fontSize:15}}>{"❤️".repeat(lives)}{"🤍".repeat(3-lives)}</div>
            </div>
            <div style={{flex:1,textAlign:"right",fontSize:13,fontWeight:700,color:C.textSm}}>
              {playerName} · {currentScenario+1}/{level.scenarios.length}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{height:5,background:C.bgSoft,borderRadius:5,marginBottom:20,overflow:"hidden"}}>
            <div style={{height:"100%",background:`linear-gradient(90deg,${C.pink},${C.violet})`,borderRadius:5,width:`${((currentScenario+(showResult?1:0))/level.scenarios.length)*100}%`,transition:"width .4s ease"}}/>
          </div>

          <div style={{fontSize:11,fontWeight:800,letterSpacing:3,color:C.textSm,marginBottom:8}}>
            ANALYZE THIS {scenario.type==="sms"?"TEXT MESSAGE":"EMAIL"} ▼
          </div>

          {/* Message card */}
          <div style={{
            background:"#fff",border:`1.5px solid ${showResult?(correct?C.greenL+"88":C.redL+"88"):C.border}`,
            borderRadius:20,overflow:"hidden",marginBottom:18,
            boxShadow:showResult?(correct?`0 4px 28px rgba(5,150,105,.14)`:`0 4px 28px rgba(220,38,38,.14)`):`0 2px 18px rgba(219,39,119,.08)`,
            transition:"all .3s",
          }}>
            {scenario.type==="email"?(
              <>
                <div style={{background:C.bgSoft,padding:"14px 22px",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    <div style={{width:11,height:11,borderRadius:"50%",background:"#ef4444"}}/>
                    <div style={{width:11,height:11,borderRadius:"50%",background:"#facc15"}}/>
                    <div style={{width:11,height:11,borderRadius:"50%",background:"#4ade80"}}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:"5px 0",fontSize:13}}>
                    <span style={{color:C.textSm,fontWeight:600}}>From:</span>
                    <span style={{color:C.pink,fontWeight:900}}>{scenario.from}</span>
                    <span style={{color:C.textSm,fontWeight:600}}>Subject:</span>
                    <span style={{color:C.text,fontWeight:700}}>{scenario.subject}</span>
                  </div>
                </div>
                <div style={{padding:"20px 24px",whiteSpace:"pre-wrap",fontSize:14,lineHeight:1.8,color:C.textMd,fontFamily:"'Nunito',sans-serif"}}>
                  {scenario.body}
                </div>
              </>
            ):(
              <div style={{padding:24}}>
                <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{background:C.bgSoft,borderRadius:"50%",width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>📱</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:900,color:C.pink,marginBottom:10}}>{scenario.from}</div>
                    <div style={{background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:"4px 18px 18px 18px",padding:"13px 18px",fontSize:14,color:C.textMd,lineHeight:1.7,maxWidth:520}}>
                      {scenario.body}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Answer buttons */}
          {!showResult && (
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
              <button className="btn-phish" onClick={()=>handleAnswer("phishing")}>⚠️ Phishing Attempt</button>
              <button className="btn-legit"  onClick={()=>handleAnswer("legit")}>✓ Looks Legitimate</button>
            </div>
          )}

          {/* Result */}
          {showResult && (
            <div style={{background:correct?"rgba(236,253,245,.95)":"rgba(254,242,242,.95)",border:`1.5px solid ${correct?C.greenL:C.redL}`,borderRadius:20,padding:"20px 22px",marginBottom:18,animation:"fadeUp .3s ease"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
                <span style={{fontSize:34}}>{correct?"✅":"❌"}</span>
                <div>
                  <div style={{fontSize:17,fontWeight:900,color:correct?C.green:C.red}}>
                    {correct?"Correct! Well spotted.":"Oops — incorrect!"}
                  </div>
                  <div style={{fontSize:12,color:C.textSm}}>
                    {scenario.isPhishing?"This WAS a phishing attempt.":"This was a legitimate message."}
                    {correct&&streak>1&&<span style={{color:C.gold,marginLeft:8,fontWeight:700}}>🔥 {streak}x streak bonus!</span>}
                  </div>
                </div>
              </div>
              {scenario.isPhishing && scenario.redFlags.length>0 && (
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.red,marginBottom:10}}>🚩 RED FLAGS:</div>
                  {scenario.redFlags.map((f,i)=>(
                    <div key={i} className="flag" style={{display:"flex",gap:10,marginBottom:8,fontSize:13,color:C.textMd,lineHeight:1.6,animationDelay:`${i*.08}s`}}>
                      <span style={{color:C.red,fontWeight:900,flexShrink:0}}>▸</span><span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{background:"#fff",borderRadius:12,padding:"12px 16px",fontSize:13,color:C.textMd,lineHeight:1.7,borderLeft:`3px solid ${C.teal}`}}>
                <span style={{color:C.teal,fontWeight:800}}>💡 Lesson: </span>{scenario.lesson}
              </div>
              <div style={{marginTop:16,display:"flex",justifyContent:"flex-end"}}>
                <button className="btn-next" onClick={nextScenario}>
                  {currentScenario+1>=level.scenarios.length?"Complete Level →":"Next Scenario →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── LEVEL COMPLETE ────────────────────────────────────────────── */}
      {screen==="levelComplete" && (
        <div style={{position:"relative",zIndex:1,maxWidth:560,margin:"0 auto",padding:"60px 20px",textAlign:"center"}}>
          <div style={{fontSize:60,marginBottom:14,animation:"popIn .4s ease"}}>
            {levelResults.filter(r=>r.correct).length >= level.scenarios.length*.6?"🎯":"📖"}
          </div>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:3,color:level.color,marginBottom:10}}>LEVEL {level.id} COMPLETE</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:32,margin:"0 0 6px",color:C.text}}>{level.difficulty}</h2>
          <div style={{color:C.textSm,marginBottom:28}}>{levelResults.filter(r=>r.correct).length} / {levelResults.length} correct</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
            {[
              {label:"LEVEL XP",val:levelScore,c:C.pink},
              {label:"TOTAL SCORE",val:score.toLocaleString(),c:C.teal},
              {label:"ACCURACY",val:`${accuracy}%`,c:accuracy>=80?C.green:accuracy>=60?C.gold:C.red},
            ].map((s,i)=>(
              <div key={i} className="chip">
                <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.val}</div>
                <div style={{fontSize:10,fontWeight:700,color:C.textSm,letterSpacing:1}}>{s.label}</div>
              </div>
            ))}
          </div>
          {earnedBadges.length>0 && (
            <div className="card" style={{marginBottom:28}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.textSm,marginBottom:12}}>BADGES EARNED</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
                {earnedBadges.map((b,i)=>(
                  <div key={i} className="pill">{b.icon}<span style={{fontSize:12,fontWeight:700}}>{b.name}</span></div>
                ))}
              </div>
            </div>
          )}
          <button className="btn-main" onClick={nextLevel}>
            {currentLevel+1>=LEVELS.length?"See Final Results →":`Level ${currentLevel+2}: ${LEVELS[currentLevel+1]?.difficulty} →`}
          </button>
        </div>
      )}

      {/* ── FINAL ─────────────────────────────────────────────────────── */}
      {screen==="final" && (
        <div style={{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto",padding:"50px 20px 80px"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{fontSize:64,marginBottom:14,animation:"popIn .5s ease"}}>🏆</div>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:3,color:C.gold,marginBottom:10}}>TRAINING COMPLETE</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:36,margin:"0 0 8px",color:C.text}}>Great job, {playerName}!</h2>
            <div style={{color:C.textSm}}>You've completed all {LEVELS.length} threat levels.</div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:28}}>
            {[
              {label:"FINAL SCORE",val:score.toLocaleString(),c:C.pink},
              {label:"ACCURACY",val:`${accuracy}%`,c:accuracy>=80?C.green:accuracy>=60?C.gold:C.red},
              {label:"MAX STREAK",val:maxStreak>0?`🔥 ${maxStreak}`:"—",c:C.gold},
              {label:"BADGES",val:earnedBadges.length,c:C.violet},
            ].map((s,i)=>(
              <div key={i} className="chip" style={{padding:"18px 14px"}}>
                <div style={{fontSize:28,fontWeight:900,color:s.c}}>{s.val}</div>
                <div style={{fontSize:10,fontWeight:700,color:C.textSm,letterSpacing:1}}>{s.label}</div>
              </div>
            ))}
          </div>

          {earnedBadges.length>0 && (
            <div className="card" style={{marginBottom:24}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.textSm,marginBottom:12}}>YOUR BADGES</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                {earnedBadges.map((b,i)=>(
                  <div key={i} className="pill">
                    <span style={{fontSize:20}}>{b.icon}</span>
                    <div>
                      <div style={{fontSize:12,fontWeight:800,color:C.text}}>{b.name}</div>
                      <div style={{fontSize:10,color:C.textSm}}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard inline */}
          <div className="card" style={{marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.textSm,marginBottom:14}}>🏆 LEADERBOARD</div>
            {SCORE_STORE.length===0 ? (
              <div style={{textAlign:"center",padding:"16px 0",color:C.textSm,fontSize:13}}>No other scores yet.</div>
            ) : SCORE_STORE.slice(0,10).map((s,i)=>(
              <div key={i} className="score-row" style={{background:s.name===playerName?C.pinkXL:i%2===0?C.bgSoft:"#fff"}}>
                <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,flexShrink:0,
                  background:i===0?`linear-gradient(135deg,#f59e0b,#d97706)`:i===1?`linear-gradient(135deg,#9ca3af,#6b7280)`:i===2?`linear-gradient(135deg,#b45309,#92400e)`:C.bgSoft,
                  color:i<3?"#fff":C.textSm}}>
                  {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
                </div>
                <div style={{flex:1}}>
                  <span style={{fontWeight:s.name===playerName?900:700,fontSize:14,color:s.name===playerName?C.pink:C.text}}>
                    {s.name}{s.name===playerName?" 👈":""}
                  </span>
                  <div style={{fontSize:11,color:C.textSm}}>{s.date} · {s.accuracy}% accuracy</div>
                </div>
                <div style={{fontWeight:900,fontSize:20,color:C.pink}}>{s.score.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Takeaways */}
          <div className="card" style={{marginBottom:28}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.teal,marginBottom:14}}>KEY TAKEAWAYS</div>
            {["Always check the sender's domain — not just the display name","Hover over links before clicking to see the real destination","Urgency and fear are manipulation tactics — slow down","If in doubt, go directly to the official website — don't click","Legitimate organizations never demand sensitive info by email","SMS sender names are trivially spoofable — verify via official channels"].map((tip,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:10,fontSize:13,color:C.textMd,lineHeight:1.55}}>
                <span style={{color:C.green,fontWeight:900,flexShrink:0}}>✓</span><span>{tip}</span>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn-main" onClick={()=>{setNameInput(playerName);setScreen("home");}}>↺ Play Again</button>
            <button className="btn-out" onClick={openScores}>🏆 Full Leaderboard</button>
          </div>

          <div style={{textAlign:"center",marginTop:36,fontSize:12,color:C.textSm,lineHeight:2}}>
            <strong style={{color:C.pink}}>Girls in ICT Day</strong> · Facilitated by <strong style={{color:C.teal}}>DICT Region IV-A</strong><br/>
            In partnership with <strong style={{color:C.violet}}>ITU</strong> · Empowering women and girls in technology 💜
          </div>
        </div>
      )}
    </div>
  );
}
