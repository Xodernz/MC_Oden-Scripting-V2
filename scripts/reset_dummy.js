import { system, world } from "@minecraft/server";

export function clearDummy() {
    let dummy_count = 0
    system.run(() => {
        for (const dim of ["overworld", "nether", "the_end"]) {
            const dimensi = world.getDimension(dim)
            const dummies = dimensi.getEntities({type: "oden:custom_dummy"})
            if (dummies.length < 1) return
            for (const dummy of dummies) {
                dummy_count++
                dummy.remove()
            }
        }
        if (dummy_count > 0) {
            console.log(`Cleared ${dummy_count} oden:custom_dummy`)
        }
    })
}