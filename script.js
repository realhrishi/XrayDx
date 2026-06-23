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
