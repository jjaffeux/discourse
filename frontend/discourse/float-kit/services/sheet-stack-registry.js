import Service from "@ember/service";
import { guidFor } from "@ember/object/internals";

/**
 * Service for managing sheet stacks.
 * Tracks which sheets belong to which stacks and maintains the stacking order.
 *
 * Like Silk's SheetStack: enables stacking-driven animations where sheets
 * that are covered by other sheets can animate based on stacking progress.
 */
export default class SheetStackRegistry extends Service {
  // Map of stackId -> stack instance
  stacks = new Map();

  // Map of stackId -> array of sheet controllers in stacking order
  stackSheets = new Map();

  // Map of stackId -> Set of DOM elements (for "closest" lookup)
  stackElements = new Map();

  /**
   * Register a new stack
   * @param {Object} stack - Stack instance with id property
   * @param {HTMLElement} element - DOM element for the stack (for closest lookup)
   */
  registerStack(stack, element) {
    const id = stack.id || guidFor(stack);
    this.stacks.set(id, stack);
    this.stackSheets.set(id, []);
    if (element) {
      this.stackElements.set(id, element);
    }
    return id;
  }

  /**
   * Unregister a stack
   * @param {string} stackId - ID of the stack to unregister
   */
  unregisterStack(stackId) {
    this.stacks.delete(stackId);
    this.stackSheets.delete(stackId);
    this.stackElements.delete(stackId);
  }

  /**
   * Find the closest stack to a given DOM element
   * @param {HTMLElement} element - Element to find closest stack for
   * @returns {string|null} Stack ID or null if not found
   */
  findClosestStack(element) {
    if (!element) {
      return null;
    }

    // Walk up the DOM tree to find a stack element
    let current = element;
    while (current && current !== document.body) {
      for (const [stackId, stackElement] of this.stackElements) {
        if (stackElement === current || stackElement.contains(current)) {
          return stackId;
        }
      }
      current = current.parentElement;
    }

    // If no stack found via DOM, return the first registered stack (if any)
    // This handles the case where sheets are portaled outside the stack DOM
    if (this.stacks.size === 1) {
      return this.stacks.keys().next().value;
    }

    return null;
  }

  /**
   * Register a sheet with a stack
   * @param {string} stackId - ID of the stack
   * @param {Object} controller - Sheet controller
   */
  registerSheetWithStack(stackId, controller) {
    const sheets = this.stackSheets.get(stackId);
    if (!sheets) {
      console.warn(
        `[SheetStackRegistry] Stack ${stackId} not found when registering sheet`
      );
      return;
    }

    // Add sheet to the stack's sheet list
    sheets.push(controller);
    controller.stackId = stackId;
    controller.stackingIndex = sheets.length - 1;

    // Update belowSheetsInStack for all sheets in the stack
    this._updateBelowSheetsInStack(stackId);
  }

  /**
   * Unregister a sheet from its stack
   * @param {Object} controller - Sheet controller
   */
  unregisterSheetFromStack(controller) {
    const stackId = controller.stackId;
    if (!stackId) {
      return;
    }

    const sheets = this.stackSheets.get(stackId);
    if (!sheets) {
      return;
    }

    // Remove sheet from the stack
    const index = sheets.indexOf(controller);
    if (index !== -1) {
      sheets.splice(index, 1);
    }

    // Clear the sheet's stack reference
    controller.stackId = null;
    controller.stackingIndex = -1;
    controller.belowSheetsInStack = [];

    // Update indices and belowSheetsInStack for remaining sheets
    this._updateBelowSheetsInStack(stackId);
  }

  /**
   * Update belowSheetsInStack for all sheets in a stack
   * @param {string} stackId - ID of the stack
   * @private
   */
  _updateBelowSheetsInStack(stackId) {
    const sheets = this.stackSheets.get(stackId);
    if (!sheets) {
      return;
    }

    // Each sheet's belowSheetsInStack contains all sheets below it in the stack
    // (i.e., sheets that opened before it)
    sheets.forEach((sheet, index) => {
      sheet.stackingIndex = index;
      // Sheets below this one are all sheets with lower indices
      sheet.belowSheetsInStack = sheets.slice(0, index);
    });
  }

  /**
   * Get all sheets in a stack
   * @param {string} stackId - ID of the stack
   * @returns {Array} Array of sheet controllers
   */
  getSheetsInStack(stackId) {
    return this.stackSheets.get(stackId) || [];
  }

  /**
   * Get the stack instance
   * @param {string} stackId - ID of the stack
   * @returns {Object|null} Stack instance or null
   */
  getStack(stackId) {
    return this.stacks.get(stackId) || null;
  }
}

