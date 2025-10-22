import { Player, world } from "@minecraft/server";

/**
 * 
 * @param {string} message 
 * @param {Player} sender 
 */
export function chatRank(message, sender) {
    const senderRank = sender.getTags().find(n => n.startsWith("rank:"))?.slice(5)
    if (senderRank) {
        world.sendMessage(`${senderRank}§r | <${sender.name}> ${message}`)
        return senderRank
    } else return undefined
}