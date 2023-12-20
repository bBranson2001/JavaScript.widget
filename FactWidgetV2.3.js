/*
    Random Fact Widget
    Author: Branson, 2023

    Description:
    This script creates an aesthetically pleasing widget displaying a random fact from an API. 
    It features a neon green text on a black background, enhanced with a bold, retro-style font and a decorative header.

    Usage:
    Ideal for use in widget environments like Scriptable for iOS.

    License:
    Released under the MIT License. 
    Full license: https://opensource.org/licenses/MIT
*/

const config = {
    apiUrl: 'https://uselessfacts.jsph.pl/random.json?language=en',
    textColor: "#39FF14", // Neon green
    backgroundColor: "#000000", // Black
    fontName: "Menlo", // Retro-style, bold font
    fontSize: 16,
    refreshMinutes: 15, // Refresh rate
};

// Fetches a random fact from the specified API.
async function fetchRandomFact() {
    try {
        let req = new Request(config.apiUrl);
        let response = await req.loadJSON();
        if (!response.text) throw new Error("Invalid response format");
        return response.text;
    } catch (error) {
        console.log(`Error fetching fact: ${error}`);
        return Keychain.contains('cachedFact') ? Keychain.get('cachedFact') : "No fact available.";
    }
}

// Creates and applies styling to the text elements in the widget.
function createText(widget, textContent, isHeader = false) {
    let text = widget.addText(textContent);
    text.textColor = new Color(config.textColor);
    text.font = isHeader ? Font.boldSystemFont(18) : new Font(config.fontName, config.fontSize);
    if (isHeader) text.centerAlignText();
    return text;
}

// Constructs the widget with all elements.
async function createWidget() {
    let widget = new ListWidget();
    widget.backgroundColor = new Color(config.backgroundColor);

    // Fetches the fact and updates the cached copy.
    let fact = await fetchRandomFact();
    Keychain.set('cachedFact', fact);

    // Adding a stylish header
    createText(widget, "🌟 Did You Know?", true);

    widget.addSpacer(10);

    // Adds the main fact text to the widget.
    createText(widget, fact);

    // Set widget to refresh at the specified interval.
    widget.refreshAfterDate = new Date(Date.now() + config.refreshMinutes * 60000);

    return widget;
}

// Main execution block to set up and display the widget.
(async () => {
    let widget = await createWidget();
    if (config.runsInWidget) {
        Script.setWidget(widget);
    } else {
        widget.presentMedium();
    }
    Script.complete();
})();