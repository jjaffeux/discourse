// Glossary:
// t9 -> SheetView

let SheetView = forwardRef((props, ref) => {
  let { forComponent } = props;
  let { open, safeToUnmount } = useSheetContext(forComponent);
  return (open || !safeToUnmount) && createElement(Scroll.Root, { ...props, ref });
});

SheetView.displayName = "Sheet.View";
