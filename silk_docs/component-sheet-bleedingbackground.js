// Glossary:
// nt -> SheetBleedingBackground

let SheetBleedingBackground = forwardRef((props, ref) => {
  let { asChild, className, "data-silk": dataSilk, ...otherProps } = props;
  let {
    staging,
    placement,
    track,
    setBleedingBackgroundPresent,
  } = useContext(sheetContext) || {};

  useEffect(() => {
    setBleedingBackgroundPresent(true);
    return () => {
      setBleedingBackgroundPresent(false);
    };
  }, [setBleedingBackgroundPresent]);

  let isBleedDisabled = track === "horizontal" || track === "vertical";
  let propsWithStyling = useStyling("Sheet", { staging, placement, track, bleedDisabled: isBleedDisabled });

  return createElement(SheetOutlet, {
    asChild,
    ...propsWithStyling(
      "bleedingBackground",
      ["staging", "placement", "track", "bleedDisabled"],
      { className, dataSilk }
    ),
    ...otherProps,
    ref,
  });
});

SheetBleedingBackground.displayName = "Sheet.BleedingBackground";
