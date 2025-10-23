import { Dimension, Entity, EquipmentSlot, Player, system, world } from "@minecraft/server";

const pointEachEntity = {
    "minecraft:agent": 0,
    "minecraft:allay": 0,
    "minecraft:area_effect_cloud": 0,
    "minecraft:armadillo": 0,
    "minecraft:armor_stand": 0,
    "minecraft:arrow": 0,
    "minecraft:axolotl": 0,
    "minecraft:balloon": 0,
    "minecraft:bat": 0,
    "minecraft:bee": 0,
    "minecraft:blaze": 6,
    "minecraft:boat": 0,
    "minecraft:bogged": 2,
    "minecraft:breeze": 5,
    "minecraft:breeze_wind_charge_projectile": 0,
    "minecraft:camel": 0,
    "minecraft:cat": 0,
    "minecraft:cave_spider": 3,
    "minecraft:chalkboard": 0,
    "minecraft:chest_boat": 0,
    "minecraft:chest_minecart": 0,
    "minecraft:chicken": 0,
    "minecraft:cod": 0,
    "minecraft:command_block_minecart": 0,
    "minecraft:copper_golem": 0,
    "minecraft:cow": 0,
    "minecraft:creaking": 3,
    "minecraft:creeper": 4,
    "minecraft:dolphin": 0,
    "minecraft:donkey": 0,
    "minecraft:dragon_fireball": 0,
    "minecraft:drowned": 2,
    "minecraft:egg": 0,
    "minecraft:elder_guardian": 8,
    "minecraft:elder_guardian_ghost": 0,
    "minecraft:ender_crystal": 0,
    "minecraft:ender_dragon": 9,
    "minecraft:ender_pearl": 0,
    "minecraft:enderman": 5,
    "minecraft:endermite": 1,
    "minecraft:evocation_fang": 0,
    "minecraft:evocation_illager": 6,
    "minecraft:eye_of_ender_signal": 0,
    "minecraft:falling_block": 0,
    "minecraft:fireball": 0,
    "minecraft:fireworks_rocket": 0,
    "minecraft:fishing_hook": 0,
    "minecraft:fox": 0,
    "minecraft:frog": 0,
    "minecraft:ghast": 5,
    "minecraft:glow_squid": 0,
    "minecraft:goat": 0,
    "minecraft:guardian": 5,
    "minecraft:happy_ghast": 0,
    "minecraft:hoglin": 5,
    "minecraft:hopper_minecart": 0,
    "minecraft:horse": 0,
    "minecraft:husk": 1,
    "minecraft:ice_bomb": 0,
    "minecraft:iron_golem": 0,
    "minecraft:item": 0,
    "minecraft:leash_knot": 0,
    "minecraft:lightning_bolt": 0,
    "minecraft:lingering_potion": 0,
    "minecraft:llama": 0,
    "minecraft:llama_spit": 0,
    "minecraft:magma_cube": 3,
    "minecraft:minecart": 0,
    "minecraft:mooshroom": 0,
    "minecraft:moving_block": 0,
    "minecraft:mule": 0,
    "minecraft:npc": 0,
    "minecraft:ocelot": 0,
    "minecraft:ominous_item_spawner": 0,
    "minecraft:painting": 0,
    "minecraft:panda": 0,
    "minecraft:parrot": 0,
    "minecraft:phantom": 3,
    "minecraft:pig": 0,
    "minecraft:piglin": 2,
    "minecraft:piglin_brute": 7,
    "minecraft:pillager": 3,
    "minecraft:player": 0,
    "minecraft:polar_bear": 0,
    "minecraft:pufferfish": 0,
    "minecraft:rabbit": 0,
    "minecraft:ravager": 8,
    "minecraft:salmon": 0,
    "minecraft:sheep": 0,
    "minecraft:shield": 0,
    "minecraft:shulker": 6,
    "minecraft:shulker_bullet": 0,
    "minecraft:silverfish": 1,
    "minecraft:skeleton": 2,
    "minecraft:skeleton_horse": 0,
    "minecraft:slime": 1,
    "minecraft:small_fireball": 0,
    "minecraft:sniffer": 0,
    "minecraft:snow_golem": 0,
    "minecraft:snowball": 0,
    "minecraft:spider": 1,
    "minecraft:splash_potion": 0,
    "minecraft:squid": 0,
    "minecraft:stray": 3,
    "minecraft:strider": 0,
    "minecraft:tadpole": 0,
    "minecraft:thrown_trident": 0,
    "minecraft:tnt": 0,
    "minecraft:tnt_minecart": 0,
    "minecraft:trader_llama": 0,
    "minecraft:tripod_camera": 0,
    "minecraft:tropicalfish": 0,
    "minecraft:turtle": 0,
    "minecraft:undefined_test_only": 0,
    "minecraft:vex": 6,
    "minecraft:villager": -5,
    "minecraft:villager_v2": -5,
    "minecraft:vindicator": 5,
    "minecraft:wandering_trader": -2,
    "minecraft:warden": 10,
    "minecraft:wind_charge_projectile": 0,
    "minecraft:witch": 4,
    "minecraft:wither": 9,
    "minecraft:wither_skeleton": 6,
    "minecraft:wither_skull": 0,
    "minecraft:wither_skull_dangerous": 0,
    "minecraft:wolf": 0,
    "minecraft:xp_bottle": 0,
    "minecraft:xp_orb": 0,
    "minecraft:zoglin": 6,
    "minecraft:zombie": 1,
    "minecraft:zombie_horse": 0,
    "minecraft:zombie_pigman": 3,
    "minecraft:zombie_villager": 1,
    "minecraft:zombie_villager_v2": 1
}

const killCooldown = new Map()

/**
 * 
 * @param {import("@minecraft/server").EntityDamageSource} damageSource 
 * @param {Entity} deadEntity 
 */
export function killPoint(damageSource, deadEntity) {
    if (damageSource.damagingEntity?.typeId !== "minecraft:player") return
    if (!pointEachEntity[deadEntity.typeId]) return

    /**@type {Player} */
    const killer = damageSource?.damagingEntity
    const basePoint = pointEachEntity[deadEntity.typeId]

    const currentTick = system.currentTick
    const lastKill = killCooldown.get(killer.id) ?? 0
    if (basePoint > 0 && currentTick - lastKill < 100) {
        //killer.dimension.runCommand(`title "${killer.name}" actionbar §cCooldown...`)
        return
    }
    killCooldown.set(killer.id, currentTick)

    // MAIN / ADD SCORE
    const scoreboard = world.scoreboard.getObjective("pk_display")
    scoreboard?.addScore(killer, basePoint)

    let color = "§a"
    if (basePoint > 0) {
        color = "§a+"
    } else if (basePoint < 0) {
        color = "§c"
    }
    popUPscore(deadEntity.location, deadEntity.dimension, `${color}${basePoint}`)
    //killer.dimension.runCommand(`title "${killer.name}" actionbar ${color}${basePoint}`)
}

/**
 * 
 * @param {import("@minecraft/server").Vector3} posisi 
 * @param {Dimension} dimensi 
 * @param {string} text 
 */
function popUPscore(posisi, dimensi, text) {
    const entity = dimensi.spawnEntity("oden:custom_dummy", posisi)
    entity.nameTag = text

    let tick = 0
    const animation = system.runInterval(() => {

        const locAnim = {
            x: entity.location.x,
            y: entity.location.y + 0.06,
            z: entity.location.z
        }
        entity.teleport(locAnim, {dimension: dimensi})
        tick++

        if (tick >= 20) {
            entity.remove()
            system.clearRun(animation)
        }
    }, 1)
}