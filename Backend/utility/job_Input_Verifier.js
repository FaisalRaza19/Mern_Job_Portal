export const validateJobPostData = (data) => {
    const errors = [];

    if (typeof data.isRemote === "string") {
        data.isRemote = data.isRemote === "true";
    }

    if (typeof data.openings === "string") {
        data.openings = Number(data.openings);
    }

    if (typeof data.skillsRequired === "string") {
        try {
            data.skillsRequired = JSON.parse(data.skillsRequired);
        } catch (err) {
            errors.push("Invalid format for skillsRequired. It must be a valid JSON array.");
        }
    }

    if (typeof data.salary === "string") {
        try {
            data.salary = JSON.parse(data.salary);
        } catch (err) {
            errors.push("Invalid format for salary. It must be a valid object.");
        }
    }

    if (typeof data.salary === "object") {
        if (typeof data.salary.min_salary === "string") {
            data.salary.min_salary = Number(data.salary.min_salary);
        }
        if (typeof data.salary.max_salary === "string") {
            data.salary.max_salary = Number(data.salary.max_salary);
        }
    }

    if (!data.title || typeof data.title !== "string" || data.title.trim().length < 3) {
        errors.push("Job title is required and must be at least 3 characters long.");
    }

    if (!data.description || typeof data.description !== "string" || data.description.trim().length < 20) {
        errors.push("Job description is required and must be at least 20 characters long.");
    }

    if (data.isRemote === false) {
        if (!data.location || typeof data.location !== "string" || data.location.trim().length < 3) {
            errors.push("Location is required for non-remote jobs.");
        }
    }

    const validEmploymentTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'];
    if (!data.employmentType || !validEmploymentTypes.includes(data.employmentType)) {
        errors.push("Valid employment type is required.");
    }

    if (!data.salary || typeof data.salary !== 'object') {
        errors.push("Salary is required and must be an object.");
    } else {
        const { min_salary, max_salary, currency } = data.salary;

        if (min_salary === undefined || typeof min_salary !== 'number' || isNaN(min_salary) || min_salary < 0) {
            errors.push("Minimum salary is required and must be a non-negative number.");
        }

        if (max_salary === undefined || typeof max_salary !== 'number' || isNaN(max_salary) || max_salary <= 0) {
            errors.push("Maximum salary is required and must be greater than 0.");
        }

        if (min_salary >= max_salary) {
            errors.push("Minimum salary must be less than maximum salary.");
        }

        if (!currency || typeof currency !== 'string') {
            errors.push("Currency is required and must be a string.");
        }

        if (currency === "USD" && min_salary === 0) {
            errors.push("Minimum salary in USD cannot be 0.");
        }
    }

    if (!Array.isArray(data.skillsRequired)) {
        errors.push("skillsRequired must be an array of strings.");
    } else if (data.skillsRequired.some(skill => typeof skill !== "string" || !skill.trim())) {
        errors.push("Each skill must be a non-empty string.");
    }

    const validExperienceLevels = ['Entry', 'Mid', 'Senior', 'Lead'];
    if (data.experienceLevel && !validExperienceLevels.includes(data.experienceLevel)) {
        errors.push("Invalid experience level.");
    }

    if (data.openings !== undefined && (typeof data.openings !== 'number' || isNaN(data.openings) || data.openings <= 0)) {
        errors.push("Openings must be a positive number.");
    }

    if (data.applicationDeadline && isNaN(Date.parse(data.applicationDeadline))) {
        errors.push("Application deadline must be a valid date.");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};
