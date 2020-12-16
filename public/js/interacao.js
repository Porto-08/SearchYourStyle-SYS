//Visualizar senha - inicio
function password() {
    let password = document.getElementById("password")
    let img = document.getElementById("img")
    if (password.type == "password") {
        password.type = "text"
        img.className = "fas fa-eye-slash icon"
    }
    else {
        password.type = "password"
        img.className = "fas fa-eye icon"
    }
}

function confpassword() {
    let password2 = document.getElementById("confpassword")
    let img2 = document.getElementById("img_2")
    if (password2.type == "password") {
        password2.type = "text"
        img2.className = "fas fa-eye-slash icon"
    }
    else {
        password2.type = "password"
        img2.className = "fas fa-eye icon"
    }
}
//Visualizar senha - fim
const masks = {
    names(value) {
        return value
            .replace(/\d/g, '')
    },
    cellphone(value) {
        return value
            .replace(/\D/g, '') // Remove qualquer carctere que não é número
            .replace(/(\d{2})(\d)/, '($1) $2') // Coloca o ddd
            .replace(/(\d{5})(\d)/, '$1-$2')  // Coloca o '-' após 5 números
            .replace(/(-\d{4})\d+?$/, '$1') // Não acrescenta mais números do que 4 após o '-'
    },
    number(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})\d+?$/, '$1')
    },
    cnpj(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
    },
    landline(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1')
    },
    openTime(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1:$2')
            .replace(/(:\d{2})\d+?$/, '$1')
    },
    closeTime(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1:$2')
            .replace(/(:\d{2})\d+?$/, '$1')
    }
}

document.querySelectorAll('input').forEach(($input) => {
    const field = $input.dataset.js

    $input.addEventListener('input', (e) => {
        e.target.value = masks[field](e.target.value)
    }, false)
})




