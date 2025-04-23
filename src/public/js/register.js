//PF/src/public/js/register.js

const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    console.log(data);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    // Si el usuario es admin, permite enviar el rol
    if (isAdmin()) {
        obj.role = document.getElementById('roleSelect').value;
    }
    console.log("Objeto formado:");
    console.log(obj);
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            result.json();
            alert("Usuario creado con exito!");
            window.location.replace('/api/usersViews/login');
        } else {
            alert("No se pudo crear el usuario!");
        }
    }).catch(error => {
        console.error("Error en la petición fetch", error)
        alert("Error al enviar el formulario")
    });
})

function isAdmin() {
    return document.body.classList.contains('admin'); // ejemplo de verificación simple
}