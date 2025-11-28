class StateMachine {
  constructor(definition, initialState) {
    this.definition = definition;
    this.current = initialState;
    this.context = {}; // For guards/conditions
  }

  /**
   * Get the state configuration for a given state
   * Supports nested states with dot notation (e.g., "closed.pending")
   */
  getStateConfig(statePath) {
    const parts = statePath.split(".");
    let config = this.definition.states[parts[0]];

    // If there are nested states, navigate down
    for (let i = 1; i < parts.length; i++) {
      if (config && config.states) {
        config = config.states[parts[i]];
      } else {
        return null;
      }
    }

    return config;
  }

  /**
   * Get the parent state name from a nested state
   * E.g., "closed.pending" → "closed"
   */
  getParentState(statePath) {
    const parts = statePath.split(".");
    return parts.length > 1 ? parts[0] : null;
  }

  /**
   * Send a message to the state machine
   * Returns true if transition happened, false otherwise
   */
  send(message, context = {}) {
    const messageType = typeof message === "string" ? message : message.type;

    // Try current state first
    let currentStateConfig = this.getStateConfig(this.current);
    let transitions = currentStateConfig?.on?.[messageType];

    // If no transition found and we're in a nested state, try parent state
    if (!transitions) {
      const parentState = this.getParentState(this.current);
      if (parentState) {
        const parentConfig = this.getStateConfig(parentState);
        transitions = parentConfig?.on?.[messageType];
      }
    }

    if (!transitions) {
      return false;
    }

    // Handle array of transitions (with guards)
    const transitionList = Array.isArray(transitions)
      ? transitions
      : [transitions];

    for (const transition of transitionList) {
      // If it's just a string, it's a simple transition
      if (typeof transition === "string") {
        this.current = transition;
        return true;
      }

      // Check guard condition if present
      if (transition.guard) {
        if (!this.checkGuard(transition.guard, context)) {
          continue; // Try next transition
        }
      }

      // Perform transition
      if (transition.target) {
        this.current = transition.target;
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a guard condition is met
   */
  checkGuard(guardName, context) {
    // You can add guard functions here
    const guards = {
      isClosed: () => this.context.isClosed,
      isClosedAndSkipOpening: () =>
        this.context.isClosed && this.context.skipOpening,
      notSkipOpening: () => !this.context.skipOpening,
      notSkipClosing: () => !this.context.skipClosing,
      skipOpening: () => this.context.skipOpening,
      skipClosing: () => this.context.skipClosing,
    };

    return guards[guardName] ? guards[guardName](context) : true;
  }

  /**
   * Check if machine is in a specific state
   * Supports both exact match and prefix match for nested states
   * E.g., matches("closed") returns true for "closed", "closed.pending", "closed.safe-to-unmount"
   */
  matches(state) {
    if (this.current === state) {
      return true;
    }

    // Also check if current state starts with the given state
    // E.g., current="closed.pending" matches state="closed"
    return this.current.startsWith(state + ".");
  }

  /**
   * Update context (for guards)
   */
  updateContext(newContext) {
    this.context = { ...this.context, ...newContext };
  }
}

export default StateMachine;
