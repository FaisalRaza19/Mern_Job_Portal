export const validateJobPostData = (data) => {
    const errors = [];

    // Title
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
        errors.push("Job title is required and must be at least 3 characters long.");
    }

    // Requirements
    if (!data.Requirements || typeof data.Requirements !== 'string' || data.Requirements.trim().length < 10) {
        errors.push("Requirements is required and must be at least 10 characters long.");
    }

    // Description
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 20) {
        errors.push("Job description is required and must be at least 20 characters long.");
    }

    // Employment Type
    const validEmploymentTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'];
    if (!data.employmentType || !validEmploymentTypes.includes(data.employmentType)) {
        errors.push("Valid employment type is required.");
    }

    // Salary
    if (!data.salary || typeof data.salary !== 'object') {
        errors.push("Salary is required and must be an object.");
    } else {
        const { min_salary, max_salary, currency } = data.salary;

        const min = typeof min_salary === 'string' ? Number(min_salary) : min_salary;
        const max = typeof max_salary === 'string' ? Number(max_salary) : max_salary;

        if (min === undefined || typeof min !== 'number' || isNaN(min) || min < 0) {
            errors.push("Minimum salary is required and must be a non-negative number.");
        }

        if (max === undefined || typeof max !== 'number' || isNaN(max) || max <= 0) {
            errors.push("Maximum salary is required and must be greater than 0.");
        }

        if (min >= max) {
            errors.push("Minimum salary must be less than maximum salary.");
        }

        if (!currency || typeof currency !== 'string') {
            errors.push("Currency is required and must be a string.");
        }

        if (currency === "USD" && min === 0) {
            errors.push("Minimum salary in USD cannot be 0.");
        }

        // Reassign validated salaries
        data.salary.min_salary = min;
        data.salary.max_salary = max;
    }

    // Openings
    if (data.openings !== undefined) {
        const openings = typeof data.openings === 'string' ? Number(data.openings) : data.openings;
        if (isNaN(openings) || openings <= 0) {
            errors.push("Openings must be a positive number.");
        } else {
            data.openings = openings;
        }
    }

    // Skills Required
    if (!Array.isArray(data.skillsRequired)) {
        errors.push("skillsRequired must be an array of strings.");
    } else if (!data.skillsRequired.every(skill => typeof skill === 'string' && skill.trim().length > 0)) {
        errors.push("Each skill in skillsRequired must be a non-empty string.");
    }

    // Experience Level (optional)
    const validExperienceLevels = ['Entry', 'Mid', 'Senior', 'Lead'];
    if (data.experienceLevel && !validExperienceLevels.includes(data.experienceLevel.trim().charAt(0).toUpperCase() + data.experienceLevel.trim().slice(1).toLowerCase())) {
        errors.push("Invalid experience level.");
    }

    // Application Deadline
    if (data.applicationDeadline) {
        const deadlineDate = new Date(data.applicationDeadline);
        const now = new Date();

        if (isNaN(deadlineDate.getTime())) {
            errors.push("Application deadline must be a valid date.");
        } else if (deadlineDate <= now) {
            errors.push("Application deadline must be a future date.");
        }
    }

    // Location (only if not remote)
    if (data.isRemote === false) {
        if (!data.location || typeof data.location !== "string" || data.location.trim().length < 3) {
            errors.push("Location is required for non-remote jobs and must be at least 3 characters long.");
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};
