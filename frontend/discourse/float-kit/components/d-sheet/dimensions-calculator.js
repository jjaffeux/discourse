import { getBrowserInfo } from "./browser-detection";

export default class SheetDimensionCalculator {
  constructor(elements) {
    this.elements = elements;
    this.cache = {};
  }

  /**
   * Calculate all dimensions needed for sheet positioning
   */
  calculateDimensions(track, placement, detents) {
    const viewElement = this.elements.view;
    const contentElement = this.elements.content;
    const detentMarkers = this.elements.detentMarkers;

    const viewStyle = window.getComputedStyle(viewElement);
    const contentStyle = window.getComputedStyle(contentElement);

    const isHorizontal =
      track === "right" || track === "left" || track === "horizontal";
    const isCentered = track === "horizontal" || track === "vertical";
    const travelProp = isHorizontal ? "width" : "height";
    const crossProp = isHorizontal ? "height" : "width";

    // Helper to parse dimension
    const parseDimension = (styleValue) => ({
      px: styleValue,
      unitless: parseFloat(styleValue),
      unitlessRoundedDown: parseInt(styleValue, 10),
    });

    const viewDimensions = {
      travelAxis: parseDimension(viewStyle.getPropertyValue(travelProp)),
      crossAxis: parseDimension(viewStyle.getPropertyValue(crossProp)),
    };

    const contentDimensions = {
      travelAxis: parseDimension(contentStyle.getPropertyValue(travelProp)),
      crossAxis: parseDimension(contentStyle.getPropertyValue(crossProp)),
    };

    // TWO-PASS APPROACH (like Silk):
    // Pass 1: Apply view/content dimensions as CSS variables so detent markers can resolve
    const preliminaryDimensions = {
      view: viewDimensions,
      content: contentDimensions,
      detentMarkers: [], // Empty for now
    };
    this.applyDimensionVariables(preliminaryDimensions, viewElement, placement);

    // Pass 2: NOW read detent markers (they can resolve var(--d-sheet-content-travel-axis))
    // Like Silk (lines 8827-8882): For each marker, add its size to n, then set accumulatedOffsets = n
    // This means accumulatedOffsets INCLUDES the current marker's size
    let n = 0;
    const contentSize = contentDimensions.travelAxis.unitless;

    const detentMarkerDimensions = detentMarkers.map((marker) => {
      const markerStyle = window.getComputedStyle(marker);
      const dims = {
        travelAxis: parseDimension(markerStyle.getPropertyValue(travelProp)),
        crossAxis: parseDimension(markerStyle.getPropertyValue(crossProp)),
      };

      // Like Silk (line 8831-8832): add marker size to n
      n += dims.travelAxis.unitless;

      const result = {
        ...dims,
        accumulatedOffsets: {
          travelAxis: {
            px: n + "px",
            unitless: n,
            unitlessRoundedDown: null,
          },
        },
        cumulativeSize: n,
      };

      return result;
    });

    // Like Silk (lines 8863-8882): Add a virtual "full height" marker at the end
    // This represents the full-open position (progress = 1.0)
    const c = contentSize - n; // remaining content after all explicit markers
    detentMarkerDimensions.push({
      travelAxis: {
        px: c + "px",
        unitless: c,
        unitlessRoundedDown: null,
      },
      crossAxis: {
        px: "1px",
        unitless: 1,
        unitlessRoundedDown: 1,
      },
      accumulatedOffsets: {
        travelAxis: {
          px: contentSize + "px",
          unitless: contentSize, // n + c = contentSize
          unitlessRoundedDown: null,
        },
      },
      cumulativeSize: contentSize,
    });

    // Calculate progress values at each detent
    // contentSize already defined above from contentDimensions.travelAxis.unitless
    console.log(
      "Dimension calculations:",
      JSON.stringify(
        {
          viewSize: viewDimensions.travelAxis.unitless,
          contentSize,
          detentMarkersCount: detentMarkers.length,
        },
        null,
        2
      )
    );
    const progressAtDetents = [
      {
        before: -2.1 / contentSize,
        exact: 0,
        after: 2.1 / contentSize,
      },
    ];

    // Like Silk (line 8900): iterate over all markers EXCEPT the last (virtual full-height)
    // Use accumulatedOffsets for progress calculation (includes current marker)
    detentMarkerDimensions.slice(0, -1).forEach((marker) => {
      const offset = marker.accumulatedOffsets.travelAxis.unitless;
      progressAtDetents.push({
        before: (offset - 2.1) / contentSize,
        exact: offset / contentSize,
        after: (offset + 2.1) / contentSize,
      });
    });

    // Like Silk (line 8908-8911): Add final entry for full height (progress = 1.0)
    progressAtDetents.push({
      before: (contentSize - 2.1) / contentSize,
      exact: 1, // contentSize / contentSize = 1.0
      after: (contentSize + 2.1) / contentSize,
    });

    return {
      view: viewDimensions,
      content: contentDimensions,
      detentMarkers: detentMarkerDimensions,
      progressValueAtDetents: progressAtDetents,
      exactProgressValueAtDetents: progressAtDetents.map((p) => p.exact),
    };
  }

  /**
   * Set CSS custom properties on the view element
   * @param {Object} dimensions - The calculated dimensions
   * @param {HTMLElement} viewElement - The view element
   * @param {string} contentPlacement - The content placement ("start", "center", "end")
   */
  applyDimensionVariables(dimensions, viewElement, contentPlacement = "end") {
    console.log("applyDimensionVariables called with:", {
      hasView: !!dimensions.view,
      hasContent: !!dimensions.content,
      viewElement,
      viewTravel: dimensions.view?.travelAxis?.unitless,
      contentTravel: dimensions.content?.travelAxis?.unitless,
    });

    // Set the CSS variables that the SCSS expects (using descriptive names)
    if (dimensions.view) {
      viewElement.style.setProperty(
        "--d-sheet-view-travel-axis",
        dimensions.view.travelAxis.px
      );
      viewElement.style.setProperty(
        "--d-sheet-view-cross-axis",
        dimensions.view.crossAxis.px
      );
    }

    if (dimensions.content) {
      viewElement.style.setProperty(
        "--d-sheet-content-travel-axis",
        dimensions.content.travelAxis.px
      );
      viewElement.style.setProperty(
        "--d-sheet-content-cross-axis",
        dimensions.content.crossAxis.px
      );
    }

    // Calculate front spacer size (space before content for closed position)
    // Like Silk (line 8936-8959): frontSpacer = contentSize + snapAccelerator
    // This is the same regardless of whether there are detents or not
    if (dimensions.view && dimensions.content) {
      // Calculate snap accelerator like Silk's nj function
      // This ensures scroll position doesn't snap back to 0 with mandatory scroll-snap
      const viewSize = dimensions.view.travelAxis.unitless;
      const contentSize = dimensions.content.travelAxis.unitless;
      const snapOutAccelerator = this.calculateSnapOutAccelerator(
        viewSize,
        contentSize,
        contentPlacement
      );

      // Like Silk: frontSpacer = contentSize + snapAccelerator
      const frontSpacerSize = contentSize + snapOutAccelerator;
      console.log(
        "Setting front spacer (like Silk):",
        frontSpacerSize,
        "= contentSize + snapAccelerator =",
        contentSize,
        "+",
        snapOutAccelerator
      );

      // Store frontSpacer in dimensions for use in scroll calculations
      dimensions.frontSpacer = {
        travelAxis: {
          px: `${frontSpacerSize}px`,
          unitless: frontSpacerSize,
        },
      };

      viewElement.style.setProperty(
        "--d-sheet-front-spacer",
        `${frontSpacerSize}px`
      );
    }

    // Back spacer size should equal view travel size (not sum of detent markers)
    // This is needed for proper scroll snapping to work correctly
    if (dimensions.view) {
      const backSpacerSize = dimensions.view.travelAxis.unitless;
      viewElement.style.setProperty(
        "--d-sheet-back-spacer",
        `${backSpacerSize}px`
      );
      console.log("Setting back spacer:", backSpacerSize);

      // Verify the variables were set
      const frontSpacerCheck = window
        .getComputedStyle(viewElement)
        .getPropertyValue("--d-sheet-front-spacer");
      const backSpacerCheck = window
        .getComputedStyle(viewElement)
        .getPropertyValue("--d-sheet-back-spacer");

      // Check if spacers can access the variables
      const frontSpacerElement = viewElement.querySelector(
        '[data-d-sheet~="front-spacer"]'
      );
      const frontSpacerComputedVar = frontSpacerElement
        ? window
            .getComputedStyle(frontSpacerElement)
            .getPropertyValue("--d-sheet-front-spacer")
        : null;
      const frontSpacerActualHeight = frontSpacerElement
        ? frontSpacerElement.offsetHeight
        : null;

      const backSpacerElement = viewElement.querySelector(
        '[data-d-sheet~="back-spacer"]'
      );

      console.log("Variables after setting:", {
        frontSpacer: frontSpacerCheck,
        backSpacer: backSpacerCheck,
        viewElementInDom: document.body.contains(viewElement),
        frontSpacerElementFound: !!frontSpacerElement,
        frontSpacerComputedVar,
        frontSpacerActualHeight,
      });

      // Debug spacer scroll-snap-align
      requestAnimationFrame(() => {
        if (frontSpacerElement) {
          const frontStyle = window.getComputedStyle(frontSpacerElement);
          console.log(
            "🔧 FRONT SPACER DEBUG:",
            JSON.stringify({
              width: frontStyle.width,
              height: frontStyle.height,
              scrollSnapAlign: frontStyle.scrollSnapAlign,
              order: frontStyle.order,
            })
          );
        }
        if (backSpacerElement) {
          const backStyle = window.getComputedStyle(backSpacerElement);
          console.log(
            "🔧 BACK SPACER DEBUG:",
            JSON.stringify({
              width: backStyle.width,
              height: backStyle.height,
              scrollSnapAlign: backStyle.scrollSnapAlign,
              order: backStyle.order,
            })
          );
        }
      });
    }

    // First detent size
    if (dimensions.detentMarkers && dimensions.detentMarkers.length > 0) {
      viewElement.style.setProperty(
        "--d-sheet-first-detent-size",
        dimensions.detentMarkers[0].travelAxis.px
      );
    }

    // Calculate and store snap accelerator in dimensions
    const snapAcceleratorValue = this.calculateSnapOutAccelerator(
      dimensions.view?.travelAxis?.unitless || 0,
      dimensions.content?.travelAxis?.unitless || 0,
      contentPlacement
    );
    dimensions.snapOutAccelerator = {
      travelAxis: {
        px: `${snapAcceleratorValue}px`,
        unitless: snapAcceleratorValue,
      },
    };
    viewElement.style.setProperty(
      "--d-sheet-snap-accelerator",
      `${snapAcceleratorValue}px`
    );
  }

  /**
   * Calculate snap out accelerator
   * This value is used to offset the scroll position so it doesn't snap back to 0
   * with mandatory scroll-snap-type.
   *
   * Like Silk's nj function (source.js lines 8726-8746).
   *
   * @param {number} viewSize - The view size in pixels
   * @param {number} contentSize - The content size in pixels
   * @param {string} contentPlacement - The content placement ("start", "center", "end")
   * @returns {number} The snap accelerator value in pixels
   */
  calculateSnapOutAccelerator(viewSize, contentSize, contentPlacement = "end") {
    // For "center": effectiveSize = contentSize + (viewSize - contentSize) / 2
    // For other placements: effectiveSize = contentSize
    const effectiveSize =
      contentPlacement === "center"
        ? contentSize + (viewSize - contentSize) / 2
        : contentSize;

    // Like Silk: Use browser detection for platform-specific accelerator values
    const { browserEngine, platform } = getBrowserInfo();

    let accelerator;
    if (browserEngine === "chromium") {
      // Chromium: 70 + 25% of size (up to 1440px), then 30%
      accelerator =
        effectiveSize <= 1440 ? 70 + 0.25 * effectiveSize : 0.3 * effectiveSize;
    } else if (browserEngine === "webkit") {
      if (platform === "ios" || platform === "ipados") {
        // iOS/iPadOS WebKit: 15 + 10% of size (up to 716px), then 12%
        accelerator =
          effectiveSize <= 716
            ? 15 + 0.1 * effectiveSize
            : 0.12 * effectiveSize;
      } else {
        // macOS Safari: 50% of size
        accelerator = 0.5 * effectiveSize;
      }
    } else {
      // Gecko (Firefox) or unknown: 10px
      accelerator = 10;
    }

    return accelerator;
  }
}
