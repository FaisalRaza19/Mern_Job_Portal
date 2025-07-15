export const validateJobPostData = (data) => {
    const errors = [];

    // required fields
    if (!data.title || typeof data.title !== "string" || data.title.trim().length < 3) {
        errors.push("Job title is required and must be at least 3 characters long.");
    }

    if (!data.description || typeof data.description !== "string" || data.description.trim().length < 20) {
        errors.push("Job description is required and must be at least 20 characters long.");
    }

    const validEmploymentTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'];
    if (!data.employmentType || !validEmploymentTypes.includes(data.employmentType)) {
        errors.push("Valid employment type is required.");
    }

    if (typeof data.salary === "object") {
        if (typeof data.salary.min_salary === "string") {
            data.salary.min_salary = Number(data.salary.min_salary);
        }
        if (typeof data.salary.max_salary === "string") {
            data.salary.max_salary = Number(data.salary.max_salary);
        }
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

    if (typeof data.openings === "string") {
        data.openings = Number(data.openings);
    }

    if (data.openings !== undefined && (typeof data.openings !== 'number' || isNaN(data.openings) || data.openings <= 0)) {
        errors.push("Openings must be a positive number.");
    }

    if (typeof data.skillsRequired === "string") {
        const skills = JSON.parse(data.skillsRequired);
        if (Array.isArray(skills)) {
            data.skillsRequired = skills.map(skill => String(skill));
        } else {
            errors.push("Skills must be a valid array of strings.");
        }
    } else {
        errors.push("skillsRequired must be an array of strings.");
    }


    // optional fields
    const validExperienceLevels = ['Entry', 'Mid', 'Senior', 'Lead'];
    if (data.experienceLevel && !validExperienceLevels.includes(data.experienceLevel)) {
        errors.push("Invalid experience level.");
    }

    if (data.applicationDeadline && isNaN(Date.parse(data.applicationDeadline))) {
        errors.push("Application deadline must be a valid date.");
    }

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