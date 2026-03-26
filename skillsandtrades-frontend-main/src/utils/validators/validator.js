export const validateForm = (formData, rules) => {
    const errors = {};

    for (const field in rules) {
        const value = formData[field];
        const validations = rules[field];

        for (const rule of validations) {
            // Required
            if (rule.type === "required" && !value) { errors[field] = rule.message; break }

            // Min length
            if (rule.type === "min" && value?.length < rule.value) { errors[field] = rule.message; break }

            // Max Length
            if (rule.type === "max" && value?.length > rule.value) { errors[field] = rule.message; break }

            // Email
            if (rule.type === "email" && value) {
                if (!(/^[^\s@]+@[^\s@ ]+\.[^\s@]+$/).test(value)) { errors[field] = rule.message; break }
            }

            // Phone number
            if (rule.type === "phone" && value) {
                if (!/^\+?[0-9 ]{7,15}$/.test(value)) { errors[field] = rule.message; break }
            }

            // Phone min length
            if (rule.type === "phoneLength" && value?.length < rule.value) { errors[field] = rule.message; break }

            // Username validation
            if (rule.type === "username" && value) {
                if (!(/^[A-Za-z0-9._-]+$/).test(value)) { errors[field] = rule.message; break }
            }

            // Strong Password
            if (rule.type === "passwordStrong" && value) {
                const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])([^\s]){8,}$/;
                if (!strongRegex.test(value)) { errors[field] = rule.message; break }
            }

            // Compare fields (ex: confirm password)
            if (rule.type === "match" && value !== formData[rule.field]) { errors[field] = rule.message; break }

            // Image format
            if (rule.type === "imageFormat" && value) {
                const allowed = ["image/jpeg", "image/png", "image/jpg"];
                if (!allowed.includes(value.type)) { errors[field] = rule.message; break }
            }

            // Image size (in MB)
            if (rule.type === "imageSize" && value) {
                const maxBytes = rule.value * 1024 * 1024;
                if (value.size > maxBytes) { errors[field] = rule.message; break }
            }

            // Age validation
            if (rule.type === "age" && value) {
                const dob = new Date(value);
                const today = new Date();
                let age = today.getFullYear() - dob.getFullYear();
                const m = today.getMonth() - dob.getMonth();

                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

                if (age < rule.value) { errors[field] = rule.message; break }
            }

            if (rule.type === "url" && value) {
                try { new URL(value) }
                catch { errors[field] = rule.message || "Invalid URL format"; break }
            }
        }
    }
    return errors;
};
