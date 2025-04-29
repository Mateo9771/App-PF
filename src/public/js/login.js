// PF/src/public/js/login.js
const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(result => {
            if (result.status === 200) {
                return result.json().then(json => {
                    console.log('Cookies generadas:', document.cookie);
                    alert('¡Login realizado con éxito!');
                    window.location.href = json.redirect || '/products';
                });
            } else if (result.status === 401) {
                alert('Login inválido, revisa tus credenciales.');
            } else {
                return result.json().then(json => {
                    alert(`Error: ${json.message || json.error}`);
                });
            }
        })
        .catch(err => {
            console.error('Error en login:', err);
            alert('Ocurrió un error al intentar iniciar sesión.');
        });
});