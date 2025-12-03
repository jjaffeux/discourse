// Glossary:
// nr -> SheetTitle

let SheetTitle = forwardRef((props, ref) => {
  let { asChild, travelAnimation, stackingAnimation, ...otherProps } = props;
  let Component = asChild ? Slot : "h2";
  let { titleId } = useContext(sheetContext);
  return createElement(SheetOutlet, {
    asChild: true,
    travelAnimation,
    stackingAnimation,
    children: createElement(Component, { id: titleId, ref, ...otherProps }),
  });
});

SheetTitle.displayName = "Sheet.Title";
