import { Player, system } from "@minecraft/server";
import { commandHandler } from "../command_handler";


let lastTime = Date.now()
let tick = 0
export let currentTPS = 20

/**
 * 
 * @param {string} message 
 * @param {Player} sender 
 * @returns 
 */
export function cekTPS(message, sender) {
    const cmd = commandHandler(message)
    if (cmd?.command !== `tps`) return
    let color = `§a`
    if (currentTPS > 18) {
        color = "§a"
    } else if (currentTPS > 12) {
        color = "§e"
    } else {
        color = `§c`
    }
    const tpsPercent = currentTPS/20 * 100
    sender.sendMessage(`TPS Server: ${color}${currentTPS}§r | §7${tpsPercent} %%`)
    return true
}

export function TPScounter() {
    tick++

    if (Date.now() - lastTime >= 1000) {
        currentTPS = tick
        lastTime = Date.now()
        tick = 0
    }
}