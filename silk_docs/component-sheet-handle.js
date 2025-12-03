// Glossary:
// t5 -> SheetHandle

let SheetHandle = forwardRef((props, ref) => {
  let { children, className, action = "step", ...otherProps } = props;
  let { detents } = useContext(sheetContext) || {};
  let isDisabled = detents.length === 1 && action !== "dismiss";
  let propsWithStyling = useStyling("Sheet", {});
  return createElement(SheetTrigger, {
    ...propsWithStyling("handle", [], { className }),
    action,
    disabled: isDisabled,
    ...otherProps,
    ref,
    children: createElement(VisuallyHidden.Root, {
      children: children ?? (action === "dismiss" ? "Dismiss" : "Cycle"),
    }),
  });
});

SheetHandle.displayName = "Sheet.Handle";
