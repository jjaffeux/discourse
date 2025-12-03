// Glossary:
// t2 -> SheetOutlet

let SheetOutlet = forwardRef((props, ref) => {
  let {
    asChild,
    forComponent,
    travelAnimation,
    stackingAnimation,
    style,
    className,
    ...otherProps
  } = props;
  let { staging, StackContext } = useSheetContext(forComponent);
  let stackContext = StackContext ?? React.createContext(null);
  let { sheetsCount } = useContext(stackContext) || {};
  let { styleValue, composedRef } = useOutlet({
    sheetId: forComponent,
    sheetsCount,
    travelAnimation,
    stackingAnimation,
    style,
  }, ref);
  let shouldApplyStaging = useMemo(() => staging !== "none", [staging]);
  let Component = asChild ? Slot : "div";
  let propsWithStyling = useStyling("Sheet", {});
  return createElement(Component, {
    style: styleValue,
    ...propsWithStyling("outlet", [], { className, dataSilk: [shouldApplyStaging && "0aj"] }),
    ...otherProps,
    ref: composedRef,
  });
});

SheetOutlet.displayName = "Sheet.Outlet";
