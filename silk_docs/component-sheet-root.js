// Glossary:
// t7 -> SheetRoot

let SheetRoot = forwardRef((props, ref) => {
  let {
    className,
    "data-silk": dataSilk,
    license,
    sheetRole,
    componentId,
    forComponent,
    defaultPresented,
    presented,
    onPresentedChange,
    defaultActiveDetent,
    activeDetent,
    onActiveDetentChange,
    onSafeToUnmountChange,
    ...otherProps
  } = props;

  let rootRef = useRef(null);
  let composedRef = useComposedRefs(rootRef, ref);

  let isDefaultPresented = defaultPresented ?? false;
  let [isPresented, setIsPresented] = useState(isDefaultPresented);
  let hasExternalControl = presented !== undefined && onPresentedChange !== undefined;
  let presentedValue = hasExternalControl ? presented : isPresented;
  let onPresentedChangeHandler = hasExternalControl ? onPresentedChange : setIsPresented;

  let rootElementRef = useRef(null);
  let [safeToUnmount, setSafeToUnmount] = useState(!isDefaultPresented);

  let onSafeToUnmountChangeHandler = useCallback((safe) => {
    setSafeToUnmount(safe);
    onSafeToUnmountChange?.(safe);
  }, [onSafeToUnmountChange]);

  let [presentedState, setPresentedState] = useState(presentedValue);
  let [staging, setStaging] = useState("none");

  let stackContext = forComponent === "closest" ? sheetStackContext : forComponent;
  let sheetId = useId();

  let contextValue = {
    license,
    StackContext: stackContext,
    CustomSheetContext: componentId,
    sheetId,
    sheetRole,
    open: presentedValue,
    onOpenChange: onPresentedChangeHandler,
    onSafeToUnmountChange: onSafeToUnmountChangeHandler,
    defaultActiveDetent,
    activeDetent,
    onActiveDetentChange,
    safeToUnmount,
    longRunning: presentedState,
    setLongRunning: setPresentedState,
    staging,
    setStaging,
    elementFocusedLastBeforeShowing: rootElementRef,
    ...otherProps,
  };

  let propsWithStyling = useStyling("Sheet");

  return createElement(SheetStackErrorBoundary, {
    children: [
      createElement(SheetRootValidator, { rootRef }),
      createElement(CustomisableContext, {
        genericContext: sheetGenericContext,
        customContext: componentId,
        value: contextValue,
        children: createElement(SheetOutlet, {
          ...propsWithStyling("root", [], { className, dataSilk }),
          ref: composedRef,
          ...otherProps,
        }),
      }),
    ],
  });
});

SheetRoot.displayName = "Sheet.Root";

// Note: The full SheetRoot implementation includes complex state machines,
// animation handling, accessibility features, and cross-platform compatibility.
// This is a simplified version showing the main structure. The complete
// implementation spans hundreds of lines with intricate logic for:
// - State management and transitions
// - Animation coordination
// - Focus management
// - Accessibility (ARIA attributes, screen reader support)
// - Cross-platform behavior (iOS, Android, desktop)
// - Gesture handling and touch interactions
// - Theme integration
// - Portal management
