// ==========================================
// 1. SUPABASE SETUP
// ==========================================
const SUPABASE_URL = 'https://sadprddxjtqscsourwub.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZHByZGR4anRxc2Nzb3Vyd3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MjYyNTgsImV4cCI6MjA4MDAwMjI1OH0.-WHvQpXjwPTxaB_tbRDoBNcz80cWeORAnCl3QLDzuW0';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 2. SPOTLIGHT MOUSE LOGIC (New)
// ==========================================
const card = document.getElementById('authCard');

if (card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS variables for spotlight
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
}

// ==========================================
// 3. UI LOGIC (Form Switching)
// ==========================================
function toggleForm(type) {
    const login = document.getElementById('login-section');
    const signup = document.getElementById('signup-section');
    
    if (type === 'signup') {
        login.classList.remove('active');
        setTimeout(() => signup.classList.add('active'), 200);
    } else {
        signup.classList.remove('active');
        setTimeout(() => login.classList.add('active'), 200);
    }
}

document.getElementById('goSignup').addEventListener('click', () => toggleForm('signup'));
document.getElementById('goLogin').addEventListener('click', () => toggleForm('login'));

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.querySelector('span').innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==========================================
// 4. AUTH LOGIC (LOGIN & SIGNUP)
// ==========================================

// --- SIGN IN ---
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const original = btn.innerHTML;
    btn.innerHTML = 'Verifying...';

    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email, password
    });

    if (error) {
        showToast(error.message);
        btn.innerHTML = original;
    } else {
        showToast("Success! Entering Workspace...");
        setTimeout(() => {
            window.location.href = "dashboard.html"; 
        }, 1500);
    }
});

// --- SIGN UP ---
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const original = btn.innerHTML;
    btn.innerHTML = 'Creating ID...';

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const { data, error } = await supabaseClient.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
    });

    if (error) {
        showToast(error.message);
        btn.innerHTML = original;
    } else {
        if(data.session) {
            showToast("Account Created! Redirecting...");
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1500);
        } else {
            showToast("Success! Verify your email.");
            e.target.reset();
            btn.innerHTML = original;
        }
    }
});


