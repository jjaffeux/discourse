import Component from "@glimmer/component";
import { on } from "@ember/modifier";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { htmlSafe } from "@ember/template";
import { modifier as modifierFn } from "ember-modifier";
import concatClass from "discourse/helpers/concat-class";
import { eq, not } from "discourse/truth-helpers";

/**
 * Helper to interpolate between two values based on progress
 * @param {number|string} start - Start value
 * @param {number|string} end - End value
 * @param {number} progress - Progress from 0 to 1
 * @returns {string} Interpolated value
 */
function tween(start, end, progress) {
  const startNum = typeof start === "string" ? parseFloat(start) : start;
  const endNum = typeof end === "string" ? parseFloat(end) : end;
  const unit = typeof start === "string" ? start.replace(/[\d.-]/g, "") : "";
  return startNum + (endNum - startNum) * Math.min(progress, 1) + unit;
}

/**
 * Apply stacking animation transforms to an element
 * @param {HTMLElement} element - Target element
 * @param {Object} stackingAnimation - Animation config
 * @param {number} progress - Stacking progress (0 = no sheets above, 1+ = sheets stacked)
 */
function applyStackingAnimation(element, stackingAnimation, progress) {
  if (!stackingAnimation || !element) {
    return;
  }

  const transforms = [];
  let transformOrigin = null;

  for (const [property, value] of Object.entries(stackingAnimation)) {
    if (value === null || value === undefined) {
      continue;
    }

    // Handle transformOrigin separately
    if (property === "transformOrigin") {
      transformOrigin = value;
      continue;
    }

    let computedValue;

    if (Array.isArray(value)) {
      // Keyframes array syntax: [start, end]
      computedValue = tween(value[0], value[1], progress);
    } else if (typeof value === "function") {
      // Function syntax: ({ progress, tween }) => value
      computedValue = value({
        progress,
        tween: (start, end) => tween(start, end, progress),
      });
    } else if (typeof value === "string") {
      // Static string value
      computedValue = value;
    } else {
      continue;
    }

    // Map property to CSS transform function
    const transformProps = [
      "translate",
      "translateX",
      "translateY",
      "translateZ",
      "scale",
      "scaleX",
      "scaleY",
      "scaleZ",
      "rotate",
      "rotateX",
      "rotateY",
      "rotateZ",
      "skew",
      "skewX",
      "skewY",
    ];

    if (transformProps.includes(property)) {
      transforms.push(`${property}(${computedValue})`);
    } else if (property === "opacity") {
      element.style.opacity = computedValue;
    } else {
      // Generic CSS property
      element.style[property] = computedValue;
    }
  }

  if (transforms.length > 0) {
    element.style.transform = transforms.join(" ");
  }

  if (transformOrigin) {
    element.style.transformOrigin = transformOrigin;
  }
}

export default class Content extends Component {
  // Scroll listener modifier (like Silk's useEffect pattern)
  scrollListener = modifierFn((element, [handler]) => {
    element.addEventListener("scroll", handler, { passive: true });

    // Return cleanup function to remove listener (like Silk does)
    return () => {
      element.removeEventListener("scroll", handler);
    };
  });

  // Modifier to register stacking animation with the controller
  stackingAnimationModifier = modifierFn(
    (element, [sheet, stackingAnimation]) => {
      if (!sheet || !stackingAnimation) {
        return;
      }

      // Register stacking animation callback
      const unregister = sheet.registerStackingAnimation({
        target: element,
        callback: (progress) => {
          applyStackingAnimation(element, stackingAnimation, progress);
        },
      });

      // Return cleanup function
      return () => {
        unregister?.();
        // Reset transforms on cleanup
        element.style.transform = "";
        element.style.transformOrigin = "";
      };
    }
  );

  stylesForDetentMarker(detents, index) {
    const currentDetent = detents[index];
    const prevDetent = index > 0 ? detents[index - 1] : "0px";

    return htmlSafe(
      `--d-sheet-marker-prev: ${prevDetent}; --d-sheet-marker-current: ${currentDetent}; --d-sheet-marker-index: ${index};`
    );
  }

  <template>
    <div
      data-d-sheet={{concatClass
        "scroll-container"
        "overscroll-contain"
        "scroll-trap-marker"
        @sheet.tracks
        (if (not @sheet.inertOutside) "no-pointer-events")
      }}
      {{didInsert @sheet.registerScrollContainer}}
      {{this.scrollListener @sheet.handleScrollForClose}}
      {{on "touchstart" @sheet.handleTouchStart passive=true}}
      {{on "touchend" @sheet.handleTouchEnd passive=true}}
    >
      <div data-d-sheet={{concatClass "front-spacer" @sheet.tracks}}></div>

      <div
        data-d-sheet={{concatClass
          "content-wrapper"
          @sheet.placement
          (if @sheet.swipeOvershoot "overshoot-active" "overshoot-inactive")
          (if @sheet.swipeOutDisabled "swipe-out-disabled")
          (if
            @sheet.isHorizontalTrack
            "snap-type-x-mandatory"
            "snap-type-y-mandatory"
          )
          @sheet.tracks
        }}
        {{didInsert @sheet.registerContentWrapper}}
      >
        <div
          data-d-sheet={{concatClass
            "content"
            @sheet.placement
            "no-bleeding-background"
            @sheet.tracks
            (if @scrollTrapRoot "scroll-trap-root")
            (if
              @scrollTrapRoot
              (if
                (eq @scrollTrapAxis "horizontal")
                "scroll-horizontal"
                "scroll-vertical"
              )
            )
          }}
          ...attributes
          {{didInsert @sheet.registerContent}}
          {{this.stackingAnimationModifier @sheet @stackingAnimation}}
        >
          {{yield}}
        </div>
        {{#if @sheet.nativeEdgeSwipePrevention}}
          <div data-d-sheet={{concatClass "edge-marker" @sheet.tracks}}></div>
        {{/if}}
      </div>

      <div data-d-sheet={{concatClass "back-spacer" @sheet.tracks}}>
        {{#each @sheet.detents as |detent index|}}
          <div
            data-d-sheet={{concatClass
              "detent-marker"
              @sheet.tracks
              (if @sheet.swipeOutDisabled "swipe-out-disabled")
            }}
            style={{this.stylesForDetentMarker @sheet.detents index}}
            {{didInsert @sheet.registerDetentMarker}}
          ></div>
        {{/each}}
      </div>
    </div>
  </template>
}
