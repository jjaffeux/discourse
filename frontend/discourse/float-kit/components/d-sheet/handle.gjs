import { on } from "@ember/modifier";
import { eq } from "discourse/truth-helpers";

/**
 * Handle component for the sheet
 * @component DSheetHandle
 * @param {Object} sheet - The sheet controller
 * @param {string} action - The action to perform on click: "dismiss" or "step"
 */
const Handle = <template>
  {{! template-lint-disable no-invalid-interactive }}
  <div
    data-d-sheet="handle"
    role="button"
    {{on
      "click"
      (if (eq @action "dismiss") @sheet.close (if (eq @action "step") @sheet.step))
    }}
    ...attributes
  >
    {{yield}}
  </div>
</template>;

export default Handle;


