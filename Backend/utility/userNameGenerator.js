const generateUsername = (fullName) => {
  if (!fullName) return null;

  // Clean and split the full name
  const name = fullName.trim().toLowerCase();
  const parts = name.split(/\s+/); // split by spaces

  // Base username structure
  let baseUsername = parts[0];
  if (parts.length > 1) {
    baseUsername += "_" + parts[parts.length - 1];
  }

  // Remove non-alphanumeric (except _)
  baseUsername = baseUsername.replace(/[^a-z0-9_]/g, "");

  // Add random 3-digit number to ensure uniqueness
  const randomNum = Math.floor(100 + Math.random() * 900);
  const username = `${baseUsername}${randomNum}`;

  return username;
};

export {generateUsername}