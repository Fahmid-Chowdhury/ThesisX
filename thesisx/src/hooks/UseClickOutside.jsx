import { useEffect, useRef } from 'react';

export default function UserClickOutside (callbackfn) {
    let domNodeRef = useRef();

    useEffect(() => {
        let handler = (event) => {
            if (!domNodeRef.current?.contains(event.target)) {
                callbackfn()
            }
        }
        
        document.addEventListener("mousedown", handler)

        return () => {
            document.addEventListener("mousedown", handler)
        }
    }, [])

    return domNodeRef

}