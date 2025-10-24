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
import { messageGet, messagePost } from "./discord_relay";

//Chat send Before Event
world.beforeEvents.chatSend.subscribe((evnt) => {
    const {message, sender} = evnt
    if (isCustomCommand(message, sender)) {
        evnt.cancel = true
        return
    }
    const rankCht = chatRank(message, sender)
    messagePost(sender, message, rankCht?.replace(/§[A-Za-z0-9]/gi, ""))
    if (rankCht !== undefined) {
        evnt.cancel = true
    }
})


// Entity Die After Event
world.afterEvents.entityDie.subscribe((ev) => {
    const {damageSource, deadEntity} = ev
    killPoint(damageSource, deadEntity)
    notifDeadVillager(damageSource, deadEntity)
    plrDeadMark(damageSource, deadEntity)
})

// on RELOAD / WORLD LOAD
world.afterEvents.worldLoad.subscribe(() => {
    clearDummy()
})

//Loop /100
system.runInterval(() => {
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