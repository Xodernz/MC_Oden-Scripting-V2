import { Player, world } from "@minecraft/server";

/**
 * 
 * @param {Player} player 
 * @param {string} objective 
 */
function getPointScoreboard(player, objectiveID) {
    try {
        const getObj = world.scoreboard.getObjective(objectiveID)
        return getObj?.getScore(player)
    } catch (e) {
        return undefined
    }
}
/**
 * 
 * @param {Player} player 
 */
export function assignRanktoPlayer(player) {
    const playerScore = getPointScoreboard(player, "pk_display")
    if (playerScore === undefined) return
    
    const rank_1 = "§eR1" // 0 - 100
    const rank_2 = "§eR2" // 100 - 300
    const rank_3 = "§eR3" // 300 - 700
    const rank_4 = "§eR4" // 700 - 1300
    const rank_5 = "§eR5" // 1.300 - 2.200
    //         [ light, dark ]
    const rank_6 = ["§eR6 L", "§eR6 D"] // 2.200 - 3.600
    const rank_7 = ["§eR7 L", "§eR7 D"] // 3.600 - 5.600
    const rank_8 = ["§eR8 L", "§eR8 D"] // 5.600 - 7.900
    const rank_9 = ["§eR9 L", "§eR9 D"] // 7.900 - 10.000
    const rank_10 = ["§eR10 L", "§eR10 D"] // 10.000+

    let newRank;
    const rankNow = player.getDynamicProperty("rankNow")
    const pathNow = player.getDynamicProperty("pathNow")

    if (playerScore < 2200 && pathNow) {
        player.setDynamicProperty("pathNow", undefined)
    }

    if (playerScore < 100) newRank = rank_1;
    else if (playerScore >= 100 && playerScore < 300) newRank = rank_2;
    else if (playerScore >= 300 && playerScore < 700) newRank = rank_3;
    else if (playerScore >= 700 && playerScore < 1300) newRank = rank_4;
    else if (playerScore >= 1300 && playerScore < 2200) newRank = rank_5;

    if (playerScore >= 2200 && !pathNow) {
        const newPath = Math.random() > 0.5 ? "dark" : "light"
        player.setDynamicProperty("pathNow", newPath)
        if (newPath === "light") {
            world.sendMessage(`\n§eSoul of Light awakens with brilliance to guard the future!\n§rTakdir §6${player.name}§r kini menyala bersama §6cahaya abadi!\n§r`)
        } else if (newPath === "dark") {
            world.sendMessage(`\n§dSoul of Night whispers eternity into the void!\n§rTakdir §u${player.name}§r kini terikat pada §umalam yang tak berujung!\n§r`)
        }
    }

    if (pathNow === "light") {
        if (playerScore >= 2200 && playerScore < 3600) newRank = rank_6[0]
        else if (playerScore >= 3600 && playerScore < 5600) newRank = rank_7[0]
        else if (playerScore >= 5600 && playerScore < 7900) newRank = rank_8[0]
        else if (playerScore >= 7900 && playerScore < 10000) newRank = rank_9[0]
        else if (playerScore >= 10000) newRank = rank_10[0]
    } else if (pathNow === "dark") {
        if (playerScore >= 2200 && playerScore < 3600) newRank = rank_6[1]
        else if (playerScore >= 3600 && playerScore < 5600) newRank = rank_7[1]
        else if (playerScore >= 5600 && playerScore < 7900) newRank = rank_8[1]
        else if (playerScore >= 7900 && playerScore < 10000) newRank = rank_9[1]
        else if (playerScore >= 10000) newRank = rank_10[1]
    }

    if (newRank && rankNow !== newRank) {
        player.getTags().forEach(n => {
            if (n.startsWith("rank:")) {
                player.removeTag(n)
            }
        })
        player.setDynamicProperty("rankNow", newRank)
        player.addTag(`rank:${newRank}`)
    }
}