const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://timer-app-079v.onrender.com';


class ResetPasswordFlow {
    constructor() {
        this.currentStep = 'email';
        this.userEmail = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showStep('email');
    }

    bindEvents() {
        document.getElementById('emailForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailSubmit();
        });

        document.getElementById('codeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCodeSubmit();
        });

        document.getElementById('passwordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordSubmit();
        });

        document.getElementById('backToEmail').addEventListener('click', () => {
            this.showStep('email');
        });

        document.getElementById('backToCode').addEventListener('click', () => {
            this.showStep('code');
        });

        document.getElementById('continueBtn').addEventListener('click', () => {
            window.location.href = '/login';
        });

        const codeInput = document.getElementById('verificationCode');
        codeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
            document.getElementById('codeBtn').disabled = e.target.value.length !== 6;
        });

        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePasswordVisibility(button);
            });
        });

        document.querySelector('.resend-btn').addEventListener('click', () => {
            this.resendCode();
        });
    }

    showStep(step) {
        document.querySelectorAll('.form-container').forEach(container => {
            container.classList.remove('active');
        });

        const stepElement = document.getElementById(`${step}Step`);
        if (stepElement) {
            setTimeout(() => {
                stepElement.classList.add('active');
            }, 100);
        }

        this.currentStep = step;
    }

    async handleEmailSubmit() {
        const email = document.getElementById('email').value.trim();
        const emailError = document.getElementById('emailError');
        const submitBtn = document.getElementById('emailBtn');

        emailError.textContent = '';
        document.getElementById('email').classList.remove('error');

        if (!this.validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            document.getElementById('email').classList.add('error');
            return;
        }

        this.setButtonLoading(submitBtn, true);

        try {
            const response = await fetch(`${baseURL}/user/auth/requestCode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to send verification code');
            }

            this.userEmail = email;
            document.getElementById('emailDisplay').textContent = email;
            this.showStep('code');
        } catch (error) {
            emailError.textContent = error.message || 'Something went wrong. Please try again.';
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleCodeSubmit() {
        const code = document.getElementById('verificationCode').value;
        const codeError = document.getElementById('codeError');
        const submitBtn = document.getElementById('codeBtn');

        codeError.textContent = '';
        document.getElementById('verificationCode').classList.remove('error');

        if (code.length !== 6) {
            codeError.textContent = 'Please enter a 6-digit verification code';
            document.getElementById('verificationCode').classList.add('error');
            return;
        }

        this.setButtonLoading(submitBtn, true);

        try {
            const response = await fetch('http://localhost:3000/user/reset/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.userEmail,
                    code
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Invalid verification code');
            }

            this.showStep('password');
        } catch (error) {
            codeError.textContent = error.message || 'Invalid verification code. Please try again.';
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handlePasswordSubmit() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        const submitBtn = document.getElementById('passwordBtn');

        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        document.getElementById('newPassword').classList.remove('error');
        document.getElementById('confirmPassword').classList.remove('error');

        let hasError = false;

        if (!this.validatePassword(newPassword)) {
            passwordError.textContent = 'Password must be at least 8 characters long';
            document.getElementById('newPassword').classList.add('error');
            hasError = true;
        }

        if (newPassword !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match';
            document.getElementById('confirmPassword').classList.add('error');
            hasError = true;
        }

        if (hasError) return;

        this.setButtonLoading(submitBtn, true);

        try {
            const response = await fetch('http://localhost:3000/user/reset/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.userEmail,
                    newPassword
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to reset password');
            }

            this.showStep('success');
        } catch (error) {
            passwordError.textContent = error.message || 'Something went wrong. Please try again.';
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async resendCode() {
        const resendBtn = document.querySelector('.resend-btn');
        const originalText = resendBtn.textContent;

        resendBtn.textContent = 'Sending...';
        resendBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:3000/user/reset/request-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.userEmail })
            });

            if (!response.ok) throw new Error();

            resendBtn.textContent = 'Code sent!';
        } catch (error) {
            resendBtn.textContent = 'Failed to send';
        } finally {
            setTimeout(() => {
                resendBtn.textContent = originalText;
                resendBtn.disabled = false;
            }, 2000);
        }
    }

    togglePasswordVisibility(button) {
        const targetId = button.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const eyeIcon = button.querySelector('.eye-icon');
        const eyeOffIcon = button.querySelector('.eye-off-icon');

        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
        } else {
            input.type = 'password';
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
        }
    }

    setButtonLoading(button, isLoading) {
        const btnText = button.querySelector('.btn-text');
        const loadingSpinner = button.querySelector('.loading-spinner');

        if (isLoading) {
            btnText.style.display = 'none';
            loadingSpinner.style.display = 'block';
            button.disabled = true;
        } else {
            btnText.style.display = 'block';
            loadingSpinner.style.display = 'none';
            button.disabled = false;
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password.length >= 8;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ResetPasswordFlow();
});
