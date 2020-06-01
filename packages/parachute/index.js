mp.events.add('onPlayerParachute', (player, state) => {
    // Falling with parachute
    if (state === 0) {
        mp.players.call('fixFallingFor', [player])
    }
    
    // Opening parachute
    if (state === 1) { 
        mp.players.call('fixParachuteFor', [player]);
    }
});