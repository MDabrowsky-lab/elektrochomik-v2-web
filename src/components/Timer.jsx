import React, { useEffect, useState } from 'react';

function Timer(props) {
    const [seconds, setSeconds] = useState(props.seconds);

    useEffect(() => {
        if(!props.stop) {
          const intervalId = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(intervalId);
        }
    }, [props.seconds]);

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const remainingSeconds = timeInSeconds % 60;

        const formatNumber = (number) => (number < 10 ? `0${number}` : number);

        return `${formatNumber(hours)}h ${formatNumber(minutes)}m ${formatNumber(remainingSeconds)}s`;
    };

    return (
        <div className='timer-container'>
            <p style={{fontSize: '20px', color: props.color ? "#2097bb" : "black", fontWeight: 500}}>{formatTime(seconds)}</p>
        </div>
    );
}

export default Timer;
