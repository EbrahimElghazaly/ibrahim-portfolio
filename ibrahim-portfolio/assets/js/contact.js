/* ============================================================
   CONTACT.JS — Contact Form
   Validation + Submit + Success/Error states
   ============================================================ */

(function () {
    'use strict';

    const { $, $$, on, clamp } = window.Utils;

    /* ============================================================
       1. CONFIG
       ⚠️ IMPORTANT: Replace FORMSPREE_ID with your own endpoint
       ============================================================ */
    const CONFIG = {
        // Formspree endpoint (get yours at formspree.io)
        // Replace "xxxxxxx" with your actual form ID
        formspreeEndpoint: 'https://formspree.io/f/xxxxxxx',

        // Or use EmailJS instead (uncomment and configure)
        useEmailJS: false,
        emailjsConfig: {
            publicKey: 'YOUR_PUBLIC_KEY',
            serviceId: 'YOUR_SERVICE_ID',
            templateId: 'YOUR_TEMPLATE_ID'
        },

        // Validation rules
        validation: {
            name: {
                minLength: 2,
                maxLength: 60,
                required: true
            },
            email: {
                maxLength: 100,
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            subject: {
                minLength: 3,
                maxLength: 100,
                required: true
            },
            message: {
                minLength: 10,
                maxLength: 1000,
                required: true
            }
        },

        // Messages
        messages: {
            required: 'This field is required',
            invalidEmail: 'Please enter a valid email address',
            nameTooShort: 'Name is too short',
            subjectTooShort: 'Subject is too short',
            messageTooShort: 'Message is too short (min 10 characters)',
            messageTooLong: 'Message is too long (max 1000 characters)',
            sending: 'Sending...',
            success: 'Message sent successfully! I will get back to you soon.',
            error: 'Something went wrong. Please try again or email me directly.',
            networkError: 'Network error. Please check your connection.'
        },

        // Cooldown between submissions (ms)
        submitCooldown: 30000
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    const state = {
        form: null,
        submitBtn: null,
        statusEl: null,
        inputs: {},
        isSubmitting: false,
        lastSubmitTime: 0,
        touchedFields: new Set()
    };

    /* ============================================================
       3. VALIDATE SINGLE FIELD
       ============================================================ */
    function validateField(name, value) {
        const rules = CONFIG.validation[name];
        if (!rules) return { valid: true };

        value = (value || '').trim();

        // Required
        if (rules.required && !value) {
            return { valid: false, message: CONFIG.messages.required };
        }

        // Skip other checks if empty and not required
        if (!value) return { valid: true };

        // Min length
        if (rules.minLength && value.length < rules.minLength) {
            const msgMap = {
                name: CONFIG.messages.nameTooShort,
                subject: CONFIG.messages.subjectTooShort,
                message: CONFIG.messages.messageTooShort
            };
            return {
                valid: false,
                message: msgMap[name] || `Minimum ${rules.minLength} characters`
            };
        }

        // Max length
        if (rules.maxLength && value.length > rules.maxLength) {
            const msgMap = {
                message: CONFIG.messages.messageTooLong
            };
            return {
                valid: false,
                message: msgMap[name] || `Maximum ${rules.maxLength} characters`
            };
        }

        // Pattern (email)
        if (rules.pattern && !rules.pattern.test(value)) {
            return { valid: false, message: CONFIG.messages.invalidEmail };
        }

        return { valid: true };
    }

    /* ============================================================
       4. SHOW FIELD ERROR
       ============================================================ */
    function showFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // Remove old error
        clearFieldError(input);

        // Add error class
        input.classList.add('error');
        formGroup.classList.add('has-error');

        // Create error message
        const errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        errorEl.setAttribute('role', 'alert');
        formGroup.appendChild(errorEl);

        // Shake animation
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }

    /* ============================================================
       5. CLEAR FIELD ERROR
       ============================================================ */
    function clearFieldError(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        input.classList.remove('error');
        formGroup.classList.remove('has-error');

        const errorEl = formGroup.querySelector('.field-error');
        if (errorEl) errorEl.remove();
    }

    /* ============================================================
       6. SHOW FORM STATUS
       ============================================================ */
    function showStatus(message, type = 'success') {
        if (!state.statusEl) return;

        state.statusEl.textContent = message;
        state.statusEl.className = `form-status ${type}`;

        // Add animation
        state.statusEl.classList.add('success-pop');
        setTimeout(() => {
            state.statusEl.classList.remove('success-pop');
        }, 500);
    }

    function clearStatus() {
        if (!state.statusEl) return;
        state.statusEl.textContent = '';
        state.statusEl.className = 'form-status';
    }

    /* ============================================================
       7. VALIDATE ENTIRE FORM
       ============================================================ */
    function validateForm() {
        let isValid = true;
        const errors = {};

        Object.keys(CONFIG.validation).forEach((name) => {
            const input = state.inputs[name];
            if (!input) return;

            const result = validateField(name, input.value);
            if (!result.valid) {
                isValid = false;
                errors[name] = result.message;
                showFieldError(input, result.message);
            } else {
                clearFieldError(input);
            }
        });

        return { isValid, errors };
    }

    /* ============================================================
       8. GET FORM DATA
       ============================================================ */
    function getFormData() {
        const data = {};
        Object.keys(state.inputs).forEach((name) => {
            data[name] = state.inputs[name].value.trim();
        });
        return data;
    }

    /* ============================================================
       9. SET LOADING STATE
       ============================================================ */
    function setLoading(isLoading) {
        state.isSubmitting = isLoading;

        if (!state.submitBtn) return;

        if (isLoading) {
            state.submitBtn.disabled = true;
            state.submitBtn.dataset.originalText = state.submitBtn.innerHTML;
            state.submitBtn.innerHTML = `
                <span class="spinner"></span>
                ${CONFIG.messages.sending}
            `;
            state.submitBtn.classList.add('loading');
        } else {
            state.submitBtn.disabled = false;
            if (state.submitBtn.dataset.originalText) {
                state.submitBtn.innerHTML = state.submitBtn.dataset.originalText;
            }
            state.submitBtn.classList.remove('loading');
        }
    }

    /* ============================================================
       10. SUBMIT TO FORMSPREE
       ============================================================ */
    async function submitToFormspree(data) {
        const response = await fetch(CONFIG.formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Form submission failed');
        }

        return response.json().catch(() => ({}));
    }

    /* ============================================================
       11. SUBMIT VIA EMAILJS
       ============================================================ */
    async function submitToEmailJS(data) {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS not loaded');
        }

        return emailjs.send(
            CONFIG.emailjsConfig.serviceId,
            CONFIG.emailjsConfig.templateId,
            data,
            CONFIG.emailjsConfig.publicKey
        );
    }

    /* ============================================================
       12. HANDLE SUBMIT
       ============================================================ */
    async function handleSubmit(e) {
        e.preventDefault();

        // Prevent double submit
        if (state.isSubmitting) return;

        // Cooldown check
        const now = Date.now();
        const elapsed = now - state.lastSubmitTime;
        if (elapsed < CONFIG.submitCooldown && state.lastSubmitTime > 0) {
            const remaining = Math.ceil((CONFIG.submitCooldown - elapsed) / 1000);
            showStatus(`Please wait ${remaining}s before sending again.`, 'error');
            return;
        }

        // Clear status
        clearStatus();

        // Validate
        const { isValid, errors } = validateForm();

        if (!isValid) {
            showStatus('Please fix the errors above.', 'error');

            // Focus first error field
            const firstErrorName = Object.keys(errors)[0];
            if (firstErrorName && state.inputs[firstErrorName]) {
                state.inputs[firstErrorName].focus();
            }
            return;
        }

        // Get data
        const data = getFormData();

        // Set loading
        setLoading(true);
        showStatus(CONFIG.messages.sending, 'success');

        try {
            // Submit
            if (CONFIG.useEmailJS) {
                await submitToEmailJS(data);
            } else {
                await submitToFormspree(data);
            }

            // Success
            state.lastSubmitTime = Date.now();
            showStatus(CONFIG.messages.success, 'success');

            // Reset form
            state.form.reset();
            state.touchedFields.clear();

            // Clear all errors
            Object.values(state.inputs).forEach(clearFieldError);

            // Dispatch event
            document.dispatchEvent(new CustomEvent('contact:success', {
                detail: { data }
            }));

            // Clear success message after 6 seconds
            setTimeout(() => clearStatus(), 6000);

        } catch (error) {
            console.error('[Contact] Submit error:', error);

            let errorMessage = CONFIG.messages.error;

            if (!navigator.onLine) {
                errorMessage = CONFIG.messages.networkError;
            } else if (error.message && error.message !== 'Form submission failed') {
                errorMessage = error.message;
            }

            showStatus(errorMessage, 'error');

            // Shake the form
            state.form.classList.add('shake');
            setTimeout(() => state.form.classList.remove('shake'), 500);

            // Dispatch event
            document.dispatchEvent(new CustomEvent('contact:error', {
                detail: { error }
            }));

        } finally {
            setLoading(false);
        }
    }

    /* ============================================================
       13. HANDLE FIELD BLUR (validation on blur)
       ============================================================ */
    function handleFieldBlur(e) {
        const input = e.target;
        const name = input.name;

        if (!name || !CONFIG.validation[name]) return;

        state.touchedFields.add(name);

        // Only validate if field has value OR was touched
        if (input.value.trim() || state.touchedFields.has(name)) {
            const result = validateField(name, input.value);
            if (!result.valid) {
                showFieldError(input, result.message);
            } else {
                clearFieldError(input);
            }
        }
    }

    /* ============================================================
       14. HANDLE FIELD INPUT (clear error on type)
       ============================================================ */
    function handleFieldInput(e) {
        const input = e.target;
        const formGroup = input.closest('.form-group');

        // Clear error while typing
        if (formGroup && formGroup.classList.contains('has-error')) {
            const result = validateField(input.name, input.value);
            if (result.valid) {
                clearFieldError(input);
            }
        }
    }

    /* ============================================================
       15. HANDLE FIELD FOCUS
       ============================================================ */
    function handleFieldFocus(e) {
        const formGroup = e.target.closest('.form-group');
        if (formGroup) formGroup.classList.add('focused');
    }

    function handleFieldBlurFocus(e) {
        const formGroup = e.target.closest('.form-group');
        if (formGroup) formGroup.classList.remove('focused');
    }

    /* ============================================================
       16. INIT
       ============================================================ */
    function initContact() {
        state.form = document.getElementById('contactForm');
        state.submitBtn = state.form ? state.form.querySelector('button[type="submit"]') : null;
        state.statusEl = document.getElementById('formStatus');

        // Safety check
        if (!state.form) {
            console.warn('[Contact] Form #contactForm not found');
            return null;
        }

        // Cache inputs
        ['name', 'email', 'subject', 'message'].forEach((fieldName) => {
            const input = state.form.querySelector(`[name="${fieldName}"]`);
            if (input) {
                state.inputs[fieldName] = input;

                // Attach listeners
                on(input, 'blur', handleFieldBlur);
                on(input, 'input', handleFieldInput);
                on(input, 'focus', handleFieldFocus);
                on(input, 'blur', handleFieldBlurFocus);

                // ARIA
                input.setAttribute('aria-required', 'true');
            }
        });

        // Attach submit listener
        on(state.form, 'submit', handleSubmit);

        // Warning if endpoint not configured
        if (!CONFIG.useEmailJS && CONFIG.formspreeEndpoint.includes('xxxxxxx')) {
            console.warn(
                '%c[Contact] ⚠️ Formspree endpoint not configured!',
                'color: #f59e0b; font-weight: bold;'
            );
            console.warn('Replace "xxxxxxx" in CONFIG.formspreeEndpoint with your form ID.');
            console.warn('Get one free at: https://formspree.io');
        }

        // --- Return API ---
        return {
            validate: validateForm,
            reset: () => {
                state.form.reset();
                Object.values(state.inputs).forEach(clearFieldError);
                clearStatus();
                state.touchedFields.clear();
            },
            getData: getFormData,
            setEndpoint: (url) => {
                CONFIG.formspreeEndpoint = url;
            }
        };
    }

    /* ============================================================
       17. EXPOSE GLOBALLY
       ============================================================ */
    window.initContact = initContact;

})();