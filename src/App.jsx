import { useState, useEffect } from "react";
import "./styles.css";
import RGL, { WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";

const ReactGridLayout = WidthProvider(RGL);

export default function App(props) {
  const { itemKey = "" } = props;
  const [count, setCount] = useState(0);
  const [layout, setLayout] = useState(props.layout || []);

  function generateDOM() {
    return layout.map(function (item) {
      return (
        <div key={item.i}>
          {item.i.startsWith("grid-") && (
            <App
              layout={item.layout}
              nested
              itemKey={item.i}
              onNestedLayoutChange={onNestedLayoutChange}
            />
          )}
          {!item.i.startsWith("grid-") && (
            <span className="text">{item.i}</span>
          )}
        </div>
      );
    });
  }

  function onLayoutChange(newLayout) {
    setLayout(newLayout);
    if (props.onNestedLayoutChange) {
      props.onNestedLayoutChange(newLayout, props.itemKey);
    }
  }

  function onNestedLayoutChange(nestedLayout, itemKey) {
    const itemIndex = layout.findIndex((item) => item.i === itemKey);
    if (itemIndex !== -1) {
      setLayout([
        ...layout.slice(0, itemIndex),
        {
          ...layout[itemIndex],
          layout: nestedLayout,
        },
        ...layout.slice(itemIndex + 1),
      ]);
    }
  }

  function addItem() {
    setCount(count + 1);
    setLayout([
      ...layout,
      {
        i: `${count}${itemKey ? `|${itemKey}` : ""}`,
        x: (layout.length * 2) % 12,
        y: Infinity,
        w: 2,
        h: 2,
      },
    ]);
  }

  function addGridItem() {
    setCount(count + 1);
    setLayout([
      ...layout,
      {
        i: `grid-${count}${itemKey ? `|${itemKey}` : ""}`,
        x: (layout.length * 2) % 12,
        y: Infinity,
        w: 5,
        h: 5,
        layout: [],
      },
    ]);
  }

  useEffect(() => {
    console.log(JSON.stringify(layout, null, 2));
  }, [layout]);

  return (
    <>
      {!itemKey && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <button onClick={addItem}>Add Item</button>
          <button onClick={addGridItem}>Add Grid Item</button>
          <button
            onClick={() => {
              setLayout([]);
            }}
          >
            Remove All
          </button>
        </div>
      )}
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layout={layout}
        onLayoutChange={onLayoutChange}
        className="layout"
        rowHeight={30}
        cols={16}
        autoSize
      >
        {generateDOM()}
      </ReactGridLayout>
    </>
  );
}
