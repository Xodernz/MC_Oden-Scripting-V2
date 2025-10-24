import { Player, world } from "@minecraft/server"

const afkInterval = 20/100 * 120
const afkRadius = 2

const data = new Map()

/**
 * 
 * @param {import("@minecraft/server").Vector3} pos1 
 * @param {import("@minecraft/server").Vector3} pos2 
 * @returns 
 */
function cekRadius(pos1, pos2) {
    return Math.sqrt(
        (pos1.x - pos2.x) ** 2 +
        (pos1.y - pos2.y) ** 2 +
        (pos1.z - pos2.z) ** 2
    )
}

/**
 * 
 * @param {Player} player 
 */
export function afkDetector(player) {
    if (!data.has(player.id)) {
        data.set(player.id, {
            afk: false,
            posisi: player.location,
            tick: 0
        })
    } else {
        /**@type {{afk, posisi, tick}} */
        const getData = data.get(player.id)
        const rad = cekRadius(player.location, getData.posisi)

        if (rad < afkRadius) {
            getData.tick++
            if (getData.tick > afkInterval && !getData.afk) {
                getData.afk = true
                world.sendMessage(`${player.name} sedang AFK!`)
            }
        } else {
            if (getData.afk) {
                world.sendMessage(`${player.name} Bangun dari afk!`)
            }
            getData.afk = false
            getData.posisi = player.location
            getData.tick = 0
        }
    }
}