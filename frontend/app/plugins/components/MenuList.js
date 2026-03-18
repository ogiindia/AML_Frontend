import React from 'react';

function MenuList({ entityName, tid, id, callback, ...props }) {

    const onClickClassBack = (id) => {
        if (callback) callback(id);
    }

    return (<>
        <p className={`${props['menus.howInMenu'] && 'text-info'} `}>
            {entityName} | {tid} <button type="button" onClick={() => onClickClassBack(id)} className={`btn btn-primary btn-sm`}>{props['menu.path']} <span className={`badge`}>{props['menu.MenuOrder']}</span></button>
        </p>
    </>);
}

export default MenuList;