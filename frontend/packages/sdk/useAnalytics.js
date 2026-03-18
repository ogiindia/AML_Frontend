import { useEffect } from 'react';

const useAnalytics = (userId, page = {}) => {


    // const [isBot, setisBot] = useState(false);

    // const [cords, setcords] = useState({});
















    const simualteMouseMove = (x, y) => {
        const evt = new MouseEvent('mousemove', {
            clientX: x,
            clientY: y,
            bubbles: true,
        });
        document.dispatchEvent(evt);
    }


    useEffect(() => {
        // // Device + location
        // sendToBackend('device-info', {

        // });

        // navigator.geolocation.getCurrentPosition(
        //     pos => {
        //         cords.current = pos.coords
        //         //                setcords(pos.coords)
        //     },
        //     // () => sendToBackend('location-denied', {})
        // );



        return () => {
            window.removeEventListener('keypress', onKeyPress);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('visibilitychange', onTabSwitch);
            clearInterval(idleChecker);
        };
    }, [userId]);





};

export default useAnalytics;
