// Load available images from assets
const images = [
    'banner.JPG',
    'nostalgia.jpg'
    // Add more image filenames here
];

// Image preferences and ratings in localStorage
const imageState = JSON.parse(localStorage.getItem('imageState')) || {
    ratings: {},
    hiddenImages: [],
    activeHero: images[0]
};

// Initialize ratings if not present
images.forEach(img => {
    if (!imageState.ratings[img]) {
        imageState.ratings[img] = 3; // Default rating
    }
});

function saveImageState() {
    localStorage.setItem('imageState', JSON.stringify(imageState));
}

function getVisibleImages() {
    return images.filter(img => !imageState.hiddenImages.includes(img));
}

function getRandomImage(excludeImage = null) {
    const visibleImages = getVisibleImages();
    const availableImages = excludeImage ? 
        visibleImages.filter(img => img !== excludeImage) : 
        visibleImages;
    
    if (availableImages.length === 0) return null;
    
    // Weight by rating
    const totalWeight = availableImages.reduce((sum, img) => sum + imageState.ratings[img], 0);
    let random = Math.random() * totalWeight;
    
    for (const img of availableImages) {
        random -= imageState.ratings[img];
        if (random <= 0) return img;
    }
    return availableImages[0];
}

function updateImageRating(img, increment) {
    const currentRating = imageState.ratings[img];
    imageState.ratings[img] = Math.max(1, Math.min(6, currentRating + (increment ? 1 : -1)));
    
    if (!increment) {
        imageState.hiddenImages.push(img);
        // If we're hiding the hero image, select a new one
        if (img === imageState.activeHero) {
            const newHero = getRandomImage(img);
            if (newHero) imageState.activeHero = newHero;
        }
    }
    
    saveImageState();
    updateImages();
}

function createImageControls(container, img) {
    const controls = document.createElement('div');
    controls.className = 'image-controls';
    controls.innerHTML = `
        <span class="rating-display">${imageState.ratings[img]}/6</span>
        <button onclick="updateImageRating('${img}', true)" class="image-btn like-btn">♥</button>
        <button onclick="updateImageRating('${img}', false)" class="image-btn dislike-btn">✕</button>
    `;
    container.appendChild(controls);
}

function updateImages() {
    // Update hero image
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroImg = hero.querySelector('.hero-image');
        if (heroImg) {
            heroImg.src = `/static/assets/images/${imageState.activeHero}`;
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
    sectionImages.forEach(container => container.remove()); // Remove existing section images

    // Add new section images based on slider value
    const sections = document.querySelectorAll('.content-section');
    for (let i = 0; i < sliderValue - 1; i++) { // -1 because we always have hero image
        const randomImg = getRandomImage();
        if (randomImg && sections[i % sections.length]) {
            const container = document.createElement('div');
            container.className = 'section-image-container';
            container.innerHTML = `<img src="/static/assets/images/${randomImg}" alt="Section image" class="section-image">`;
            createImageControls(container, randomImg);
            sections[i % sections.length].appendChild(container);
        }
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateImages();
    
    // Listen for slider changes
    const slider = document.getElementById('length-slider');
    if (slider) {
        slider.addEventListener('input', updateImages);
    }
});
