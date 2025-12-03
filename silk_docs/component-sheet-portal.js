// Glossary:
// t4 -> SheetPortal

let SheetPortal = (props) => {
  let container = props.container;
  let [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return mounted
    ? ReactDOM.createPortal(
        props.children,
        container ?? document.body
      )
    : null;
};

SheetPortal.displayName = "Sheet.Portal";
