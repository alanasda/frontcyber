const container = document.getElementById('container');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const introLoader = document.querySelector('.intro-loader');

const messageContainers = {
    login: document.getElementById('login-error'),
    register: document.getElementById('register-error')
};

function showMessage(formType, message, isSuccess = false) {
    const container = messageContainers[formType];
    container.innerHTML = `
        <div class="${isSuccess ? 'success-message' : 'error-message'}">
            ${message}
        </div>
    `;
    container.style.display = 'block';
    setTimeout(() => container.style.display = 'none', 5000);
}

function switchForms(showRegister) {
    loginSection.classList.remove('active');
    registerSection.classList.remove('active');

    if (showRegister) {
        container.classList.add('register-mode');
        setTimeout(() => {
            registerSection.classList.add('active');
            triggerAnimations(registerSection);
        }, 150);
    } else {
        container.classList.remove('register-mode');
        setTimeout(() => {
            loginSection.classList.add('active');
            triggerAnimations(loginSection);
        }, 150);
    }
}

function triggerAnimations(section) {
    const elements = section.querySelectorAll('h2, .input-group, .btn, .switch-link');
    elements.forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
    });
}

async function handleFormSubmit(e, isLogin) {
    e.preventDefault();
    const formType = isLogin ? 'login' : 'register';
    const form = isLogin ? loginForm : registerForm;
    const button = form.querySelector('.btn');

    if (button.classList.contains('loading')) return;
    button.classList.add('loading');

    try {
        const formData = {
            email: document.getElementById(isLogin ? 'login-email' : 'register-email').value,
            senha: document.getElementById(isLogin ? 'login-password' : 'register-password').value
        };

        if (!isLogin) formData.nome = document.getElementById('register-fullname').value;

        const response = await fetch(`https://cyberdigital-4.onrender.com/${formType}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            if (isLogin) {
                showMessage('login', `🛡️ Bem-vindo, ${data.nome}! Redirecionando...`, true);
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                showMessage('register', '✅ Cadastro realizado com sucesso! Voltando ao login...', true);
                setTimeout(() => switchForms(false), 2000);
            }
        } else {
            showMessage(formType, `⚠️ ${data.message}`);
        }

    } catch (error) {
        showMessage(formType, `⚠️ Erro inesperado: ${error.message}`);
    } finally {
        button.classList.remove('loading');
    }
}

showRegisterBtn.addEventListener('click', () => switchForms(true));
showLoginBtn.addEventListener('click', () => switchForms(false));
loginForm.addEventListener('submit', (e) => handleFormSubmit(e, true));
registerForm.addEventListener('submit', (e) => handleFormSubmit(e, false));

// Toggle senha visível no cadastro
const registerPasswordInput = document.getElementById('register-password');
const registerPasswordToggle = document.getElementById('register-password-toggle');

registerPasswordToggle.addEventListener('click', () => {
    const type = registerPasswordInput.type === 'password' ? 'text' : 'password';
    registerPasswordInput.type = type;
    registerPasswordToggle.innerHTML = type === 'password'
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
});

// Loader de introdução: 6 segundos com fallback
function hideIntro() {
    introLoader.classList.add('hidden');
    setTimeout(() => {
        loginSection.classList.add('active');
        triggerAnimations(loginSection);
    }, 500);
}

window.addEventListener('load', () => {
    setTimeout(hideIntro, 6000);
});

setTimeout(() => {
    if (!introLoader.classList.contains('hidden')) {
        hideIntro();
    }
}, 8000);
