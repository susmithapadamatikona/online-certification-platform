document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-register-form]");
  const feedback = document.querySelector("[data-register-feedback]");
  if (!form) return;

  const fields = {
    fullName: form.querySelector("[name='fullName']"),
    email: form.querySelector("[name='email']"),
    phone: form.querySelector("[name='phone']"),
    password: form.querySelector("[name='password']"),
    confirmPassword: form.querySelector("[name='confirmPassword']"),
    role: form.querySelector("[name='role']"),
  };

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
      fullName: fields.fullName.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      password: fields.password.value,
      confirmPassword: fields.confirmPassword.value,
      role: fields.role.value,
    };

    let valid = true;
    if (!payload.fullName) {
      setFieldError("fullName", "Full name is required.");
      valid = false;
    }
    if (!payload.email) {
      setFieldError("email", "Email address is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setFieldError("email", "Enter a valid email address.");
      valid = false;
    }
    if (!payload.phone) {
      setFieldError("phone", "Phone number is required.");
      valid = false;
    }
    if (!payload.password || payload.password.length < 8) {
      setFieldError("password", "Password must be at least 8 characters long.");
      valid = false;
    }
    if (!payload.confirmPassword) {
      setFieldError("confirmPassword", "Please confirm your password.");
      valid = false;
    } else if (payload.confirmPassword !== payload.password) {
      setFieldError("confirmPassword", "Passwords do not match.");
      valid = false;
    }
    if (!payload.role) {
      setFieldError("role", "Please choose a role.");
      valid = false;
    }

    if (!valid) return;

    const result = registerUser(payload);
    if (!result.ok) {
      feedback.className = "alert error";
      feedback.textContent = result.message;
      return;
    }

    feedback.className = "alert success";
    feedback.textContent = "Registration complete. You can now log in with your details.";
    form.reset();
  });
});
