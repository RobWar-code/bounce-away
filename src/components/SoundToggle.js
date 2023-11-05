import {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import dingSound from '../assets/sounds/ding.mp3';

export default function SoundToggle() {
    const [soundEnabled, setSoundEnabled] = useState(
        JSON.parse(localStorage.getItem('soundEnabled')) || false
    )

    useEffect( () => {
        localStorage.setItem('soundEnabled', soundEnabled);
    }, [soundEnabled])

    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);
        if (soundEnabled) {
            playSound();
        }
    }

    const playSound = () => {
        const ding = new Audio(dingSound);
        ding.play();
    }

    return (
        <Button variant="success" onClick={toggleSound}>{soundEnabled ? 'Disable Sound' : 'Enable Sound'}</Button>
    )
}