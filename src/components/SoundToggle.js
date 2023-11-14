import {useEffect} from 'react';
import {Button} from 'react-bootstrap';
import dingSound from '../assets/sounds/ding.mp3';

export default function SoundToggle({soundEnabled, setSoundEnabled}) {
    useEffect( () => {
        localStorage.setItem('soundEnabled', soundEnabled);
    }, [soundEnabled])

    const toggleSound = () => {
        let newSound = !soundEnabled;
        setSoundEnabled(newSound);
        if (newSound) {
            playSound();
        }
    }

    const playSound = () => {
        const ding = new Audio(dingSound);
        ding.play();
    }

    return (
        <Button variant="success" className="tool-button" onClick={toggleSound}>{soundEnabled ? 'Disable Sound' : 'Enable Sound'}</Button>
    )
}