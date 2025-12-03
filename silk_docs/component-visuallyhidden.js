// Glossary:
// tK -> VisuallyHidden (component object)
// tj -> VisuallyHiddenRoot

let VisuallyHiddenRoot = forwardRef((props, ref) => {
  let { asChild, children, className, "data-silk": dataSilk, ...otherProps } = props;
  let Component = asChild ? Slot : "span";
  let propsWithStyling = useStyling("VisuallyHidden", {});
  return createElement(Component, {
    ...propsWithStyling("root", [], { className, dataSilk }),
    ...otherProps,
    ref,
    children,
  });
});

VisuallyHiddenRoot.displayName = "VisuallyHidden.Root";

let VisuallyHidden = { Root: VisuallyHiddenRoot };
