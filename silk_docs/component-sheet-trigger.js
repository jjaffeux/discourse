// Glossary:
// t3 -> SheetTrigger

let SheetTrigger = forwardRef((props, ref) => {
  let { asChild, forComponent, className, "data-silk": dataSilk, onPress, onClick, children, action = "present", travelAnimation, stackingAnimation, ...otherProps } = props;
  let Component = asChild ? Slot : "button";
  let { sheetRole, sheetId, open, onOpenChange, elementFocusedLastBeforeShowing } = useSheetContext(forComponent);
  let sheet = globalSheetManager.findSheet(sheetId);
  let triggerRef = useRef(null);
  let composedRef = useComposedRefs(triggerRef, ref);

  let role = useMemo(() => (
    (sheetRole === "dialog" || sheetRole === "alertdialog") && action === "present" ? "dialog" : undefined
  ), [action, sheetRole]);

  let ariaExpanded = useMemo(() => (
    action === "present" || action === "dismiss" ? open : undefined
  ), [action, open]);

  let propsWithStyling = useStyling("Sheet", {});

  return createElement(SheetOutlet, {
    forComponent,
    asChild: true,
    travelAnimation,
    stackingAnimation,
    children: createElement(Component, {
      ...propsWithStyling("trigger", [], { className, dataSilk }),
      role,
      "aria-expanded": ariaExpanded,
      onClick: (event) => {
        let { forceFocus, runAction } = handleEventBehavior({
          nativeEvent: event,
          defaultBehavior: { forceFocus: true, runAction: true },
          handler: onPress,
        });
        if (forceFocus && triggerRef.current) {
          triggerRef.current.focus({ preventScroll: true });
        }
        if (runAction) {
          if (action === "present") {
            elementFocusedLastBeforeShowing.current = triggerRef.current;
            onOpenChange(true);
          } else if (action === "dismiss") {
            onOpenChange(false);
          } else if (action === "step") {
            sheet?.sendToOpennessMachine({
              type: "STEP",
              direction: action === "step" ? "up" : action.direction,
            });
          }
        }
        onClick?.(event);
      },
      ref: composedRef,
      ...otherProps,
      children,
    }),
  });
});

SheetTrigger.displayName = "Sheet.Trigger";
