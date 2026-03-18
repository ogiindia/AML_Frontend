import React from 'react';

const HierarchicalView = ({ data, children }) => {
    const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

    const renderChild = ({ children, scope, name, configKey, ord }) => {
        return (
            <div>
                {React.Children.map(children, (child) => React.cloneElement(child, { scope, name, configKey }))}
            </div>
        )
    }

    const renderData = (data) => {
        if (isObject(data)) {
            return (
                <ul>
                    {Object.entries(data).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key} : </strong> {renderData(value)}
                        </li>
                    ))}
                </ul>
            );
        } else if (Array.isArray(data)) {
            return (
                <ul>
                    {data.map((item, index) => (<li key={index}>{children(item)}</li>))}
                </ul>
            )
        } else {
            return <span>{data}</span>;
        }
    };


    return <div>{renderData(data)}</div>;
}

export default HierarchicalView;