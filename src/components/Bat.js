import {useEffect} from "react";
import {Sprite} from '@pixi/react';
import bat from '../assets/images/bat.png';

export default function Bat( {
    stageWidth, 
    stageHeight, 
    doMove, 
    setDoMove, 
    motionDirection, 
    batX, 
    setBatX, 
    batY, 
    setBatY} ) {

    const doBat = useEffect( () => {
        if (doMove) {

        }
    }, []);

}