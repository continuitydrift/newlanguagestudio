const images = {
    headers: [
        'banner.JPG',
        'nostalgia.jpg'
    ]
};

// Load preferences from localStorage or set defaults
const imagePreferences = JSON.parse(localStorage.getItem('imagePreferences')) || {
    activeHeader: 'banner.JPG',
    hiddenImages: []
};

function saveImagePreferences() {
    localStorage.setItem('imagePreferences', JSON.stringify(imagePreferences));
}

function likeImage(type, imageName) {
    // Currently just saves it as active
    imagePreferences[`active${type}`] = imageName;
    saveImagePreferences();
}

function removeImage(type, imageName) {
    imagePreferences.hiddenImages.push(imageName);
    // If we're removing the active image, switch to another one
    if (imagePreferences[`active${type}`] === imageName) {
        const available = images[type.toLowerCase()].filter(img => 
            !imagePreferences.hiddenImages.includes(img));
        if (available.length > 0) {
            imagePreferences[`active${type}`] = available[0];
        }
    }
    saveImagePreferences();
    updateImages();
}

function updateImages() {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.src = `/static/assets/images/${imagePreferences.activeHeader}`;
    }
}

// Add image controls
function addImageControls() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const controls = document.createElement('div');
        controls.className = 'image-controls';
        controls.innerHTML = `
            <button onclick="likeImage('Header', '${imagePreferences.activeHeader}')" class="image-btn like-btn">♥</button>
            <button onclick="removeImage('Header', '${imagePreferences.activeHeader}')" class="image-btn dislike-btn">✕</button>
        `;
        hero.appendChild(controls);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateImages();
    addImageControls();
});
