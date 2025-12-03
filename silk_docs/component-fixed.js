// Glossary:
// tT -> Fixed (component object)
// tb -> FixedRoot
// tk -> FixedContent
// ty -> ScrollTrap (stabiliser component)

let FixedRoot = forwardRef((props, ref) => {
  let { asChild, children, className, "data-silk": dataSilk, ...otherProps } = props;
  let scrollContext = useScrollContext();
  let composedRef = useComposedRefs(scrollContext, ref);
  let propsWithStyling = useStyling("Fixed", {});
  return createElement(Scroll.Root, {
    ...propsWithStyling("root", [], { className, dataSilk: [dataSilk, "0al"] }),
    asChild,
    ...otherProps,
    ref: composedRef,
    children,
  });
});

FixedRoot.displayName = "Fixed.Root";

let FixedContent = forwardRef((props, ref) => {
  let { asChild, children, ...otherProps } = props;
  return createElement(Scroll.Stabiliser, { asChild, ...otherProps, ref, children });
});

FixedContent.displayName = "Fixed.Content";

let Fixed = {
  Root: FixedRoot,
  Content: FixedContent,
};
