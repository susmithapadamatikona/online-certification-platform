document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-login-form]");
  const feedback = document.querySelector("[data-login-feedback]");
  if (!form) return;

  const fields = {
    email: form.querySelector("[name='email']"),
    password: form.querySelector("[name='password']"),
    role: form.querySelector("[name='role']"),
  };

  fields.email.value = "";
  fields.password.value = "";
  fields.role.value = "";

  const setFieldError = (name, message = "") => {
    const error = form.querySelector(`[data-error-for='${name}']`);
    const field = fields[name];
    if (error) error.textContent = message;
    if (field) {
      field.classList.toggle("is-invalid", Boolean(message));
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }
  };

  const clearErrors = () => Object.keys(fields).forEach((key) => setFieldError(key));

  Object.entries(fields).forEach(([name, field]) => {
    field.addEventListener("input", () => {
      if (field.value.trim()) setFieldError(name);
    });
    field.addEventListener("change", () => {
      if (field.value.trim()) setFieldError(name);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    feedback.className = "";
    feedback.textContent = "";

    const payload = {
      email: fields.email.value.trim(),
      password: fields.password.value,
      role: fields.role.value,
    };

    let valid = true;
    if (!payload.email) {
      setFieldError("email", "Email address is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setFieldError("email", "Enter a valid email address.");
      valid = false;
    }
    if (!payload.password) {
      setFieldError("password", "Password is required.");
      valid = false;
    }
    if (!payload.role) {
      setFieldError("role", "Please choose a role.");
      valid = false;
    }

    if (!valid) return;

    const result = loginUser(payload);
    if (!result.ok) {
      feedback.className = "alert error";
      feedback.textContent = result.message;
      return;
    }

    feedback.className = "alert success";
    feedback.textContent = "Login successful. Redirecting to your dashboard...";
    window.location.href = "dashboard.html";
  });
});
