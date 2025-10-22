import { Dimension, Entity, Player, system, world } from "@minecraft/server";

/**
 * 
 * @param {import("@minecraft/server").EntityDamageSource} damageSource 
 * @param {Entity} deadEntity 
 */
export function plrDeadMark(damageSource, deadEntity) {
    if (deadEntity.typeId !== "minecraft:player") return
    const pos = deadEntity.location
    const dimn = deadEntity.dimension
    deadMarker(pos, dimn, deadEntity)
}

/**
 * 
 * @param {import("@minecraft/server").Vector3} posisi 
 * @param {Dimension} dimensi 
 * @param {Player} deadEntity 
 */
function deadMarker(posisi, dimensi, deadEntity) {
    const listMarker = dimensi.getEntities({type: "oden:custom_dummy"})
    const prevMarker = listMarker.filter(n => n.getDynamicProperty("deadMark") === deadEntity.id)
    if (prevMarker.length >= 3) {
        prevMarker.sort((a, b) => (a.getDynamicProperty("timestamp") ?? 0) - (b.getDynamicProperty("timestamp") ?? 0))
        prevMarker[0].remove()
    }

    const deadName = deadEntity.name

    const entity = dimensi.spawnEntity("oden:custom_dummy", posisi)
    entity.nameTag = `§e${deadName}§r baru saja mati...`
    entity.setDynamicProperty("deadMark", deadEntity.id)
    entity.setDynamicProperty("timestamp", system.currentTick)

    const defPos = entity.location

    let tick = 0 //menit
    const updateNameTag = system.runInterval(() => {
        tick++
        if (tick >= 14) {
            entity.remove()
            system.clearRun(updateNameTag)
        } else {
            entity.nameTag = `§e${deadName}§r mati §e${Math.floor(tick/2)} menit§r yang lalu...`
            entity.teleport(defPos)
        }
    }, 20 * 30)
}