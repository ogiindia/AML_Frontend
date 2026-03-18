import React from 'react';

function ConfigList({ name, configKey, scope, ord, id, callback }) {

    const onClickClassBack = (id) => {
        if (callback) callback(id);
    }

    return (<>
        <p>
            {name} | {configKey} <button type="button" onClick={() => onClickClassBack(id)} className={`btn btn-primary btn-sm`}>{scope} <span className={`badge`}>{ord}</span></button>
        </p>
    </>);
}

export default ConfigList;