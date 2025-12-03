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

  /**
   * Scroll trap modifier - matches Silk's ScrollTrap.Root (tq) behavior
   *
   * In Silk, ScrollTrap.Root calls scrollTo(300, 300) on scroll and resize.
   * For Toast, the content element IS the scroll-trap-root (via asChild chain).
   * The ::before pseudo-element is NOT applied to content elements (per Silk),
   * so there's no actual overflow to scroll. But Silk still calls scrollTo(300, 300)
   * so we do too for accuracy.
   */
  scrollTrapModifier = modifierFn((element, [isScrollTrapRoot]) => {
    if (!isScrollTrapRoot) {
      return;
    }

    // Like Silk tq: Initial scroll to (300, 300)
    element.scrollTo(300, 300);

    // Like Silk tq: onScroll handler scrolls back to (300, 300)
    const handleScroll = () => {
      element.scrollTo(300, 300);
    };
    element.addEventListener("scroll", handleScroll);

    // Like Silk tq: ResizeObserver to maintain scroll position
    const resizeObserver = new ResizeObserver(() => {
      element.scrollTo(300, 300);
    });
    resizeObserver.observe(element, { box: "border-box" });

    // Cleanup
    return () => {
      element.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
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
        config: stackingAnimation,
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

  stylesForDetentMarker(detents, index, isVirtual, tracks) {
    const currentDetent = isVirtual
      ? "var(--d-sheet-content-travel-axis)"
      : detents[index];
    const prevDetent =
      index > 0
        ? isVirtual
          ? detents[detents.length - 1]
          : detents[index - 1]
        : "0px";

    // Like Silk: scroll-snap-align based on track direction
    // bottom/right: start, top/left: end, horizontal/vertical: center
    let snapAlign = "start";
    if (tracks === "top" || tracks === "left") {
      snapAlign = "end";
    } else if (tracks === "horizontal" || tracks === "vertical") {
      snapAlign = "center";
    }

    return htmlSafe(
      `--d-sheet-marker-prev: ${prevDetent}; --d-sheet-marker-current: ${currentDetent}; --d-sheet-marker-index: ${index}; scroll-snap-align: ${snapAlign};`
    );
  }

  <template>
    <div
      data-d-sheet={{concatClass
        "scroll-container"
        "overscroll-contain"
        "scroll-trap-marker"
        @sheet.tracks
        @sheet.contentPlacement
        (if (not @sheet.inertOutside) "no-pointer-events")
      }}
      tabindex="-1"
      {{didInsert @sheet.registerScrollContainer}}
      {{this.scrollListener @sheet.handleScrollForClose}}
      {{on "touchstart" @sheet.handleTouchStart passive=true}}
      {{on "touchend" @sheet.handleTouchEnd passive=true}}
      {{on "focus" @sheet.handleFocus capture=true}}
    >
      <div data-d-sheet={{concatClass "front-spacer" @sheet.tracks}}></div>

      <div
        data-d-sheet={{concatClass
          "content-wrapper"
          @sheet.contentPlacement
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
            @sheet.contentPlacement
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
            (if (not @sheet.inertOutside) "no-pointer-events")
          }}
          ...attributes
          {{didInsert @sheet.registerContent}}
          {{this.stackingAnimationModifier @sheet @stackingAnimation}}
          {{this.scrollTrapModifier @scrollTrapRoot}}
        >
          {{yield}}
        </div>
        {{#if @sheet.nativeEdgeSwipePrevention}}
          <div data-d-sheet={{concatClass "edge-marker" @sheet.tracks}}></div>
        {{/if}}
      </div>

      <div data-d-sheet={{concatClass "back-spacer" @sheet.tracks}}>
        {{#if @sheet.detents}}
          {{! Like Silk: Render explicit detent markers }}
          {{#each @sheet.detents as |detent index|}}
            <div
              data-d-sheet={{concatClass
                "detent-marker"
                @sheet.tracks
                (if @sheet.swipeOutDisabled "swipe-out-disabled")
              }}
              style={{this.stylesForDetentMarker
                @sheet.detents
                index
                false
                @sheet.tracks
              }}
              {{didInsert @sheet.registerDetentMarker}}
            ></div>
          {{/each}}
          {{! Like Silk: Render virtual "full height" marker to prevent :only-child CSS rule }}
          <div
            data-d-sheet={{concatClass
              "detent-marker"
              @sheet.tracks
              (if @sheet.swipeOutDisabled "swipe-out-disabled")
            }}
            style={{this.stylesForDetentMarker
              @sheet.detents
              @sheet.detents.length
              true
              @sheet.tracks
            }}
            {{didInsert @sheet.registerDetentMarker}}
          ></div>
        {{/if}}
      </div>
    </div>
  </template>
}
