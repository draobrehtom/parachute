function playAnim(ply, dict, anim, animFlag) {
    if (arguments.length == 2) {
        if (mp.game.streaming.hasAnimDictLoaded(dict)) {    
            ply.taskPlayAnim(dict, anim, 8, 1, -1, animFlag, 0, false, false, false);
        } else {
            loadAnimDict(dict).then(() => {
                ply.taskPlayAnim(dict, anim, 8, 1, -1, animFlag, 0, false, false, false);
            });
        }
    } else if (arguments.length == 3) {
        if (mp.game.streaming.hasAnimDictLoaded(dict)) {
            ply.taskPlayAnim(dict, anim, 8, 1, -1, animFlag, 0, false, false, false);
        } else {
            loadAnimDict(dict).then(() => {
                ply.taskPlayAnim(dict, anim, 8, 1, -1, animFlag, 0, false, false, false);
            });
        }
    }
}
function loadAnimDict(dict) {
    mp.game.streaming.requestAnimDict(dict);
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            if(mp.game.streaming.hasAnimDictLoaded(dict)) {
                clearInterval(timer);
                resolve();
            }
        }, 100);
    });
}
function createEntity(entity, pos) {
    let model = isNaN(entity)? mp.game.joaat(entity) : parseInt(entity)
    let obj = mp.objects.new(model, pos, {
      rotation: new mp.Vector3(0,0,0),
      dimension: 0
    })
    obj.name = entity
    return obj
}

/** 
 * Attach parachute object to player 
 * and delete it when player is very close to the ground  
 */
let giveParachuteObject = (player) => {
    let parachuteObject = createEntity('p_parachute1_mp_s', mp.players.local.position);
    parachuteObject.attachTo(player.handle, 57717, 0, 0, 3, 0, 0, 0, true, true, true, false, 0, true);
    let groundChecker = setInterval(() => {
        let z = mp.game.gameplay.getGroundZFor3dCoord(player.position.x, player.position.y, player.position.z, 0.0, false);
        if (player.position.z - z <= 30) {
            parachuteObject.destroy();
            clearInterval(groundChecker);
        }
    }, 3000);
}

/**
 *  Send parachute state to server
 */
mp.events.add('render', () => {
    let parachuteState = mp.players.local.getParachuteState();
    if (parachuteState >= 0 && parachuteState <= 2) {
        mp.events.callRemote('onPlayerParachute', parachuteState)
    };
});


/**
 * Fix parachute falling animation
 */
mp.events.add('fixFallingFor', (ply) => {
    mp.players.forEachInStreamRange((player, id) => {
        if (player === ply && player !== mp.players.local) {
            player.taskParachute(true);
        }
    });
});

/**
 * Fix parachute object
 */
mp.events.add('fixParachuteFor', (ply) => {
    mp.players.forEachInStreamRange((player, id) => {
        if (player === ply && player !== mp.players.local) {
            giveParachuteObject(ply);
        }
    });
});