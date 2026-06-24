const SUPABASE_URL = 'https://svcuzduoiuovwjtiovdr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_T_sWCXdzP1SFTJoG81DNnA_wAiX6Dby';
const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const canvas = document.getElementById("hero-lightpass");

if (canvas) {
  const context = canvas.getContext("2d");

  const frameCount = 240;

  // The images are in the 'skeletal' folder. The format is ezgif-frame-001.jpg
  const currentFrame = index => (
    `./skeletal/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
  )

  const images = [];

  const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }
  };

  preloadImages();

  // Function to update canvas dimensions for high DPI displays
  function setCanvasSize() {
    canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    // Resizing canvas resets context properties, so we set high quality smoothing here
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
  }

  // Draw the first image initially when it loads
  images[0].onload=function(){
    setCanvasSize();
    drawImageFit(images[0]);
  }

  // Ensure canvas resizes correctly if window is resized
  window.addEventListener('resize', () => {
    setCanvasSize();
    // Redraw the current image on resize
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = maxScrollTop === 0 ? 0 : scrollTop / maxScrollTop;
    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(scrollFraction * frameCount)
    );
    drawImageFit(images[frameIndex]);
  });

  // A helper function to draw the image to cover within the canvas
  // Similar to object-fit: cover, this prevents blank spaces
  function drawImageFit(img) {
      // Only draw if the image is fully loaded to prevent flickering
      if (!img.complete || img.naturalWidth === 0) return;
      
      const hRatio = canvas.width / img.naturalWidth;
      const vRatio = canvas.height / img.naturalHeight;
      const ratio  = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
      // Push the image down slightly so the navbar doesn't cover the top (the face)
      const navbarOffset = 100 * (window.devicePixelRatio || 1);
      const centerShift_y = ((canvas.height - img.naturalHeight * ratio) / 2) + navbarOffset;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0,0, img.naturalWidth, img.naturalHeight,
                         centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio);
  }

  const updateImage = index => {
    drawImageFit(images[index]);
  }

  window.addEventListener('scroll', () => {  
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(scrollFraction * frameCount)
    );
    
    // Use the preloaded image directly from the array
    requestAnimationFrame(() => updateImage(frameIndex))
  });
}

// Global Scroll Animations using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Optional: Remove if we want elements to fade out when scrolling up
            entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

const fadeElements = document.querySelectorAll('.fade-in-up');
fadeElements.forEach(el => fadeObserver.observe(el));

// --- Auth Modal Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Modal HTML
    const modalHTML = `
        <div class="auth-modal-overlay" id="authModalOverlay">
            <div class="auth-modal-container" id="authModalContainer">
                
                <!-- LOGIN FORM -->
                <div class="auth-form-wrapper active" id="loginFormWrapper">
                    <h2>Welcome Back</h2>
                    <p class="auth-subtitle">Sign in to continue using XrayDx.</p>
                    <div id="loginMessage" style="margin-bottom: 15px; font-size: 0.9rem;"></div>
                    
                    <form id="loginForm">
                        <div class="input-group">
                            <label>EMAIL ADDRESS</label>
                            <input type="email" id="loginEmail" placeholder="hrishirajchowdhuryofficial@gmail.com" required>
                        </div>
                        <div class="input-group">
                            <label>PASSWORD</label>
                            <div class="password-wrapper">
                                <input type="password" id="loginPassword" placeholder="••••••••••••" required>
                                <span class="toggle-password">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                </span>
                            </div>
                        </div>
                        <div class="form-options">
                            <label class="remember-me"><input type="checkbox"> Remember Me</label>
                            <a href="#" class="forgot-password">Forgot Password?</a>
                        </div>
                        <button type="submit" class="auth-submit-btn">SIGN IN</button>
                    </form>
                    
                    <p class="auth-switch-text">Don't have an account? <a href="#" id="switchToSignup">Sign Up &rarr;</a></p>
                </div>

                <!-- SIGNUP FORM -->
                <div class="auth-form-wrapper" id="signupFormWrapper" style="display: none;">
                    <h2>Create Account</h2>
                    <p class="auth-subtitle">Join XrayDx and explore AI-powered fracture detection.</p>
                    <div id="signupMessage" style="margin-bottom: 15px; font-size: 0.9rem;"></div>
                    
                    <form id="signupForm">
                        <div class="input-group">
                            <label>FULL NAME</label>
                            <input type="text" id="signupName" required>
                        </div>
                        <div class="input-group">
                            <label>EMAIL ADDRESS</label>
                            <input type="email" id="signupEmail" required>
                        </div>
                        <div class="input-group">
                            <label>PASSWORD</label>
                            <div class="password-wrapper">
                                <input type="password" required id="signupPassword" minlength="6">
                                <span class="toggle-password">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                </span>
                            </div>
                            <div class="password-strength">
                                <div class="strength-bar" id="strengthBar"></div>
                            </div>
                        </div>
                        <div class="input-group">
                            <label>CONFIRM PASSWORD</label>
                            <div class="password-wrapper">
                                <input type="password" id="signupConfirmPassword" required minlength="6">
                                <span class="toggle-password">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                </span>
                            </div>
                        </div>
                        <button type="submit" class="auth-submit-btn">CREATE ACCOUNT</button>
                    </form>
                    
                    <p class="auth-switch-text">Already have an account? <a href="#" id="switchToLogin">Sign In &rarr;</a></p>
                </div>

            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('authModalOverlay');
    const container = document.getElementById('authModalContainer');
    const loginWrapper = document.getElementById('loginFormWrapper');
    const signupWrapper = document.getElementById('signupFormWrapper');
    
    // Switch links
    const toSignupBtn = document.getElementById('switchToSignup');
    const toLoginBtn = document.getElementById('switchToLogin');

    const openModal = (type) => {
        document.body.classList.add('modal-open');
        overlay.classList.add('active');
        
        if (type === 'signup') {
            loginWrapper.style.display = 'none';
            signupWrapper.style.display = 'block';
            setTimeout(() => {
                const firstInput = signupWrapper.querySelector('input');
                if(firstInput) firstInput.focus();
            }, 300);
        } else {
            signupWrapper.style.display = 'none';
            loginWrapper.style.display = 'block';
            setTimeout(() => {
                const firstInput = loginWrapper.querySelector('input');
                if(firstInput) firstInput.focus();
            }, 300);
        }
    };

    const closeModal = () => {
        overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    };

    // Attach listeners to navbar buttons
    document.querySelectorAll('.login-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('login');
        });
    });

    document.querySelectorAll('.signup-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('signup');
        });
    });

    // Close logic
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Switch logic
    toSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginWrapper.style.opacity = '0';
        setTimeout(() => {
            loginWrapper.style.display = 'none';
            signupWrapper.style.display = 'block';
            signupWrapper.style.opacity = '0';
            requestAnimationFrame(() => {
                signupWrapper.style.opacity = '1';
            });
        }, 200);
    });

    toLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupWrapper.style.opacity = '0';
        setTimeout(() => {
            signupWrapper.style.display = 'none';
            loginWrapper.style.display = 'block';
            loginWrapper.style.opacity = '0';
            requestAnimationFrame(() => {
                loginWrapper.style.opacity = '1';
            });
        }, 200);
    });

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                toggle.style.opacity = '1';
            } else {
                input.type = 'password';
                toggle.style.opacity = '0.5';
            }
        });
    });

    // Password strength simple demo
    const signupPass = document.getElementById('signupPassword');
    const strengthBar = document.getElementById('strengthBar');
    if(signupPass && strengthBar) {
        signupPass.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length === 0) {
                strengthBar.style.width = '0%';
                strengthBar.style.background = 'transparent';
            } else if (val.length < 5) {
                strengthBar.style.width = '33%';
                strengthBar.style.background = '#ff4444';
            } else if (val.length < 8) {
                strengthBar.style.width = '66%';
                strengthBar.style.background = '#ffbb33';
            } else {
                strengthBar.style.width = '100%';
                strengthBar.style.background = '#00C851';
            }
        });
    }
    // Supabase Auth Integration
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirmPassword = document.getElementById('signupConfirmPassword');
    const loginMessage = document.getElementById('loginMessage');
    const signupMessage = document.getElementById('signupMessage');
    const navAuth = document.querySelector('.nav-auth');

    // Handle Session State
    sbClient.auth.onAuthStateChange((event, session) => {
        if (session) {
            const email = session.user.email;
            navAuth.innerHTML = `
                <span style="color: #fff; margin-right: 15px; font-weight: 500; white-space: nowrap;">Welcome back, Chief!!</span>
                <a href="#" id="logoutBtn" class="login-btn">Logout</a>
            `;
            document.getElementById('logoutBtn').addEventListener('click', async (e) => {
                e.preventDefault();
                await sbClient.auth.signOut();
            });
        } else {
            navAuth.innerHTML = `
                <a href="#login" class="login-btn">Login</a>
                <a href="#signup" class="signup-btn">Sign Up</a>
            `;
            // Re-bind listeners for newly injected buttons
            document.querySelector('.login-btn').addEventListener('click', (e) => {
                e.preventDefault(); openModal('login');
            });
            document.querySelector('.signup-btn').addEventListener('click', (e) => {
                e.preventDefault(); openModal('signup');
            });
        }
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginMessage.style.color = 'inherit';
        loginMessage.innerText = 'Signing in...';
        
        const { data, error } = await sbClient.auth.signInWithPassword({
            email: loginEmail.value,
            password: loginPassword.value
        });
        
        if (error) {
            loginMessage.style.color = '#ff4444';
            loginMessage.innerText = error.message;
        } else {
            loginMessage.style.color = '#00C851';
            loginMessage.innerText = 'Success!';
            loginForm.reset();
            setTimeout(closeModal, 1000);
        }
    });

    // Handle Signup
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        signupMessage.style.color = 'inherit';
        
        if (signupPassword.value !== signupConfirmPassword.value) {
            signupMessage.style.color = '#ff4444';
            signupMessage.innerText = "Passwords do not match.";
            return;
        }
        
        signupMessage.innerText = 'Creating account...';
        
        const { data, error } = await sbClient.auth.signUp({
            email: signupEmail.value,
            password: signupPassword.value,
            options: {
                data: { full_name: signupName.value }
            }
        });
        
        if (error) {
            signupMessage.style.color = '#ff4444';
            signupMessage.innerText = error.message;
        } else {
            signupMessage.style.color = '#00C851';
            signupMessage.innerText = 'Account created successfully! You can now sign in.';
            signupForm.reset();
        }
    });


});

// --- Predict Page Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const triggerUploadBtn = document.getElementById('triggerUploadBtn');
    const uploadArea = document.getElementById('uploadArea');
    
    if (!fileInput || !triggerUploadBtn) return; // Only run on Predict page

    const uploadIcon = document.getElementById('uploadIcon');
    const uploadTitle = document.getElementById('uploadTitle');
    const uploadSubtitle = document.getElementById('uploadSubtitle');
    const imagePreview = document.getElementById('imagePreview');
    const predictActionWrapper = document.getElementById('predictActionWrapper');
    const predictActionBtn = document.getElementById('predictActionBtn');
    
    const predictionLoading = document.getElementById('predictionLoading');
    const loadingText = document.getElementById('loadingText');
    const predictionDashboard = document.getElementById('predictionDashboard');
    const confidenceBar = document.getElementById('confidenceBar');
    
    // File upload handling
    triggerUploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Show preview
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                imagePreview.style.marginTop = '20px';
                imagePreview.style.marginBottom = '20px';
                
                // Hide icon and update text
                uploadIcon.style.display = 'none';
                uploadTitle.innerText = "Image Selected";
                uploadSubtitle.style.display = 'none';
                triggerUploadBtn.innerText = "Change Image";
                
                // Show Predict button
                predictActionWrapper.style.display = 'block';
                
                // Reset dashboard if it was previously open
                predictionDashboard.style.display = 'none';
                confidenceBar.style.width = '0%';
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Predict Action flow
    predictActionBtn.addEventListener('click', async () => {
        // Hide predict button
        predictActionWrapper.style.display = 'none';
        
        // Show loading state
        predictionLoading.style.display = 'flex';
        
        // Setup loading phases text cycle
        const phases = [
            "Uploading image...",
            "Running AI inference...",
            "Analyzing bone structure...",
            "Generating diagnostic report..."
        ];
        let currentPhase = 0;
        loadingText.innerText = phases[0];
        const phaseInterval = setInterval(() => {
            currentPhase = (currentPhase + 1) % phases.length;
            loadingText.innerText = phases[currentPhase];
        }, 1200);

        try {
            // Build FormData
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            // Call FastAPI backend
            const response = await fetch('https://realhrishi-xraydx.hf.space/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Prediction failed");
            }

            const data = await response.json();
            
            // Clear loading
            clearInterval(phaseInterval);
            predictionLoading.style.display = 'none';
            
            // Populate Dashboard
            const resultImg = document.getElementById('resultImage');
            if (resultImg) {
                resultImg.src = 'https://realhrishi-xraydx.hf.space' + data.annotated_image;
            }
            
            // Hide placeholder bounding box if it exists
            const bbPlaceholder = document.querySelector('.bounding-box-placeholder');
            if (bbPlaceholder) bbPlaceholder.style.display = 'none';

            const statusText = document.getElementById('statusText');
            const statusDescription = document.getElementById('statusDescription');
            if (statusText) {
                if (data.fracture_detected) {
                    statusText.innerText = 'Fracture Detected';
                    if (statusDescription) statusDescription.innerText = 'The model identified findings consistent with a fracture.';
                    statusText.className = 'metric-title text-red';
                    statusText.parentElement.previousElementSibling.className = 'icon-box icon-red';
                    statusText.parentElement.previousElementSibling.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
                } else {
                    statusText.innerText = 'No Fracture Detected';
                    if (statusDescription) statusDescription.innerText = 'The model did not identify findings consistent with a fracture.';
                    statusText.className = 'metric-title text-green';
                    statusText.parentElement.previousElementSibling.className = 'icon-box icon-green';
                    statusText.parentElement.previousElementSibling.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
                }
            }

            const typeText = document.getElementById('typeText');
            if (typeText) typeText.innerText = 'N/A'; // Hide class names by default

            const confValue = document.getElementById('confidenceValue');
            if (confValue) confValue.innerText = (data.confidence * 100).toFixed(1) + '%';

            const summaryText = document.getElementById('summaryText');
            if (summaryText) summaryText.innerText = data.analysis_summary;

            const recList = document.getElementById('recList');
            if (recList && data.recommendations) {
                recList.innerHTML = '';
                data.recommendations.forEach(rec => {
                    recList.innerHTML += `<li><span class="check-icon">✓</span> ${rec}</li>`;
                });
            }

            // Show dashboard
            predictionDashboard.style.display = 'block';
            predictionDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Animate confidence bar
            setTimeout(() => {
                confidenceBar.style.width = (data.confidence * 100) + '%';
                if (!data.fracture_detected) {
                    confidenceBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
                } else {
                    confidenceBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
                }
            }, 300);

        } catch (err) {
            clearInterval(phaseInterval);
            predictionLoading.style.display = 'none';
            alert('Error during prediction: ' + err.message);
            predictActionWrapper.style.display = 'block';
        }
    });
});

// --- About Page Gallery Lightbox ---
document.addEventListener('DOMContentLoaded', () => {
    const journeyImages = document.querySelectorAll('.journey-card img');
    if (journeyImages.length === 0) return; // Only run if there are journey images

    // Inject Gallery HTML
    const galleryHTML = `
        <div class="gallery-modal-overlay" id="galleryOverlay">
            <div class="gallery-close" id="galleryClose">&times;</div>
            <div class="gallery-nav prev" id="galleryPrev">&#10094;</div>
            <div class="gallery-nav next" id="galleryNext">&#10095;</div>
            
            <div class="gallery-content">
                <img src="" class="gallery-image" id="galleryImage" alt="Gallery Image">
            </div>
            
            <div class="gallery-counter" id="galleryCounter">1 / ${journeyImages.length}</div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', galleryHTML);
    
    const overlay = document.getElementById('galleryOverlay');
    const galleryImage = document.getElementById('galleryImage');
    const closeBtn = document.getElementById('galleryClose');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const counter = document.getElementById('galleryCounter');
    
    let currentIndex = 0;
    const totalImages = journeyImages.length;
    const imagesArray = Array.from(journeyImages);
    
    const openGallery = (index) => {
        currentIndex = index;
        updateGallery();
        document.body.classList.add('modal-open');
        overlay.classList.add('active');
    };
    
    const closeGallery = () => {
        overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    };
    
    const updateGallery = () => {
        galleryImage.src = imagesArray[currentIndex].src;
        counter.innerText = `${currentIndex + 1} / ${totalImages}`;
    };
    
    const nextImage = () => {
        currentIndex = (currentIndex + 1) % totalImages;
        updateGallery();
    };
    
    const prevImage = () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateGallery();
    };
    
    // Attach click events
    imagesArray.forEach((img, index) => {
        img.addEventListener('click', () => openGallery(index));
    });
    
    // Controls
    closeBtn.addEventListener('click', closeGallery);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
    
    // Close on clicking backdrop
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('gallery-content')) {
            closeGallery();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
});
