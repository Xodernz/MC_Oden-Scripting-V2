import { Entity, world } from "@minecraft/server";

/**
 * 
 * @param {import("@minecraft/server").EntityDamageSource} damageSource 
 * @param {Entity} deadEntity 
 */
export function notifDeadVillager (damageSource, deadEntity) {
    const listEntity = ["minecraft:villager", "minecraft:villager_v2"]
    if (!listEntity.includes(deadEntity.typeId)) return
    const cause = damageSource.cause
    const damager = damageSource.damagingEntity

    let killer;
    if (damager) {
        if (damager.typeId === "minecraft:player") {
            killer = damager.name
        } else {
            killer = damager.typeId
                .replace("minecraft:", "")
                .split("_")
                .map(n => n.charAt(0).toUpperCase() + n.slice(1))
                .join(" ")
        }
    }
    
    const vilDimens = deadEntity.dimension.id
        .replace("minecraft:", "")
        .split("_")
        .map(n => n.charAt(0).toUpperCase() + n.slice(1))
        .join(" ")

    const { x, y, z } = deadEntity.location
    const loc = `(${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)})`
    world.sendMessage(`§cVillager dead by §e${killer ? killer : cause}§c in §e${vilDimens}§c at §e${loc}`)
}