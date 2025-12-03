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
   * Like Silk's addSheetStack (lines 4245-4266): Creates stack with stackingAnimations
   * @param {Object} stack - Stack instance with id property
   * @param {HTMLElement} element - DOM element for the stack (for closest lookup)
   */
  registerStack(stack, element) {
    const id = stack.id || guidFor(stack);

    // Like Silk (lines 4249-4259): Initialize stack with stackingAnimations and aggregatedStackingCallback
    const stackObject = {
      ...stack,
      id,
      stackingAnimations: [],
      aggregatedStackingCallback(progress, tween) {
        for (let i = 0; i < this.stackingAnimations.length; i++) {
          this.stackingAnimations[i].callback(progress, tween);
        }
      },
      // Like Silk: Initialize for selfAndAboveTravelProgressSum calculation
      travelProgress: 0,
      selfAndAboveTravelProgressSum: [],
    };

    this.stacks.set(id, stackObject);
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
   *
   * Note: Silk's naming is confusing - they call it "belowSheetsInStack" but populate it
   * with sheets that have HIGHER stackingIndex. We use the semantically correct approach:
   * belowSheetsInStack contains sheets that are VISUALLY below (covered by) the current sheet,
   * i.e., sheets with LOWER indices that opened before this one.
   *
   * This way, when Sheet B (top) travels, we collect Sheet A's (bottom) stacking animations
   * to animate Sheet A as it gets covered.
   *
   * @param {string} stackId - ID of the stack
   * @private
   */
  _updateBelowSheetsInStack(stackId) {
    const sheets = this.stackSheets.get(stackId);
    if (!sheets) {
      return;
    }

    // Each sheet's belowSheetsInStack contains sheets with LOWER indices
    // (sheets that opened before it and are visually below/covered by this sheet)
    sheets.forEach((sheet, index) => {
      sheet.stackingIndex = index;
      // Sheets below this one are all sheets with lower indices
      sheet.belowSheetsInStack = sheets.slice(0, index);
    });

    // Update selfAndAboveTravelProgressSum after updating belowSheetsInStack
    this._updateSelfAndAboveTravelProgressSumInStack(stackId);
  }

  /**
   * Update selfAndAboveTravelProgressSum for all sheets in a stack
   * Like Silk's updateSelfAndAboveTravelProgressSumInStack (lines 4314-4336)
   * @param {string} stackId - ID of the stack
   * @private
   */
  _updateSelfAndAboveTravelProgressSumInStack(stackId) {
    const sheets = this.stackSheets.get(stackId);
    if (!sheets) {
      return;
    }

    // Like Silk (lines 4315-4321): Sort sheets by descending stackingIndex
    const sortedSheets = [...sheets].sort(
      (a, b) => b.stackingIndex - a.stackingIndex
    );

    // Like Silk (line 4322-4323): Add stack at front if it exists
    const stack = this.stacks.get(stackId);
    if (stack) {
      sortedSheets.unshift(stack);
    }

    const totalCount = sortedSheets.length;

    // Like Silk (lines 4324-4335): Calculate selfAndAboveTravelProgressSum for each sheet
    for (let r = 0; r < totalCount; r++) {
      const sheet = sortedSheets[r];
      sheet.selfAndAboveTravelProgressSum = [];

      for (let o = 0; o < totalCount; o++) {
        if (o <= r) {
          // Like Silk (line 4328-4329): Set to 0 for self and sheets above
          sheet.selfAndAboveTravelProgressSum[o] = 0;
        } else {
          // Like Silk (lines 4330-4334): Sum travelProgress of sheets between r and o
          sheet.selfAndAboveTravelProgressSum[o] = sortedSheets
            .slice(r + 1, o + 1)
            .reduce((sum, s) => sum + (s.travelProgress || 0), 0);
        }
      }
    }
  }

  /**
   * Update a sheet's travel progress and recalculate selfAndAboveTravelProgressSum
   * Like Silk's updateSheetTravelProgress (lines 4307-4313)
   * @param {string} sheetId - ID of the sheet (use controller.id)
   * @param {number} progress - Current travel progress (0-1)
   */
  updateSheetTravelProgress(controller, progress) {
    if (!controller || !controller.stackId) {
      return;
    }

    // Like Silk (line 4311): Update the sheet's travelProgress
    controller.travelProgress = progress;

    // Like Silk (line 4312): Recalculate selfAndAboveTravelProgressSum for the stack
    this._updateSelfAndAboveTravelProgressSumInStack(controller.stackId);
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

