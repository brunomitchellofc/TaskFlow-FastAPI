// Add Todo JS
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
        form.reset(); // Clear the form
      } else {
        // Handle error
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
}

// Edit Todo JS
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
      console.log(token);
      if (!token) {
        throw new Error("Authentication token not found");
      }

      console.log(`${todoId}`);

      const response = await fetch(`/todos/todo/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        window.location.href = "/todos/todo-page"; // Redirect to the todo page
      } else {
        // Handle error
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });

  document
    .getElementById("deleteButton")
    .addEventListener("click", async function () {
      var url = window.location.pathname;
      const todoId = url.substring(url.lastIndexOf("/") + 1);

      try {
        const token = getCookie("access_token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`/todos/todo/${todoId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Handle success
          window.location.href = "/todos/todo-page"; // Redirect to the todo page
        } else {
          // Handle error
          const errorData = await response.json();
          alert(`Error: ${errorData.detail}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    });
}

// Login JS
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
        // Handle success (e.g., redirect to dashboard)
        const data = await response.json();
        // Delete any cookies available
        logout();
        // Save token to cookie
        document.cookie = `access_token=${data.access_token}; path=/`;
        window.location.href = "/todos/todo-page"; // Change this to your desired redirect page
      } else {
        // Handle error
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
}

// Register JS
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.password2) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      email: data.email,
      username: data.username,
      first_name: data.firstname,
      last_name: data.lastname,
      role: data.role,
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
        window.location.href = "/auth/login-page";
      } else {
        // Handle error
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
}

// Helper function to get a cookie by name
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
  // Get all cookies
  const cookies = document.cookie.split(";");

  // Iterate through all cookies and delete each one
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    // Set the cookie's expiry date to a past date to delete it
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }

  // Redirect to the login page
  window.location.href = "/auth/login-page";
}


(function(){
  const canvas = document.getElementById('dodo-face');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const wrap = document.getElementById('dodo-wrap');
  const anim = document.getElementById('dodo-anim');
  const bubble = document.getElementById('dodo-bubble');
  const W=90, CX=45, CY=45, R=38;
 
  function lerp(a,b,t){ return a+(b-a)*t; }
 
  const messages = [
    ["Dodo is sad... 😢", "Nothing done yet.", "Come on, just one!", "Zero. Dodo weeps."],
    ["Getting there!", "Dodo believes in you.", "Keep it up! 💪", "Good start!"],
    ["Halfway! Nice. 😊", "Dodo is pleased!", "Half done, half to go.", "Looking good!"],
    ["Almost!! 🌟", "So close!!", "Nearly there!! 🔥", "Don't stop now!!"],
    ["100%!! 🎊", "PERFECT!!", "ALL DONE!! 🏆", "DODO LOVES YOU!! 💛"]
];
  
  const bgColors = ['#fff5f5','#fff9f0','#f0fdf9','#fffbf0','#edfdf6'];
 
  function drawFace(t){
    ctx.clearRect(0,0,W,W);
    const headColors = [[255,180,180],[255,220,120],[255,210,63],[255,210,63],[6,214,160]];
    const idx = Math.min(3, Math.floor(t*4));
    const frac = (t*4)-idx;
    const c1 = headColors[Math.min(idx,4)];
    const c2 = headColors[Math.min(idx+1,4)];
    const r=Math.round(lerp(c1[0],c2[0],frac));
    const g=Math.round(lerp(c1[1],c2[1],frac));
    const b=Math.round(lerp(c1[2],c2[2],frac));
 
    // shadow
    ctx.beginPath(); ctx.arc(CX+2,CY+3,R,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.07)'; ctx.fill();
 
    // head
    ctx.beginPath(); ctx.arc(CX,CY,R,0,Math.PI*2);
    ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.1)'; ctx.lineWidth=1.5; ctx.stroke();
 
    // blush
    const blush = Math.max(0,(t-0.4)*1.5);
    if(blush>0){
      ctx.beginPath(); ctx.ellipse(CX-18,CY+9,8,5,0,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,120,120,${blush*0.4})`; ctx.fill();
      ctx.beginPath(); ctx.ellipse(CX+18,CY+9,8,5,0,0,Math.PI*2);
      ctx.fill();
    }
 
    // eyebrows
    const eyeY = CY-7;
    const browAngle = lerp(0.3,-0.25,t);
    const browY = lerp(eyeY-11,eyeY-13,t);
    ctx.strokeStyle='#1a1814'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(CX-17,browY+(browAngle*6)); ctx.lineTo(CX-8,browY-(browAngle*6)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CX+8,browY-(browAngle*6)); ctx.lineTo(CX+17,browY+(browAngle*6)); ctx.stroke();
 
    // eyes
    const eyeH = lerp(4,2.8,Math.max(0,(t-0.6)/0.4));
    ctx.fillStyle='#1a1814';
    ctx.beginPath(); ctx.ellipse(CX-12,eyeY,4,eyeH,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(CX+12,eyeY,4,eyeH,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='white';
    ctx.beginPath(); ctx.arc(CX-11,eyeY-1.5,1.2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(CX+13,eyeY-1.5,1.2,0,Math.PI*2); ctx.fill();
 
    // tears
    if(t<0.25){
      const to=(0.25-t)/0.25;
      ctx.fillStyle=`rgba(100,180,255,${to})`;
      ctx.beginPath(); ctx.ellipse(CX-12,eyeY+8,2.5,4,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(CX+12,eyeY+8,2.5,4,0,0,Math.PI*2); ctx.fill();
    }
 
    // mouth
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
 
    // stars
    if(t>0.85){
      const so=(t-0.85)/0.15;
      ctx.globalAlpha=so; ctx.font='11px serif';
      ctx.fillText('⭐',CX-36,CY-22);
      ctx.fillText('✨',CX+20,CY-26);
      ctx.globalAlpha=1;
    }
  }
 
  // read pct from DOM
  const progFill = document.querySelector('.progress-fill');
  let pct = 0;
  if(progFill){
    const style = progFill.getAttribute('style') || '';
    const match = style.match(/--pct:\s*(\d+)/);
    if(match) pct = parseInt(match[1]);
  }
 
  const t = pct/100;
  drawFace(t);
 
  const level = pct===100 ? 4 : Math.min(3,Math.floor(pct/25));
  bubble.textContent = messages[level][Math.floor(Math.random()*4)];
  wrap.style.background = bgColors[level];
})();
