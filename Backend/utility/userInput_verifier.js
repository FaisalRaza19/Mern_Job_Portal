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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]{8,}$/;
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

// verify company data 
const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isNonEmptyString = (val) =>
  typeof val === 'string' && val.trim().length > 0;

const isCompanySizeValid = (size) => {
  const validSizes = [
    '1-10', '11-50', '51-200', '201-500',
    '501-1000', '1001-5000', '5001-10000', '10000+'
  ];
  return validSizes.includes(size);
};

// Specific platform validators
const isFacebookLink = (url) =>
  /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+$/.test(url);

const isLinkedInLink = (url) =>
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+$/.test(url);

const isGithubLink = (url) =>
  /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+$/.test(url);

const isXLink = (url) =>
  /^https?:\/\/(www\.)?X\.com\/[A-Za-z0-9_]+$/.test(url);

const isInstagramLink = (url) =>
  /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+$/.test(url);

const validateSocialLinks = (links) => {
  const results = {};
  if (!links || typeof links !== 'object') return results;

  for (const [platform, url] of Object.entries(links)) {
    if (!isNonEmptyString(url)) continue;

    switch (platform.toLowerCase()) {
      case 'facebook':
        results.facebook = isFacebookLink(url);
        break;
      case 'linkedin':
        results.linkedin = isLinkedInLink(url);
        break;
      case 'github':
        results.github = isGithubLink(url);
        break;
      case 'X':
        results.X = isXLink(url);
        break;
      case 'instagram':
        results.instagram = isInstagramLink(url);
        break;
      default:
        results[platform] = isValidURL(url); // Fallback for unexpected keys
    }
  }

  return results;
};

const socialLinkVerify = (socialLinks) => {
  const errors = {}
  const socialErrors = validateSocialLinks(socialLinks || {});
  for (const [key, isValid] of Object.entries(socialErrors)) {
    if (!isValid) {
      errors[`socialLinks.${key}`] = `${key} URL is invalid.`;
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

const validateCompanyData = (data) => {
  const errors = {};

  if (!isNonEmptyString(data.companyName)) {
    errors.companyName = 'Company name is required and must be a string.';
  }

  if (!isNonEmptyString(data.companyType)) {
    errors.companyType = 'Company type is required and must be a string.';
  }

  if (!isCompanySizeValid(data.companySize)) {
    errors.companySize = 'Company size is invalid. Example: "1-10", "51-200".';
  }

  if (!isValidURL(data.companyWeb)) {
    errors.companyWeb = 'Company website must be a valid URL.';
  }

  if (!isNonEmptyString(data.companyDescription)) {
    errors.companyDescription = 'Company description is required.';
  }

  const socialErrors = validateSocialLinks(data.socialLinks || {});
  for (const [key, isValid] of Object.entries(socialErrors)) {
    if (!isValid) {
      errors[`socialLinks.${key}`] = `${key} URL is invalid. Get ${key} user profile not ${key} url`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};



export { validateUserInput, validateCompanyData,socialLinkVerify};
