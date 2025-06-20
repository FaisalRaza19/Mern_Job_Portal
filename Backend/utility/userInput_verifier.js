const validateUserInput = (fullName, email, password, userName) => {
  const errors = {};

  // Validate fullName
  if (fullName !== undefined && fullName !== null && fullName.trim() !== '') {
    const name = fullName.trim();
    if (name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
      errors.fullName = 'Full name must be at least 3 characters and contain only letters and spaces.';
    }
  }

  // Validate email
  if (email !== undefined && email !== null && email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.email = 'Invalid email format.';
    }
  }

  // Validate password
  if (password !== undefined && password !== null && password.trim() !== '') {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password.trim())) {
      errors.password = 'Password must be at least 8 characters long and include at least one special character.';
    }
  }

  // Validate userName
  if (userName !== undefined && userName !== null && userName.trim() !== '') {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(userName.trim())) {
      errors.userName = 'Username must be 3–20 characters long, and can contain letters, numbers, and underscores only.';
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
};

export { validateUserInput };
