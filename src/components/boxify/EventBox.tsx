import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import { useNotifications } from '../../hooks/useNotifications';
import { useGame } from '../../hooks/useGame';

function EventBox() {

    const { game } = useGame();
    const { showNotification } = useNotifications();
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    /*
    todos: change the events inside the GameProvider. 
    init the listener inside then. , 
    have eventbox pass events to teh event table... 
    also have Gamebox update teh tokens for each user

    */

    return (<>
        hi lover
    </>)
}

export default EventBox;