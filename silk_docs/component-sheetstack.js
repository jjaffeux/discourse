// Glossary:
// nc -> SheetStack (component object)
// ns -> SheetStackRoot
// no -> SheetStackItem (Outlet)

let SheetStackErrorBoundary = class extends Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
};

SheetStackErrorBoundary.displayName = "SheetStack.ErrorBoundary";

let SheetStackRoot = forwardRef((props, ref) => {
  let { componentId, className, "data-silk": dataSilk, asChild, ...otherProps } = props;
  let stackId = useId();
  useEffect(() => {
    globalSheetManager.addSheetStack({ id: stackId });
    return () => globalSheetManager.removeSheetStack(stackId);
  }, [stackId]);
  let [sheetsInStack, setSheetsInStack] = useState([]);
  let updateSheetDataInStack = useCallback((sheetData) => {
    setSheetsInStack(prev => {
      let existingIndex = prev.findIndex(sheet => sheet.sheetId === sheetData.sheetId);
      if (existingIndex !== -1) {
        let updated = [...prev];
        updated[existingIndex] = sheetData;
        return updated;
      } else {
        return [...prev, sheetData];
      }
    });
  }, []);
  let removeSheetDataFromStack = useCallback((sheetId) => {
    setSheetsInStack(prev => prev.filter(sheet => sheet.sheetId !== sheetId));
  }, []);
  let getPreviousSheetDataInStack = useCallback((sheetId) => {
    let sheetIndex = sheetsInStack.findIndex(sheet => sheet.sheetId === sheetId);
    return sheetIndex === -1 ? sheetsInStack[sheetsInStack.length - 1] : sheetsInStack[sheetIndex - 1];
  }, [sheetsInStack]);
  let [sheetsCount, setSheetsCount] = useState(0);
  useEffect(() => {
    if (sheetsCount === 0) {
      globalSheetManager.removeAllOutletPersistedStylesFromStack(stackId);
    }
  }, [sheetsCount, stackId]);
  let [sheetsStagingData, setSheetsStagingData] = useState([]);
  let updateSheetStagingDataInStack = useCallback((stagingData) => {
    setSheetsStagingData(prev => {
      let existingIndex = prev.findIndex(sheet => sheet.sheetId === stagingData.sheetId);
      if (existingIndex !== -1) {
        let updated = [...prev];
        updated[existingIndex] = stagingData;
        return updated;
      } else {
        return [...prev, stagingData];
      }
    });
  }, []);
  let removeSheetStagingDataInStack = useCallback((sheetId) => {
    setSheetsStagingData(prev => prev.filter(sheet => sheet.sheetId !== sheetId));
  }, []);
  let sheetsInStackMergedStaging = useMemo(() => (
    sheetsStagingData.some(sheet => sheet.staging !== "none") ? "not-none" : "none"
  ), [sheetsStagingData]);
  let contextValue = useMemo(() => ({
    stackId,
    sheetsCount,
    setSheetsCount,
    updateSheetStagingDataInStack,
    removeSheetStagingDataInStack,
    sheetsInStackMergedStaging,
    updateSheetDataInStack,
    removeSheetDataFromStack,
    getPreviousSheetDataInStack,
  }), [stackId, sheetsCount, updateSheetStagingDataInStack, removeSheetStagingDataInStack, sheetsInStackMergedStaging, updateSheetDataInStack, removeSheetDataFromStack, getPreviousSheetDataInStack]);
  let Component = asChild ? Slot : "div";
  let propsWithStyling = useStyling("SheetStack");
  return createElement(SheetStackErrorBoundary, {
    children: createElement(ComponentIdContext.Provider, {
      value: componentId,
      children: createElement(SheetStackContext.Provider, {
        value: contextValue,
        children: createElement(Component, {
          ...propsWithStyling("root", [], { className, dataSilk }),
          ref,
          ...otherProps,
        }),
      }),
    }),
  });
});

SheetStackRoot.displayName = "SheetStack.Root";

let SheetStackItem = forwardRef((props, ref) => {
  let { forComponent, asChild, className, "data-silk": dataSilk, ...otherProps } = props;
  let Component = asChild ? Slot : "div";
  let propsWithStyling = useStyling("SheetStack", ["item"], { className, dataSilk });
  return createElement(Component, {
    ...propsWithStyling,
    ref,
    ...otherProps,
  });
});

SheetStackItem.displayName = "SheetStack.Item";

let SheetStack = {
  Root: SheetStackRoot,
  Item: SheetStackItem,
};
