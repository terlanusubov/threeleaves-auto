import React from 'react';
import {useSelector} from "react-redux";

function FloatingPanel({left, children}) {
    const contentScroll = useSelector(({publicState}) => publicState.contentScroll);
    const defaultTop = 215
    const defaultHeight = 'calc( 100% - 214px )'

    return (
        <div style={{top: contentScroll > 0 ? (defaultTop - contentScroll > 20 ? `auto` : '20px') : 'auto', maxHeight : contentScroll > 0 && (defaultTop - contentScroll < 20) ? '100%' : defaultHeight}}
             className={`floating-panel floating-panel--scrollable ${left ? 'floating-panel--left' : ''} pb-30`}>
            {children}
        </div>
    );
}

export default FloatingPanel;