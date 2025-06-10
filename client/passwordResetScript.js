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
        // Email form
        document.getElementById('emailForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailSubmit();
        });

        // Code form
        document.getElementById('codeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCodeSubmit();
        });

        // Password form
        document.getElementById('passwordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordSubmit();
        });

        // Back buttons
        document.getElementById('backToEmail').addEventListener('click', () => {
            this.showStep('email');
        });

        document.getElementById('backToCode').addEventListener('click', () => {
            this.showStep('code');
        });

        // Continue button
        document.getElementById('continueBtn').addEventListener('click', () => {
            window.location.href = '/login';
        });

        // Verification code input
        const codeInput = document.getElementById('verificationCode');
        codeInput.addEventListener('input', (e) => {
            // Only allow numbers
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
            
            // Enable/disable submit button
            const submitBtn = document.getElementById('codeBtn');
            submitBtn.disabled = e.target.value.length !== 6;
        });

        // Password visibility toggles
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePasswordVisibility(button);
            });
        });

        // Resend code button
        document.querySelector('.resend-btn').addEventListener('click', () => {
            this.resendCode();
        });
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-container').forEach(container => {
            container.classList.remove('active');
        });

        // Show current step
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
        
        // Clear previous errors
        emailError.textContent = '';
        document.getElementById('email').classList.remove('error');

        // Validate email
        if (!this.validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            document.getElementById('email').classList.add('error');
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await this.delay(1500);
            
            this.userEmail = email;
            document.getElementById('emailDisplay').textContent = email;
            this.showStep('code');
        } catch (error) {
            emailError.textContent = 'Something went wrong. Please try again.';
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleCodeSubmit() {
        const code = document.getElementById('verificationCode').value;
        const codeError = document.getElementById('codeError');
        const submitBtn = document.getElementById('codeBtn');
        
        // Clear previous errors
        codeError.textContent = '';
        document.getElementById('verificationCode').classList.remove('error');

        if (code.length !== 6) {
            codeError.textContent = 'Please enter a 6-digit verification code';
            document.getElementById('verificationCode').classList.add('error');
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await this.delay(1500);
            
            this.showStep('password');
        } catch (error) {
            codeError.textContent = 'Invalid verification code. Please try again.';
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
        
        // Clear previous errors
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        document.getElementById('newPassword').classList.remove('error');
        document.getElementById('confirmPassword').classList.remove('error');

        let hasError = false;

        // Validate password
        if (!this.validatePassword(newPassword)) {
            passwordError.textContent = 'Password must be at least 8 characters long';
            document.getElementById('newPassword').classList.add('error');
            hasError = true;
        }

        // Validate password confirmation
        if (newPassword !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match';
            document.getElementById('confirmPassword').classList.add('error');
            hasError = true;
        }

        if (hasError) return;

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await this.delay(1500);
            
            this.showStep('success');
        } catch (error) {
            passwordError.textContent = 'Something went wrong. Please try again.';
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
            // Simulate API call
            await this.delay(1000);
            resendBtn.textContent = 'Code sent!';
            
            setTimeout(() => {
                resendBtn.textContent = originalText;
                resendBtn.disabled = false;
            }, 2000);
        } catch (error) {
            resendBtn.textContent = 'Failed to send';
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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the reset password flow when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ResetPasswordFlow();
});