// ─── TOAST NOTIFICATION SYSTEM ───────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.getElementById('toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  toast.style.cssText = `
    position: fixed;
    top: 80px;
    right: 24px;
    z-index: 9999;
    padding: 0.85rem 1.25rem;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: #fff;
    background: ${type === 'success' ? 'linear-gradient(135deg, #06d6a0, #118ab2)' : 'linear-gradient(135deg, #ef233c, #c81d32)'};
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    opacity: 0;
    transform: translateX(20px);
    transition: all 0.3s ease;
    max-width: 320px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── ADD TODO ─────────────────────────────────────────────────
const todoForm = document.getElementById("todoForm");
if (todoForm) {
  todoForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      title: data.title,
      description: data.description,
      priority: parseInt(data.priority),
      complete: false,
    };

    try {
      const response = await fetch("/todos/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast("✓ New todo created successfully!");
        setTimeout(() => {
          window.location.href = "/todos/todo-page";
        }, 1500);
      } else {
        const errorData = await response.json();
        const detail = errorData.detail;
        if (Array.isArray(detail)) {
          const msg = detail.map(e => e.msg).join(", ");
          showToast(`Error: ${msg}`, 'error');
        } else {
          showToast(`Error: ${detail}`, 'error');
        }
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", 'error');
    }
  });
}

// ─── EDIT TODO ────────────────────────────────────────────────
const editTodoForm = document.getElementById("editTodoForm");
if (editTodoForm) {
  editTodoForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    var url = window.location.pathname;
    const todoId = url.substring(url.lastIndexOf("/") + 1);

    const payload = {
      title: data.title,
      description: data.description,
      priority: parseInt(data.priority),
      complete: data.complete === "on",
    };

    try {
      const token = getCookie("access_token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`/todos/todo/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast("✓ Todo updated successfully!");
        setTimeout(() => {
          window.location.href = "/todos/todo-page";
        }, 1500);
      } else {
        const errorData = await response.json();
        showToast(`Error: ${errorData.detail}`, 'error');
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", 'error');
    }
  });

  document.getElementById("deleteButton").addEventListener("click", async function () {
    const confirmed = confirm("Are you sure you want to delete this todo?");
    if (!confirmed) return;

    var url = window.location.pathname;
    const todoId = url.substring(url.lastIndexOf("/") + 1);

    try {
      const token = getCookie("access_token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`/todos/todo/${todoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showToast("✓ Todo deleted successfully!");
        setTimeout(() => {
          window.location.href = "/todos/todo-page";
        }, 1500);
      } else {
        const errorData = await response.json();
        showToast(`Error: ${errorData.detail}`, 'error');
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", 'error');
    }
  });
}

// ─── LOGIN ────────────────────────────────────────────────────
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const payload = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      payload.append(key, value);
    }

    try {
      const response = await fetch("/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        logout();
        document.cookie = `access_token=${data.access_token}; path=/`;
        window.location.href = "/todos/todo-page";
      } else {
        showToast("Wrong username or password.", 'error');
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", 'error');
    }
  });
}

// ─── REGISTER ─────────────────────────────────────────────────
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.password2) {
      showToast("Passwords do not match.", 'error');
      return;
    }

    if (data.password.length < 8) {
      showToast("Password must be at least 8 characters.", 'error');
      return;
    }

    if (data.username.length < 3) {
      showToast("Username must be at least 3 characters.", 'error');
      return;
    }

    if (!data.email.includes('@')) {
      showToast("Please enter a valid email address.", 'error');
      return;
    }

    const payload = {
      email: data.email,
      username: data.username,
      first_name: data.firstname,
      last_name: data.lastname,
      phone_number: data.phone_number,
      password: data.password,
    };

    try {
      const response = await fetch("/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast("✓ Account created! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/auth/login-page";
        }, 2000);
      } else {
        const errorData = await response.json();
        const detail = errorData.detail;
        if (Array.isArray(detail)) {
          const msg = detail.map(e => e.msg).join(", ");
          showToast(`Error: ${msg}`, 'error');
        } else {
          showToast(`Error: ${detail}`, 'error');
        }
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", 'error');
    }
  });
}

// ─── HELPERS ──────────────────────────────────────────────────
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function logout() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
  window.location.href = "/auth/login-page";
}

// ─── DODO MASCOT ──────────────────────────────────────────────
window.addEventListener('load', function(){
  const canvas = document.getElementById('dodo-face');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const wrap = document.getElementById('dodo-wrap');
  const bubble = document.getElementById('dodo-bubble');
  const W=90, CX=45, CY=45, R=38;

  function lerp(a,b,t){ return a+(b-a)*t; }

  const messages = [
    ["Nothing done yet...","Dodo is sad 😢","Come on, just one!","Zero. Dodo weeps."],
    ["Getting there!","Dodo believes in you 💪","Keep it up!","Good start!"],
    ["Halfway! Nice 😊","Dodo is pleased!","Half done, half to go.","Looking good!"],
    ["Almost!! 🌟","So close!!","Nearly there!! 🔥","Don't stop now!!"],
    ["100%!! 🎊","PERFECT!!","ALL DONE!! 🏆","DODO LOVES YOU!! 💛"]
  ];

  const bgColors = [
    'linear-gradient(135deg,#ffe5e5,#fff3e0)',
    'linear-gradient(135deg,#fff3e0,#fffde7)',
    'linear-gradient(135deg,#f3e5ff,#fff3e0)',
    'linear-gradient(135deg,#e8f5e9,#f3e5ff)',
    'linear-gradient(135deg,#e8f5e9,#e3f2fd)'
  ];

  function drawFace(t){
    ctx.clearRect(0,0,W,W);
    const headColors=[[255,180,180],[255,220,120],[255,210,63],[255,210,63],[6,214,160]];
    const idx=Math.min(3,Math.floor(t*4));
    const frac=(t*4)-idx;
    const c1=headColors[Math.min(idx,4)];
    const c2=headColors[Math.min(idx+1,4)];
    const r=Math.round(lerp(c1[0],c2[0],frac));
    const g=Math.round(lerp(c1[1],c2[1],frac));
    const b=Math.round(lerp(c1[2],c2[2],frac));

    ctx.beginPath(); ctx.arc(CX+2,CY+3,R,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.07)'; ctx.fill();

    ctx.beginPath(); ctx.arc(CX,CY,R,0,Math.PI*2);
    ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.1)'; ctx.lineWidth=1.5; ctx.stroke();

    const blush=Math.max(0,(t-0.4)*1.5);
    if(blush>0){
      ctx.beginPath(); ctx.ellipse(CX-18,CY+9,8,5,0,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,120,120,${blush*0.4})`; ctx.fill();
      ctx.beginPath(); ctx.ellipse(CX+18,CY+9,8,5,0,0,Math.PI*2);
      ctx.fill();
    }

    const eyeY=CY-7;
    const browAngle=lerp(0.3,-0.25,t);
    const browY=lerp(eyeY-11,eyeY-13,t);
    ctx.strokeStyle='#1a1814'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(CX-17,browY+(browAngle*6)); ctx.lineTo(CX-8,browY-(browAngle*6)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CX+8,browY-(browAngle*6)); ctx.lineTo(CX+17,browY+(browAngle*6)); ctx.stroke();

    const eyeH=lerp(4,2.8,Math.max(0,(t-0.6)/0.4));
    ctx.fillStyle='#1a1814';
    ctx.beginPath(); ctx.ellipse(CX-12,eyeY,4,eyeH,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(CX+12,eyeY,4,eyeH,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='white';
    ctx.beginPath(); ctx.arc(CX-11,eyeY-1.5,1.2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(CX+13,eyeY-1.5,1.2,0,Math.PI*2); ctx.fill();

    if(t<0.25){
      const to=(0.25-t)/0.25;
      ctx.fillStyle=`rgba(100,180,255,${to})`;
      ctx.beginPath(); ctx.ellipse(CX-12,eyeY+8,2.5,4,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(CX+12,eyeY+8,2.5,4,0,0,Math.PI*2); ctx.fill();
    }

    const mY=CY+15, mW=lerp(13,18,t), curve=lerp(-10,12,t);
    ctx.beginPath(); ctx.moveTo(CX-mW,mY);
    ctx.quadraticCurveTo(CX,mY+curve,CX+mW,mY);
    ctx.strokeStyle='#1a1814'; ctx.lineWidth=2; ctx.stroke();

    if(t>0.9){
      const op=(t-0.9)/0.1*6;
      ctx.beginPath();
      ctx.moveTo(CX-mW,mY); ctx.quadraticCurveTo(CX,mY+curve+op,CX+mW,mY);
      ctx.quadraticCurveTo(CX,mY+curve+op+3,CX-mW,mY);
      ctx.fillStyle='#1a1814'; ctx.fill();
    }

    if(t>0.85){
      const so=(t-0.85)/0.15;
      ctx.globalAlpha=so; ctx.font='11px serif';
      ctx.fillText('⭐',CX-36,CY-22);
      ctx.fillText('✨',CX+20,CY-26);
      ctx.globalAlpha=1;
    }
  }

  const progFill = document.querySelector('.progress-fill');
  let pct = 0;
  if(progFill){
    const style = progFill.getAttribute('style') || '';
    const match = style.match(/--pct:\s*(\d+)/);
    if(match) pct = parseInt(match[1]);
  }

  const t = pct/100;
  drawFace(t);

  const level = pct===100 ? 4 : Math.min(3, Math.floor(pct/25));
  if(bubble) bubble.textContent = messages[level][Math.floor(Math.random()*4)];
  if(wrap) wrap.style.background = bgColors[level];
});