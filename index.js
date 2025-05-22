// Import statements
import { eventSource, event_types } from '../../../../script.js';

// QR Bar Toggle Button Script with initialization method and toggle states
class QrBarToggle {
    constructor() {
        this.isAppReady = false;
        this.isOpen = false;
        this.listenerAttached = false;
        this.qrBarBaseClass = ''; // Store the base class name of the QR bar
    }
    
    initialize() {
        eventSource.on(event_types.APP_READY, () => {
            console.log("SimpleQRBarToggle: APP_READY");
            this.isAppReady = true;
            this.ensureButtonExists();
            this.applyState(); // Apply initial state
        });

        // Also run on CHAT_CHANGED as the UI might redraw
        eventSource.on(event_types.CHAT_CHANGED, () => {
            if (!this.isAppReady) return;
            this.ensureButtonExists();
            this.applyState();
        });
    }

    // Ensures the button exists in the DOM and has the listener attached
    ensureButtonExists() {
        if (!this.isAppReady) return;
        let toggleButton = document.getElementById('qr_toggle_button');
        const extensionsMenuButton = document.getElementById('extensionsMenuButton');

        if (!toggleButton && extensionsMenuButton) {
            toggleButton = this.createToggleButtonElement();
            extensionsMenuButton.insertAdjacentElement('afterend', toggleButton);
            this.attachListener(toggleButton); // Attach listener only when creating
        } else if (toggleButton && !this.listenerAttached) {
            console.log("SimpleQRBarToggle: Button found, attaching listener...");
            this.attachListener(toggleButton);
        }
    }

    // Creates the button DOM element
    createToggleButtonElement() {
        const button = document.createElement('div');
        button.id = 'qr_toggle_button';
        // Initial state is collapsed
        button.className = 'fa-solid fa-chevron-up interactable';
        button.tabIndex = 0;
        button.title = 'Expand QR Bar';
        button.style.display = 'flex';
        return button;
    }

    // Attaches the click listener
    attachListener(buttonElement) {
        if (this.listenerAttached) return; // Don't attach multiple times

        buttonElement.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            this.applyState();
        });
        this.listenerAttached = true;
        console.log("SimpleQRBarToggle: Listener attached.");
    }

    // Applies the visual state based on this.isOpen
    applyState() {
        if (!this.isAppReady) return;

        const qrBar = document.getElementById('qr--bar');
        const toggleButton = document.getElementById('qr_toggle_button');

        if (!qrBar || !toggleButton) {
            console.log("SimpleQRBarToggle: QR Bar or Button not found during applyState.");
            // Attempt to recreate button just in case it got removed between checks
            this.ensureButtonExists();
            return;
        }

        // Store base class name on first successful application
        if (!this.qrBarBaseClass && qrBar.className) {
            // Remove our specific classes if they somehow exist already
            this.qrBarBaseClass = qrBar.className
                .replace(' sqrbt-toggle_button-expanded', '')
                .replace(' sqrbt-toggle_button-collapsed', '');
            console.log(`SimpleQRBarToggle: Stored base class: "${this.qrBarBaseClass}"`);
        }
        
        // Ensure we have a base class to work with
        const baseClass = this.qrBarBaseClass || qrBar.className
            .replace(' sqrbt-toggle_button-expanded', '')
            .replace(' sqrbt-toggle_button-collapsed', '');


        if (this.isOpen) {
            qrBar.className = `${baseClass} sqrbt-toggle_button-expanded`;
            //qrBar.style.borderTopColor = 'var(--SmartThemeBodyColor)';
            toggleButton.className = 'fa-solid fa-chevron-down interactable';
            toggleButton.title = 'Collapse QR Bar';

            // Enable buttons within QR bar
            const buttonsInQrBar = qrBar.querySelectorAll('.qr--button, [id^="qr_"], .inline-drawer-toggle');
            buttonsInQrBar.forEach(button => {
                button.style.pointerEvents = 'auto';
                button.style.opacity = '1';
                if (button.tagName === 'BUTTON' || (button.tagName === 'INPUT' && button.type === 'button')) {
                    button.disabled = false;
                }
                if (button.hasAttribute('aria-disabled')) {
                    button.setAttribute('aria-disabled', 'false');
                }
            });
        } else {
            qrBar.className = `${baseClass} sqrbt-toggle_button-collapsed`;
            //qrBar.style.borderTopColor = 'var(--SmartThemeQuoteColor)';
            toggleButton.className = 'fa-solid fa-chevron-up interactable';
            toggleButton.title = 'Expand QR Bar';

            // Disable buttons within QR bar
            const buttonsInQrBar = qrBar.querySelectorAll('.qr--button, [id^="qr_"], .inline-drawer-toggle');
            buttonsInQrBar.forEach(button => {
                button.style.pointerEvents = 'none';
                button.style.opacity = '0.5'; // Visually indicate disabled state
                if (button.tagName === 'BUTTON' || (button.tagName === 'INPUT' && button.type === 'button')) {
                    button.disabled = true;
                }
                if (button.hasAttribute('aria-disabled')) {
                    button.setAttribute('aria-disabled', 'true');
                }
            });
        }
    }
}

// Create and initialize the QrBarToggle instance
const qrBarToggle = new QrBarToggle();
qrBarToggle.initialize();