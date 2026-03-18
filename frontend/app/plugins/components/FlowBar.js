import React from 'react';
import CollapsibleText from 'CollapsibleText';

export default ({ draggableNodes }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const CollapsibleNode = ({ title, items }) => {
    return (
      <>
        <CollapsibleText title={title}>
          {items.length > 0 &&
            items.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`dndnode output ${
                    item.className ? item.className : ''
                  }`}
                  onDragStart={(event) => onDragStart(event, item.label)}
                  draggable
                >
                  {item.label}
                </div>
              );
            })}
        </CollapsibleText>
      </>
    );
  };

  return (
    <>
      <CollapsibleText title={'Common Nodes'}>
        <div
          className="dndnode input"
          onDragStart={(event) => onDragStart(event, 'input')}
          draggable
        >
          Input Node
        </div>
        <div
          className="dndnode output"
          onDragStart={(event) => onDragStart(event, 'output')}
          draggable
        >
          Output Node
        </div>
      </CollapsibleText>

      {draggableNodes &&
        Object.keys(draggableNodes).length > 0 &&
        Object.keys(draggableNodes).map((obj, index) => {
          const dt = draggableNodes[obj];

          return (
            <>
              <CollapsibleNode key={index} title={obj} items={dt} />
            </>
          );
        })}
    </>
  );
};
