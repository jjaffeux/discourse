import { modifier } from "ember-modifier";
import { isAppleMobile } from "../d-sheet/browser-detection";

/**
 * Set of input types that don't trigger keyboard/text entry
 * Following Silk's ew set
 */
const NON_TEXT_INPUT_TYPES = new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset",
]);

/**
 * Check if an element is a text input (following Silk's eT function)
 * @param {Element} element
 * @returns {boolean}
 */
function isTextInput(element) {
  if (!element) {
    return false;
  }
  if (
    element instanceof HTMLInputElement &&
    !NON_TEXT_INPUT_TYPES.has(element.type)
  ) {
    return true;
  }
  if (element instanceof HTMLTextAreaElement) {
    return true;
  }
  if (element instanceof HTMLElement && element.isContentEditable) {
    return true;
  }
  return false;
}

/**
 * Check if element is a color input or select (following Silk's eP function)
 * @param {Element} element
 * @returns {boolean}
 */
function isColorOrSelect(element) {
  if (!element) {
    return false;
  }
  if (element instanceof HTMLInputElement && element.type === "color") {
    return true;
  }
  if (element instanceof HTMLSelectElement) {
    return true;
  }
  return false;
}

/**
 * Check if element is a clone (following Silk's ex function)
 * @param {Element} element
 * @returns {boolean}
 */
function isClone(element) {
  return element?.getAttribute("data-d-scroll-clone") === "true";
}

/**
 * Check if keyboard is visible (following Silk's eD function)
 * Keyboard is considered visible if visual viewport is 200px smaller than window
 * @returns {boolean}
 */
function isKeyboardVisible() {
  const visualHeight = window.visualViewport?.height ?? window.innerHeight;
  return window.innerHeight - 200 > visualHeight;
}

/**
 * Check if element is a password-related input (following Silk's tc function)
 * @param {Element} element
 * @returns {boolean}
 */
function isPasswordRelatedInput(element) {
  if (!(element instanceof HTMLInputElement)) {
    return false;
  }
  if (element.type === "password") {
    return true;
  }
  if (element.type === "text" && element.autocomplete === "username") {
    return true;
  }
  const form = element.closest("form");
  if (form?.querySelector('input[type="password"]')) {
    return true;
  }
  return false;
}

/**
 * Check if element is near the bottom of the visual viewport (following Silk's tu function)
 * @param {Element} element
 * @returns {boolean}
 */
function isNearViewportBottom(element) {
  const rect = element.getBoundingClientRect();
  const visualHeight = window.visualViewport?.height ?? window.innerHeight;
  const distanceToBottom = visualHeight - rect.bottom;
  return distanceToBottom > -rect.height / 2 && distanceToBottom < rect.height + 32;
}

/**
 * Modifier to prevent the browser's native scroll-into-view behavior
 * when text inputs receive focus inside a scroll container.
 *
 * Following Silk's nativeFocusScrollPrevention pattern exactly:
 * - On iOS/iPadOS: Uses clone technique for certain inputs
 * - Global document-level event listeners for blur, touchstart, touchend, focusin
 * - Focuses scroll container to anchor scroll position
 *
 * Usage:
 *   {{nativeFocusScrollPrevention true}}
 *
 * @param {HTMLElement} scrollContainer - The scroll container element
 * @param {boolean} enabled - Whether prevention is enabled
 */
export default modifier((scrollContainer, [enabled]) => {
  if (!enabled) {
    return;
  }

  // Mark this scroll container as having focus scroll prevention
  scrollContainer.setAttribute("data-d-scroll-focus-prevention", "true");

  /**
   * Check if element is inside this scroll container with prevention enabled
   * (following Silk's td function)
   */
  function isInsidePreventionContainer(element) {
    const container = element?.closest('[data-d-scroll-focus-prevention="true"]');
    return container === scrollContainer;
  }

  // Like Silk: nativeFocusScrollPrevention only activates on iOS/iPadOS
  // On other platforms, the browser handles focus scrolling fine
  if (!isAppleMobile()) {
    return () => {
      scrollContainer.removeAttribute("data-d-scroll-focus-prevention");
    };
  }

  // iOS/iPadOS specific handlers
  {
    /**
     * touchstart handler (following Silk's e function)
     * Focuses the scroll container when touch starts on an element inside it
     */
    const handleTouchStart = (event) => {
      const target = event.target;
      if (isInsidePreventionContainer(target)) {
        scrollContainer.focus({ preventScroll: true });
        document.removeEventListener("touchstart", handleTouchStart, { capture: true });
      }
    };

    /**
     * blur handler (following Silk's t function)
     * Handles focus leaving an element - may use clone technique
     */
    const handleBlur = (event) => {
      const target = event.target;
      const relatedTarget = event.relatedTarget;

      // If no relatedTarget, add touchstart listener
      if (!relatedTarget) {
        document.addEventListener("touchstart", handleTouchStart, {
          capture: true,
          passive: false,
        });
        return;
      }

      // Check if relatedTarget is inside our container
      if (!isInsidePreventionContainer(relatedTarget)) {
        return;
      }

      // If relatedTarget is a color/select, add touchstart listener
      if (isColorOrSelect(relatedTarget)) {
        document.addEventListener("touchstart", handleTouchStart, {
          capture: true,
          passive: false,
        });
      }

      // Skip if neither text input nor color/select, or if target is a clone
      if ((!isTextInput(relatedTarget) && !isColorOrSelect(relatedTarget)) || isClone(target)) {
        return;
      }

      // Clone technique for non-password text inputs near viewport bottom
      if (!isPasswordRelatedInput(relatedTarget) && isTextInput(target) && isNearViewportBottom(target)) {
        // Create a clone positioned off-screen
        const clone = target.cloneNode(false);
        clone.removeAttribute("id");
        clone.setAttribute("data-d-scroll-clone", "true");
        clone.style.setProperty("position", "fixed");
        clone.style.setProperty("left", "0");
        clone.style.setProperty("top", "0");
        clone.style.setProperty("transform", "translateY(-3000px) scale(0)");
        document.documentElement.appendChild(clone);

        // Focus the clone first
        clone.focus({ preventScroll: true });

        // After 32ms, refocus the original and remove clone
        setTimeout(() => {
          relatedTarget.focus({ preventScroll: true });
          clone.remove();
        }, 32);
      } else {
        // Just refocus with preventScroll
        relatedTarget.focus({ preventScroll: true });
      }
    };

    /**
     * touchend handler (following Silk's n function)
     * Focuses scroll container when touch ends on active text input
     */
    const handleTouchEnd = (event) => {
      const target = event.target;
      if (
        target === document.activeElement &&
        isTextInput(target) &&
        !isKeyboardVisible() &&
        isInsidePreventionContainer(target)
      ) {
        scrollContainer.focus({ preventScroll: true });
      }
    };

    /**
     * focusin handler (following Silk's a function)
     * Sets cursor to end of input on first focus
     */
    const handleFocusIn = (event) => {
      const target = event.target;
      if (
        target &&
        "setSelectionRange" in target &&
        (["password", "search", "tel", "text", "url"].includes(target.type) ||
          target instanceof HTMLTextAreaElement) &&
        target._d_scroll_focusedBefore !== true
      ) {
        const length = target.value?.length ?? 0;
        target.setSelectionRange?.(length, length);
        target._d_scroll_focusedBefore = true;
      }
    };

    // Add document-level listeners
    document.addEventListener("blur", handleBlur, { capture: true, passive: false });
    document.addEventListener("touchstart", handleTouchStart, { capture: true, passive: true });
    document.addEventListener("touchend", handleTouchEnd, { capture: true, passive: true });
    document.addEventListener("focusin", handleFocusIn);

    // Cleanup function
    return () => {
      scrollContainer.removeAttribute("data-d-scroll-focus-prevention");
      document.removeEventListener("blur", handleBlur, { capture: true });
      document.removeEventListener("touchstart", handleTouchStart, { capture: true });
      document.removeEventListener("touchend", handleTouchEnd, { capture: true });
      document.removeEventListener("focusin", handleFocusIn);
    };
  }
});
