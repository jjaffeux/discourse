// Glossary:
// ne -> SheetContent

let SheetContent = forwardRef((props, ref) => {
  let {
    asChild,
    children,
    className,
    "data-silk": dataSilk,
    travelAnimation,
    stackingAnimation,
    style,
    ...otherProps
  } = props;
  let Component = asChild ? Slot : "div";
  let { StackContext } = useContext(sheetGenericContext) || {};
  let stackContext = StackContext ?? React.createContext(null);
  let { sheetsCount } = useContext(stackContext) || {};
  let { styleValue, composedRef } = useOutlet({
    sheetId: sheetGenericContext,
    sheetsCount,
    travelAnimation,
    stackingAnimation,
    style,
  }, ref);

  let {
    scrollContainerRef,
    frontSpacerRef,
    contentWrapperRef,
    contentRef,
    backSpacerRef,
    detentMarkersRefs,
    leftEdgeRef,
    styleAttributes,
    detents,
    bleedingBackgroundPresent,
  } = useContext(sheetContext) || {};

  let contentRefComposed = useComposedRefs(contentRef, composedRef);

  return createElement("div", {
    ...styleAttributes(
      "scrollContainer",
      [
        "track",
        "swipeDisabled",
        "swipeOvershootDisabled",
        "staging",
        "positionCoveredStatus",
        "scrollContainerShouldBePassThrough",
        "swipeTrap",
      ],
      { dataSilk: ["0ac"] }
    ),
    ref: scrollContainerRef,
    children: [
      createElement("div", { ...styleAttributes("frontSpacer", ["track"]), ref: frontSpacerRef }),
      createElement("div", {
        ...styleAttributes("contentWrapper", [
          "placement",
          "track",
          "swipeOvershootDisabled",
          "swipeOutDisabledWithDetent",
          "staging",
          "position",
        ]),
        ref: contentWrapperRef,
        children: [
          createElement(Component, {
            ...styleAttributes(
              "content",
              ["track", "placement", "scrollContainerShouldBePassThrough"],
              { className, dataSilk: [dataSilk, bleedingBackgroundPresent && "0af"] }
            ),
            style: styleValue,
            ...otherProps,
            ref: contentRefComposed,
            children,
          }),
          // Additional nested elements would be here in full implementation
        ],
      }),
      // Additional elements would be here in full implementation
    ],
  });
});

SheetContent.displayName = "Sheet.Content";
