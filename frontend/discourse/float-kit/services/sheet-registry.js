import Service from "@ember/service";

/**
 * Service for managing sheet instances and global click-outside handling.
 *
 * Like Silk: Uses a global click listener to handle backdrop clicks for all sheets.
 * This avoids z-index issues where scroll-container might block backdrop clicks.
 * See Silk source.js lines 3828-3914 for reference implementation.
 */
export default class SheetRegistry extends Service {
  sheets = new Map();

  // Track sheets in registration order (for topmost detection)
  sheetsInOrder = [];

  // Global click listener state
  _clickOutsideCleanup = null;
  _pointerDownTarget = null;

  register(controller) {
    this.sheets.set(controller.id, controller);
    this.sheetsInOrder.push(controller);

    // Add global click listener when first sheet registers
    if (this.sheetsInOrder.length === 1) {
      this._setupClickOutsideListener();
    }
  }

  unregister(controller) {
    this.sheets.delete(controller.id);
    const index = this.sheetsInOrder.indexOf(controller);
    if (index !== -1) {
      this.sheetsInOrder.splice(index, 1);
    }

    // Remove global click listener when last sheet unregisters
    if (this.sheetsInOrder.length === 0) {
      this._cleanupClickOutsideListener();
    }
  }

  find(id) {
    return this.sheets.get(id);
  }

  /**
   * Get the topmost sheet (last in order).
   * @returns {Object|null} The topmost sheet controller or null
   */
  getTopmostSheet() {
    if (this.sheetsInOrder.length === 0) {
      return null;
    }
    return this.sheetsInOrder[this.sheetsInOrder.length - 1];
  }

  /**
   * Set up global click listener for click-outside handling.
   * Like Silk's `ta` function (source.js lines 3892-3914).
   * @private
   */
  _setupClickOutsideListener() {
    // Track pointerdown target to handle cases where click target differs
    // (e.g., element removed between pointerdown and click)
    const handlePointerDown = (event) => {
      this._pointerDownTarget = event.target;
    };

    // Handle click events
    const handleClick = (event) => {
      this._handleClickOutside(event);
    };

    document.addEventListener("pointerdown", handlePointerDown, {
      capture: true,
    });
    document.addEventListener("click", handleClick, {
      capture: true,
    });

    this._clickOutsideCleanup = () => {
      document.removeEventListener("pointerdown", handlePointerDown, {
        capture: true,
      });
      document.removeEventListener("click", handleClick, {
        capture: true,
      });
    };
  }

  /**
   * Clean up global click listener.
   * @private
   */
  _cleanupClickOutsideListener() {
    if (this._clickOutsideCleanup) {
      this._clickOutsideCleanup();
      this._clickOutsideCleanup = null;
    }
    this._pointerDownTarget = null;
  }

  /**
   * Handle click-outside events - entry point.
   * Like Silk's `tn` function (source.js lines 3875-3891).
   * Validates the click event and delegates to _processClickOnLayer.
   * @param {Event} event - Click event
   * @private
   */
  _handleClickOutside(event) {
    const target = event.target;

    // Skip if target is not connected (removed from DOM)
    if (!target || !target.isConnected) {
      this._pointerDownTarget = null;
      return;
    }

    // Skip if click originated from body and pointerdown wasn't on body
    // (handles edge cases where click bubbles unexpectedly)
    if (target === document.body && this._pointerDownTarget !== document.body) {
      this._pointerDownTarget = null;
      return;
    }

    // Process from topmost layer down
    const layerCount = this.sheetsInOrder.length;
    if (layerCount > 0) {
      this._processClickOnLayer(layerCount - 1, event);
    }

    this._pointerDownTarget = null;
  }

  /**
   * Process click on a specific layer.
   * Like Silk's `te` function (source.js lines 3828-3872).
   * Checks if click should dismiss this layer, and optionally propagates to layers below.
   * @param {number} layerIndex - Index of the layer to process
   * @param {Event} event - Click event
   * @private
   */
  _processClickOnLayer(layerIndex, event) {
    const sheet = this.sheetsInOrder[layerIndex];
    if (!sheet) {
      return;
    }

    // Only handle clicks when sheet is in "open" state
    if (sheet.currentState !== "open") {
      return;
    }

    const target = event.target;
    const scrollContainer = sheet.scrollContainer;
    const backdrop = sheet.backdrop;
    const view = sheet.view;
    const content = sheet.content;

    const isOnScrollContainer = scrollContainer === target;
    const isOnBackdrop = backdrop === target;
    const isOutsideView = view && !view.contains(target);
    const isInsideContent = content && content.contains(target);

    // Check if click is in the "outside" area for this layer
    // Like Silk (lines 3836-3854): check if target is backdrop, scroll-container, or outside view
    const isClickOutside =
      isOnScrollContainer ||
      isOnBackdrop ||
      (isOutsideView && !isInsideContent);

    if (isClickOutside) {
      // Like Silk: Use sheet's onClickOutside config (see Toast.tsx lines 112-115)
      const { dismiss, stopOverlayPropagation } = sheet.onClickOutside;

      // Dismiss this layer if configured to do so
      if (dismiss) {
        sheet.close();
      }

      // If not stopping propagation, process layer below
      if (!stopOverlayPropagation && layerIndex > 0) {
        this._processClickOnLayer(layerIndex - 1, event);
      }
    }
  }

  willDestroy() {
    super.willDestroy();
    this._cleanupClickOutsideListener();
  }
}
