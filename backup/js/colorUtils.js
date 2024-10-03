function generateColor(index) {
    const hue = (index * 70) % 360; // Change hue for each color
    const saturation = '50%'; // Fixed saturation
    const lightness = '50%'; // Fixed lightness
    return `hsl(${hue}, ${saturation}, ${lightness})`;
}

// Object to store colors for each unique nature, technology, and tool
const colorMapping = {
    natures: {},
    technologies: {},
    tools: {}
};

// Function to get or assign color for an item
function getOrAssignColor(item, type) {
    if (!colorMapping[type][item]) {
        const index = Object.keys(colorMapping[type]).length; // Determine the current count
        colorMapping[type][item] = generateColor(index); // Assign a new color
    }
    return colorMapping[type][item];
}