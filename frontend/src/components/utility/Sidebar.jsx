import { useState, useEffect, useRef, useCallback } from 'react';


export default function SideBar({ children, ...props }) {
    const MIN_SIDEBAR_WIDTH = 200;
    const MAX_SIDEBAR_WIDTH = 1000;
    const DEFAULT_SIDEBAR_WIDTH = 300;

    const sidebarRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, sidebarWidthSetter] = useState(() => {
        const savedWidth = localStorage.getItem('calendar_sidebar_width');
        if (savedWidth)
            return parseInt(savedWidth);
        return DEFAULT_SIDEBAR_WIDTH;
    });
    const setSidebarWidth = useCallback((value) => {
        sidebarWidthSetter(() => {
            localStorage.setItem('calendar_sidebar_width', value);
            return value;
        });
    }, [sidebarWidthSetter]);

    const resize = useCallback((event) => {
        if (isResizing) {
            const newWidth = sidebarRef.current.getBoundingClientRect().right - event.clientX;
            if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
                setSidebarWidth(newWidth);
            }
        }
    }, [isResizing]);

    const startResizing = useCallback((event) => {
        event.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        }
    }, [resize, stopResizing]);

    return (
        <div
            ref={sidebarRef}
            className='d-flex flex-row'
            style={{width: sidebarWidth}}
        >
            <div
                style={{width: 4, cursor: 'ew-resize', backgroundColor: '#eee'}}
                onMouseDown={startResizing}
            ></div>
            <div className='flex-grow-1 d-flex flex-column' style={{overflowY: 'hidden'}}>
                {children}
            </div>
        </div>
    );
}