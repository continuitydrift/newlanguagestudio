// Load available images from assets
const images = [
    'abs_land.jpg',
    'acorn_2_web.jpg',
    'acorn_web.jpg',
    'banner.JPG',
    'bridges.jpg',
    'chinese_garden.jpg',
    'director.jpg',
    'hull.jpg',
    'nostalgia.jpg',
    'post-history.jpg',
    'storm.jpg',
    'sunflowers_sketch.jpg'
];

// Image preferences and ratings in localStorage
const imageState = JSON.parse(localStorage.getItem('imageState')) || {
    ratings: {},
    hiddenImages: [],
    activeHero: 'banner.JPG',
    lovedImages: new Set()
};

// Session state
const sessionHiddenImages = new Set();
const sessionLovedImages = new Set();

// Initialize ratings if not present
images.forEach(img => {
    if (!imageState.ratings[img]) {
        imageState.ratings[img] = 3; // Default rating
    }
});

function saveImageState() {
    localStorage.setItem('imageState', JSON.stringify({
        ...imageState,
        lovedImages: Array.from(imageState.lovedImages)
    }));
}

function getVisibleImages() {
    return images.filter(img => 
        !sessionHiddenImages.has(img) && 
        !imageState.hiddenImages.includes(img)
    );
}

function getRandomImage(excludeImage = null) {
    const visibleImages = getVisibleImages();
    const availableImages = excludeImage ? 
        visibleImages.filter(img => img !== excludeImage) : 
        visibleImages;
    
    if (availableImages.length === 0) return null;
    
    // Sort by rating
    return availableImages.sort((a, b) => imageState.ratings[b] - imageState.ratings[a])[0];
}

function updateImageRating(img, increment) {
    if (sessionLovedImages.has(img) || sessionHiddenImages.has(img)) {
        return; // Prevent multiple votes in same session
    }

    const currentRating = imageState.ratings[img];
    
    if (increment) {
        imageState.ratings[img] = Math.min(currentRating + 1, 6);
        sessionLovedImages.add(img);
    } else {
        imageState.ratings[img] = Math.max(currentRating - 1, 1);
        sessionHiddenImages.add(img);
    }
    
    saveImageState();
    updateImages();
}

function createImageControls(container, img) {
    const controls = document.createElement('div');
    controls.className = 'image-controls';
    const isLoved = sessionLovedImages.has(img);
    const isHidden = sessionHiddenImages.has(img);
    
    controls.innerHTML = `
        <span class="rating-display">${imageState.ratings[img]}/6</span>
        <button onclick="updateImageRating('${img}', true)" 
                class="image-btn like-btn"
                ${isLoved ? 'disabled' : ''}>♥</button>
        <button onclick="updateImageRating('${img}', false)" 
                class="image-btn dislike-btn"
                ${isHidden ? 'disabled' : ''}>✕</button>
    `;
    container.appendChild(controls);
}

function updateImages() {
    // Update hero image
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroImg = hero.querySelector('.hero-image');
        if (heroImg && !sessionHiddenImages.has(imageState.activeHero)) {
            heroImg.src = `/static/assets/images/${imageState.activeHero}`;
            if (sessionLovedImages.has(imageState.activeHero)) {
                heroImg.classList.add('loved');
            }
            // Update or create hero controls
            let controls = hero.querySelector('.image-controls');
            if (!controls) {
                createImageControls(hero, imageState.activeHero);
            } else {
                controls.querySelector('.rating-display').textContent = 
                    `${imageState.ratings[imageState.activeHero]}/6`;
            }
        }
    }

    // Update section images based on slider value
    const sliderValue = parseInt(document.getElementById('length-slider')?.value || 1);
    const sectionImages = document.querySelectorAll('.section-image-container');
    sectionImages.forEach(container => container.remove());

    // Get visible images sorted by rating
    const availableImages = getVisibleImages()
        .sort((a, b) => imageState.ratings[b] - imageState.ratings[a])
        .slice(0, sliderValue); // Only take the number of images we need

    // Add images to sections
    availableImages.forEach((img, index) => {
        const sections = document.querySelectorAll('.content-section');
        const targetSection = sections[index % sections.length];
        if (targetSection && !sessionHiddenImages.has(img)) {
            const container = document.createElement('div');
            container.className = 'section-image-container';
            if (sessionLovedImages.has(img)) {
                container.classList.add('loved');
            }
            container.innerHTML = `<img src="/static/assets/images/${img}" alt="Section image" class="section-image">`;
            createImageControls(container, img);
            targetSection.appendChild(container);
        }
    });
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Convert lovedImages from array to Set if loading from localStorage
    if (Array.isArray(imageState.lovedImages)) {
        imageState.lovedImages = new Set(imageState.lovedImages);
    }
    
    updateImages();
    
    // Listen for slider changes
    const slider = document.getElementById('length-slider');
    if (slider) {
        slider.addEventListener('input', updateImages);
    }
});
