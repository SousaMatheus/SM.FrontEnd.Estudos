const contrastToggle = document.querySelector(".contrast-toggle");

if (contrastToggle) {
  const enabled = localStorage.getItem("rede-acolher-contrast") === "true";
  document.body.classList.toggle("high-contrast", enabled);
  contrastToggle.setAttribute("aria-pressed", String(enabled));
  contrastToggle.addEventListener("click", () => {
    const active = document.body.classList.toggle("high-contrast");
    contrastToggle.setAttribute("aria-pressed", String(active));
    localStorage.setItem("rede-acolher-contrast", String(active));
  });
}

const form = document.querySelector("#volunteer-form");

if (form) {
  const cpf = document.querySelector("#cpf");
  const telefone = document.querySelector("#telefone");
  const cep = document.querySelector("#cep");
  const feedback = document.querySelector("#form-feedback");

  const digits = value => value.replace(/\D/g, "");

  cpf.addEventListener("input", () => {
    const value = digits(cpf.value).slice(0, 11);
    cpf.value = value.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    cpf.setCustomValidity("");
    cpf.removeAttribute("aria-invalid");
    document.querySelector("#cpf-error").textContent = "";
  });

  telefone.addEventListener("input", () => {
    const value = digits(telefone.value).slice(0, 11);
    telefone.value = value.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    telefone.setCustomValidity("");
    telefone.removeAttribute("aria-invalid");
    document.querySelector("#telefone-error").textContent = "";
  });

  cep.addEventListener("input", () => {
    const value = digits(cep.value).slice(0, 8);
    cep.value = value.replace(/(\d{5})(\d)/, "$1-$2");
    cep.setCustomValidity("");
    cep.removeAttribute("aria-invalid");
    document.querySelector("#cep-error").textContent = "";
  });

  function validCpf(value) {
    const number = digits(value);
    if (number.length !== 11 || /^(\d)\1{10}$/.test(number)) return false;
    const calc = length => {
      let sum = 0;
      for (let index = 0; index < length; index++) sum += Number(number[index]) * (length + 1 - index);
      const result = (sum * 10) % 11;
      return result === 10 ? 0 : result;
    };
    return calc(9) === Number(number[9]) && calc(10) === Number(number[10]);
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    feedback.textContent = "";
    const checks = [
      [cpf, validCpf(cpf.value), "Informe um CPF válido."],
      [telefone, [10, 11].includes(digits(telefone.value).length), "Informe um telefone com DDD."],
      [cep, digits(cep.value).length === 8, "Informe um CEP com 8 dígitos."]
    ];
    let firstInvalid = null;
    for (const [field, valid, message] of checks) {
      const error = document.querySelector(`#${field.id}-error`);
      field.setCustomValidity(valid ? "" : message);
      if (!valid) {
        field.setAttribute("aria-invalid", "true");
        error.textContent = message;
        if (!firstInvalid) firstInvalid = field;
      } else {
        field.removeAttribute("aria-invalid");
        error.textContent = "";
      }
    }
    if (firstInvalid) {
      firstInvalid.focus();
      form.reportValidity();
      return;
    }
    feedback.textContent = "Cadastro validado! Obrigado por querer fazer parte da Rede Acolher.";
    form.reset();
  });
}

