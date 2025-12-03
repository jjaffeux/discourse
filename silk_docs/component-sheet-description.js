// Glossary:
// nl -> SheetDescription

let SheetDescription = forwardRef((props, ref) => {
  let { asChild, travelAnimation, stackingAnimation, ...otherProps } = props;
  let { descriptionId } = useContext(sheetContext);
  let Component = asChild ? Slot : "p";
  return createElement(SheetOutlet, {
    asChild: true,
    travelAnimation,
    stackingAnimation,
    children: createElement(Component, { id: descriptionId, ref, ...otherProps }),
  });
});

SheetDescription.displayName = "Sheet.Description";
