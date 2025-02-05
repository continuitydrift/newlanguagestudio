// Content sections with paragraphs and ratings
const contentSections = {
    section1: {
        title: "Introduction to Ecological Writing",
        paragraphs: [
            { id: 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", rating: 6 },
            { id: 2, text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", rating: 4 },
            { id: 3, text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", rating: 3 },
            { id: 4, text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", rating: 5 },
            { id: 5, text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.", rating: 2 },
            { id: 6, text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.", rating: 1 }
        ]
    },
    section2: {
        title: "Digital Ecology",
        paragraphs: [
            { id: 7, text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.", rating: 6 },
            { id: 8, text: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis.", rating: 3 },
            { id: 9, text: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates.", rating: 4 },
            { id: 10, text: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores.", rating: 5 },
            { id: 11, text: "Quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus.", rating: 2 },
            { id: 12, text: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.", rating: 1 }
        ]
    },
    section3: {
        title: "Environmental Narratives",
        paragraphs: [
            { id: 13, text: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod.", rating: 6 },
            { id: 14, text: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.", rating: 4 },
            { id: 15, text: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores.", rating: 3 },
            { id: 16, text: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis.", rating: 5 },
            { id: 17, text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.", rating: 2 },
            { id: 18, text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.", rating: 1 }
        ]
    }
};

// Load ratings from localStorage or use defaults
let contentRatings = JSON.parse(localStorage.getItem('contentRatings')) || {};
Object.keys(contentSections).forEach(section => {
    contentSections[section].paragraphs.forEach(para => {
        if (!contentRatings[para.id]) {
            contentRatings[para.id] = para.rating;
        }
    });
});

// Track hidden paragraphs for current session
const hiddenParagraphs = new Set();

function saveRatings() {
    localStorage.setItem('contentRatings', JSON.stringify(contentRatings));
}

function updateParagraphRating(paraId, increment) {
    if (!increment && hiddenParagraphs.has(paraId)) {
        return; // Prevent multiple downvotes in same session
    }

    const currentRating = contentRatings[paraId];
    const newRating = increment ? 
        Math.min(currentRating + 1, 6) : 
        Math.max(currentRating - 1, 1);
    
    contentRatings[paraId] = newRating;
    
    if (!increment) {
        hiddenParagraphs.add(paraId);
    }
    
    saveRatings();
    updateContent(getCurrentSliderValue());
}

function getCurrentSliderValue() {
    return parseInt(document.getElementById('length-slider').value);
}

function updateContent(visibleParagraphs) {
    Object.keys(contentSections).forEach(sectionKey => {
        const section = contentSections[sectionKey];
        const sectionElement = document.getElementById(sectionKey);
        if (sectionElement) {
            // Sort paragraphs by rating and filter out hidden ones
            const sortedParagraphs = [...section.paragraphs]
                .filter(para => !hiddenParagraphs.has(para.id))
                .sort((a, b) => contentRatings[b.id] - contentRatings[a.id])
                .slice(0, visibleParagraphs);

            sectionElement.innerHTML = `
                <h2>${section.title}</h2>
                ${sortedParagraphs.map(para => `
                    <div class="paragraph-container" data-id="${para.id}">
                        <p>${para.text}</p>
                        <div class="paragraph-controls">
                            <span class="rating-display">${contentRatings[para.id]}/6</span>
                            <button onclick="updateParagraphRating(${para.id}, true)" class="content-btn like-btn">♥</button>
                            <button onclick="updateParagraphRating(${para.id}, false)" class="content-btn dislike-btn">✕</button>
                        </div>
                    </div>
                `).join('')}
            `;
        }
    });
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('length-slider');
    if (slider) {
        slider.addEventListener('input', (e) => {
            updateContent(parseInt(e.target.value));
        });
        updateContent(parseInt(slider.value));
    }
});
