const naturalistQuotes = [
    // Emerson
    {
        quote: "Adopt the pace of nature: her secret is patience.",
        author: "Ralph Waldo Emerson",
        source: "Essays: First Series"
    },
    {
        quote: "Nature always wears the colors of the spirit.",
        author: "Ralph Waldo Emerson",
        source: "Nature"
    },
    {
        quote: "Every particular in nature, a leaf, a drop, a crystal, a moment of time is related to the whole, and partakes of the perfection of the whole.",
        author: "Ralph Waldo Emerson",
        source: "Nature"
    },
    
    // Whitman
    {
        quote: "The words of my book nothing, the drift of it everything.",
        author: "Walt Whitman",
        source: "Leaves of Grass"
    },
    {
        quote: "Now I see the secret of making the best person: it is to grow in the open air and to eat and sleep with the earth.",
        author: "Walt Whitman",
        source: "Song of the Open Road"
    },
    {
        quote: "A morning-glory at my window satisfies me more than the metaphysics of books.",
        author: "Walt Whitman",
        source: "Song of Myself"
    },
    
    // Thoreau
    {
        quote: "I went to the woods because I wished to live deliberately, to front only the essential facts of life.",
        author: "Henry David Thoreau",
        source: "Walden"
    },
    {
        quote: "Heaven is under our feet as well as over our heads.",
        author: "Henry David Thoreau",
        source: "Walden"
    },
    {
        quote: "If a man does not keep pace with his companions, perhaps it is because he hears a different drummer.",
        author: "Henry David Thoreau",
        source: "Walden"
    },
    
    // Leopold
    {
        quote: "There are some who can live without wild things, and some who cannot.",
        author: "Aldo Leopold",
        source: "A Sand County Almanac"
    },
    {
        quote: "Conservation is a state of harmony between men and land.",
        author: "Aldo Leopold",
        source: "A Sand County Almanac"
    },
    {
        quote: "To keep every cog and wheel is the first precaution of intelligent tinkering.",
        author: "Aldo Leopold",
        source: "Round River"
    },
    
    // John Muir
    {
        quote: "The mountains are calling and I must go.",
        author: "John Muir",
        source: "Letters"
    },
    {
        quote: "Between every two pines is a doorway to a new world.",
        author: "John Muir",
        source: "John of the Mountains"
    },
    
    // Rachel Carson
    {
        quote: "Those who contemplate the beauty of the earth find reserves of strength that will endure as long as life lasts.",
        author: "Rachel Carson",
        source: "Silent Spring"
    },
    {
        quote: "In nature nothing exists alone.",
        author: "Rachel Carson",
        source: "Silent Spring"
    }
];

// Initialize quote weights from localStorage or default values
const quoteWeights = new Map(
    JSON.parse(localStorage.getItem('quoteWeights')) || 
    naturalistQuotes.map((_, index) => [index, 1])
);

let currentQuoteIndex = null;

// Save weights to localStorage
function saveWeights() {
    localStorage.setItem('quoteWeights', JSON.stringify([...quoteWeights]));
}

function getRandomQuote() {
    let totalWeight = 0;
    quoteWeights.forEach(weight => {
        totalWeight += weight;
    });

    // If all quotes have been removed, reset the weights
    if (totalWeight === 0) {
        naturalistQuotes.forEach((_, index) => {
            quoteWeights.set(index, 1);
        });
        saveWeights();
        totalWeight = naturalistQuotes.length;
    }

    let random = Math.random() * totalWeight;
    let weightSum = 0;

    for (let i = 0; i < naturalistQuotes.length; i++) {
        if (quoteWeights.has(i)) {
            weightSum += quoteWeights.get(i);
            if (random <= weightSum) {
                currentQuoteIndex = i;
                return naturalistQuotes[i];
            }
        }
    }
}

function likeQuote() {
    if (currentQuoteIndex !== null) {
        const currentWeight = quoteWeights.get(currentQuoteIndex);
        quoteWeights.set(currentQuoteIndex, currentWeight + 1);
        saveWeights();
        animateAndDisplayNewQuote();
    }
}

function dislikeQuote() {
    if (currentQuoteIndex !== null) {
        quoteWeights.delete(currentQuoteIndex);
        saveWeights();
        animateAndDisplayNewQuote();
    }
}

function animateAndDisplayNewQuote() {
    const quoteContainer = document.getElementById('quote-container');
    if (quoteContainer) {
        // Fade out
        quoteContainer.style.opacity = '0';
        quoteContainer.style.transform = 'translateY(20px)';
        
        // Wait for fade out, then update content and fade in
        setTimeout(() => {
            const { quote, author, source } = getRandomQuote();
            quoteContainer.innerHTML = `
                <blockquote class="emerson-quote">
                    <p>${quote}</p>
                    <footer>— ${author}, <cite>${source}</cite></footer>
                </blockquote>
                <div class="quote-actions">
                    <button onclick="likeQuote()" class="quote-btn like-btn">♥ Love this quote</button>
                    <button onclick="dislikeQuote()" class="quote-btn dislike-btn">✕ Remove this quote</button>
                </div>
            `;
            
            // Force browser to recognize the change before fading in
            setTimeout(() => {
                quoteContainer.style.opacity = '1';
                quoteContainer.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const quoteContainer = document.getElementById('quote-container');
    if (quoteContainer) {
        // Add transition styles
        quoteContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        animateAndDisplayNewQuote();
    }
});
