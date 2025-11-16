import { system, world } from "@minecraft/server";
import { isCustomCommand } from "./command_handler";
import { chatRank } from "./chat_rank";
import { assignRanktoPlayer } from "./rank_assign";
import { afkDetector } from "./afk_detector";
import { TPScounter } from "./Custom Command/TPS";
import { killPoint } from "./kill_point";
import { notifDeadVillager } from "./notify_dead_vil";
import { plrDeadMark } from "./player_dead_marker";
import { clearDummy } from "./reset_dummy";
import { messageGet, messagePost, plyrJoinAnnounce, plyrLeaveAnnounce, setServerID } from "./discord_relay";

//Chat send Before Event
world.beforeEvents.chatSend.subscribe(async (evnt) => {
    evnt.cancel = true
    const {message, sender} = evnt
    if (await isCustomCommand(message, sender)) return
    const rankCht = chatRank(message, sender)
    await messagePost(sender, message, rankCht?.replace(/§[A-Za-z0-9]/gi, ""))
})


// Entity Die After Event
world.afterEvents.entityDie.subscribe((ev) => {
    const {damageSource, deadEntity} = ev
    killPoint(damageSource, deadEntity)
    notifDeadVillager(damageSource, deadEntity)
    plrDeadMark(damageSource, deadEntity)
})

// Player Join
world.afterEvents.playerJoin.subscribe((ev) => {
    const {playerName} = ev
    plyrJoinAnnounce(playerName)
})

// Player Leave
world.afterEvents.playerLeave.subscribe((ev) => {
    const {playerName} = ev
    plyrLeaveAnnounce(playerName)
})

// on RELOAD
world.afterEvents.worldLoad.subscribe(() => {
    clearDummy()
    setServerID()
})

//Loop /100
system.runInterval(async () => {
    world.getAllPlayers().forEach(n => {
        assignRanktoPlayer(n)
        afkDetector(n)
    })
    messageGet()
}, 100)

//Loop per tick (20 TPS)
system.runInterval(() => {
    TPScounter()
})
//biji