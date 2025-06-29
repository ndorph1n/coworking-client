export const validate = (form) => {
  const errs = {};
  const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]{2,50}$/;
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.firstName.trim()) errs.firstName = "Имя обязательно";
  else if (!nameRegex.test(form.firstName)) errs.firstName = "Недопустимое имя";

  if (!form.lastName.trim()) errs.lastName = "Фамилия обязательна";
  else if (!nameRegex.test(form.lastName)) errs.lastName = "Недопустимая фамилия";

  if (!form.email.trim()) errs.email = "Email обязателен";
  else if (!emailRegex.test(form.email)) errs.email = "Некорректный email";

  if (form.phone && !phoneRegex.test(form.phone))
    errs.phone = "Некорректный номер телефона";

  if (!form.password) errs.password = "Пароль обязателен";
  else if (form.password.length < 6) errs.password = "Минимум 6 символов";

  if (!form.confirm) errs.confirm = "Пароль обязателен";
  else if (form.password !== form.confirm) errs.confirm = "Пароли не совпадают";

  return errs;
};
