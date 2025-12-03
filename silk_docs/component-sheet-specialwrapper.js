// Glossary:
// nn -> SheetSpecialWrapperRoot
// na -> SheetSpecialWrapperContent

let SheetSpecialWrapperRoot = forwardRef((props, ref) => {
  let { className, "data-silk": dataSilk, ...otherProps } = props;
  let { travelAxis } = useContext(sheetContext) || {};
  let crossAxis = useMemo(() => ("vertical" === travelAxis ? "horizontal" : "vertical"), [travelAxis]);
  let [isWebkit, setIsWebkit] = useState(false);
  useEffect(() => setIsWebkit(isWebkitBrowser()), []);
  let propsWithStyling = useStyling("SpecialWrapper");
  return createElement(Scroll.Root, {
    ...propsWithStyling("root", [], { className, dataSilk }),
    active: isWebkit,
    axis: crossAxis,
    ...otherProps,
    ref,
  });
});

SheetSpecialWrapperRoot.displayName = "Sheet.SpecialWrapper.Root";

let SheetSpecialWrapperContent = forwardRef((props, ref) => {
  return createElement(Scroll.Stabiliser, { ...props, ref });
});

SheetSpecialWrapperContent.displayName = "Sheet.SpecialWrapper.Content";
