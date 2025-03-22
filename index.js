// Import statements
import { eventSource, event_types } from '../../../../script.js';

// QR Bar Toggle Button Script with initialization method and toggle states
class QrBarToggle {
    constructor() {
        this.isAppReady = false;
        this.isOpen = false;
    }
    
    initialize() {
        eventSource.on(event_types.APP_READY, () => {
            this.isAppReady = true;
            this.addToggleButton();
           
        });
    }

    addToggleButton() {
        // Create the new button element
        const toggleButton = document.createElement('div');
        toggleButton.id = 'qr_toggle_button';
        toggleButton.className = 'fa-solid fa-chevron-up interactable';
        toggleButton.tabIndex = 0;
        toggleButton.title = 'Toggle QR Bar';
        toggleButton.style.display = 'flex';
        
        // Get the leftSendForm element
        const leftSendForm = document.getElementById('leftSendForm');
        
        const extensionsMenuButton = document.getElementById('extensionsMenuButton');

        if (leftSendForm && extensionsMenuButton) {
            extensionsMenuButton.insertAdjacentElement('afterend', toggleButton);
            
            const qrBarnames = document.getElementById('qr--bar').className;
            // Set initial state (collapsed)
            
            // Add click event listener to toggle button
            toggleButton.addEventListener('click', () => {
                var qrBar = document.getElementById('qr--bar');
                if (qrBar) {
                    this.isOpen = !this.isOpen;
                    
                    // Toggle height between collapsed and expanded
                    if (this.isOpen) {
                        qrBar.className= qrBarnames + ' sqrbt-toggle_button-expanded';
                        qrBar.style.borderTopColor = 'var(--SmartThemeBodyColor)'; // Change border color when expanded
                        toggleButton.className = 'fa-solid fa-chevron-down interactable'; // Change to expanded icon
                        toggleButton.title = 'Collapse QR Bar';
                    } else {
                        qrBar.className= qrBarnames + ' sqrbt-toggle_button-collapsed';
                        qrBar.style.borderTopColor = 'var(--SmartThemeQuoteColor)'; // Restore original border color
                        toggleButton.className = 'fa-solid fa-chevron-up interactable'; // Change to collapsed icon
                        toggleButton.title = 'Expand QR Bar';
                    }
                }
            });
        }
    }
}

// Create and initialize the QrBarToggle instance
const qrBarToggle = new QrBarToggle();
qrBarToggle.initialize();