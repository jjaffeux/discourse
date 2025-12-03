class StateMachine {
  constructor(definition, initialState) {
    this.definition = definition;
    this.current = initialState;
    this.context = {}; // For guards/conditions
    // Track nested machine states: { machineName: "stateName" }
    // E.g., { scroll: "ongoing", swipe: "unstarted" }
    this.nestedMachines = {};
    // Initialize nested machines for initial state
    this.initializeNestedMachines(this.current);
  }

  /**
   * Initialize nested machines for a state
   */
  initializeNestedMachines(statePath) {
    const stateConfig = this.getStateConfig(statePath);
    if (stateConfig && stateConfig.machines) {
      for (const machineDef of stateConfig.machines) {
        this.nestedMachines[machineDef.name] = machineDef.initial;
      }
    }
  }

  /**
   * Get the state configuration for a given state
   * Supports nested states with dot notation (e.g., "closed.pending")
   * Also supports nested machines (e.g., "open.scroll.ongoing")
   */
  getStateConfig(statePath) {
    const parts = statePath.split(".");
    let config = this.definition.states[parts[0]];

    if (!config) {
      return null;
    }

    // If there are nested states or nested machines, navigate down
    for (let i = 1; i < parts.length; i++) {
      // Check for nested states first
      if (config.states && config.states[parts[i]]) {
        config = config.states[parts[i]];
      }
      // Check for nested machines
      else if (config.machines) {
        // Find the nested machine
        const machineDef = config.machines.find((m) => m.name === parts[i]);
        if (machineDef && i + 1 < parts.length) {
          // Navigate into the nested machine's states
          const machineState = parts[i + 1];
          if (machineDef.states && machineDef.states[machineState]) {
            config = machineDef.states[machineState];
            i++; // Skip the machine state part
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    }

    return config;
  }

  /**
   * Get nested machine definition for a state
   * E.g., getNestedMachine("open", "scroll") returns the scroll machine definition
   */
  getNestedMachine(stateName, machineName) {
    const stateConfig = this.getStateConfig(stateName);
    if (!stateConfig || !stateConfig.machines) {
      return null;
    }
    return stateConfig.machines.find((m) => m.name === machineName);
  }

  /**
   * Get the current state of a nested machine
   */
  getNestedMachineState(machineName) {
    return this.nestedMachines[machineName] || null;
  }

  /**
   * Set the state of a nested machine
   */
  setNestedMachineState(machineName, stateName) {
    this.nestedMachines[machineName] = stateName;
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
   * Messages are first tried on nested machines, then on the current state
   */
  send(message, context = {}) {
    const messageType = typeof message === "string" ? message : message.type;

    // First, try to route message to nested machines in current state
    const currentStateConfig = this.getStateConfig(this.current);
    if (currentStateConfig && currentStateConfig.machines) {
      for (const machineDef of currentStateConfig.machines) {
        const machineName = machineDef.name;
        const currentMachineState =
          this.getNestedMachineState(machineName) || machineDef.initial;
        const machineStateConfig = machineDef.states?.[currentMachineState];

        if (machineStateConfig?.on?.[messageType]) {
          const transitions = machineStateConfig.on[messageType];
          const transitionList = Array.isArray(transitions)
            ? transitions
            : [transitions];

          for (const transition of transitionList) {
            if (typeof transition === "string") {
              this.setNestedMachineState(machineName, transition);
              return true;
            }

            if (transition.guard) {
              if (!this.checkGuard(transition.guard, context)) {
                continue;
              }
            }

            if (transition.target) {
              this.setNestedMachineState(machineName, transition.target);
              return true;
            }
          }
        }
      }
    }

    // Try current state
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
        // Initialize nested machines for new state
        this.nestedMachines = {};
        this.initializeNestedMachines(this.current);
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
        // Initialize nested machines for new state
        this.nestedMachines = {};
        this.initializeNestedMachines(this.current);
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
   * Also supports nested machine state matching (e.g., "open.scroll.ongoing")
   * E.g., matches("closed") returns true for "closed", "closed.pending", "closed.safe-to-unmount"
   * E.g., matches("open.scroll.ongoing") checks if in "open" state and scroll machine is "ongoing"
   */
  matches(state) {
    // Exact match
    if (this.current === state) {
      return true;
    }

    // Check for nested machine state match (e.g., "open.scroll.ongoing")
    const parts = state.split(".");
    if (parts.length >= 3) {
      // Format: "parent.machine.state"
      const parentState = parts[0];
      const machineName = parts[1];
      const machineState = parts.slice(2).join("."); // In case state has dots

      if (this.current === parentState || this.current.startsWith(parentState + ".")) {
        const currentMachineState = this.getNestedMachineState(machineName);
        if (currentMachineState === machineState) {
          return true;
        }
        // Also support prefix matching for nested machine states
        if (currentMachineState && currentMachineState.startsWith(machineState + ".")) {
          return true;
        }
      }
      return false;
    }

    // Prefix match for nested states (e.g., "closed" matches "closed.pending")
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
