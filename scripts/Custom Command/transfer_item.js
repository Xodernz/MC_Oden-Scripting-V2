import { ModalFormData } from "@minecraft/server-ui";
import { commandHandler } from "../command_handler";
import { Player, system, world } from "@minecraft/server";

/**
 * 
 * @param {string} input 
 * @param {Player} sender 
 * @returns {boolean}
 */
export function itemTransfer(input, sender) {
    const cmd = commandHandler(input)
    if (cmd?.command !== `tf`) return
    system.run (() => {
        sendItemForm(sender)
    })
    return true
}

/**
 * 
 * @param {Player} sender 
 */
function sendItemForm(sender, recursiveCount = 1) {
    let listPlayer = world.getAllPlayers().map(n => n.name)
    {
        const ind = listPlayer.findIndex(n => n === sender.name)
        listPlayer.splice(ind, 1)
    }
    if (listPlayer.length < 1) return sender.sendMessage("<Herobrine> Lu online sendirian kocak, Mau TF ke GW??");

    const SenderSlot = sender.getComponent("minecraft:equippable")
    const SenderItem = SenderSlot.getEquipment("Mainhand")
    if (!SenderItem) return sender.sendMessage("Lu ga pengang apa apa dawg!")

    const maxItem = SenderItem.amount
    let itemName = SenderItem.typeId.split(":")[1]?.split("_").map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(" ")

    const form = new ModalFormData()
        .title("Transfer Item")
        .dropdown(`Kirim §e${itemName}§r ke:`, listPlayer)
        .slider(`Jumlah`, 1, maxItem, { defaultValue: maxItem })
        .submitButton("Kirim")


    form.show(sender)
        .then((res) => {
            if (res.canceled) {
                if (res.cancelationReason === "UserBusy") {
                    system.runTimeout(() => {
                        sendItemForm(sender, recursiveCount-1)
                    }, 20)
                }
                if (recursiveCount > 0) {
                    sender.sendMessage(`§aOK! Tutup chat untuk menampilkan menu Transfer!`)
                }
                return;
            }

            const targetName = listPlayer[res.formValues[0]]
            /**
             * @type {Player}
             */
            const target = world.getAllPlayers().find(n => n.name === targetName)
            if (!target) return sender.sendMessage(`Target tidak ditemukan!`)

            const itemValue = res.formValues[1]

            if (maxItem === itemValue) {
                SenderSlot.setEquipment("Mainhand", undefined)
            } else {
                SenderItem.amount -= itemValue
                SenderSlot.setEquipment("Mainhand", SenderItem)
            }

            const targetItem = SenderItem.clone()
            targetItem.amount = itemValue

            const targetInventory = target.getComponent('minecraft:inventory').container
            if (targetInventory.emptySlotsCount > 0) {
                targetInventory.addItem(targetItem)
                target.sendMessage(`Kamu menerima ${itemValue > 1 ? `§a${itemValue} ` : ``}§e${itemName}§r dari §e${sender.name}`)
                target.dimension.runCommand(`playsound note.bell "${target.name}"`)
            } else {
                target.dimension.spawnItem(targetItem, target.getHeadLocation())
                target.sendMessage(`Kamu menerima ${itemValue > 1 ? `§a${itemValue} ` : ``}§e${itemName}§r dari §e${sender.name}\n§c(Item dijatuhkan didekatmu karena inventorymu Penuh)`)
                target.dimension.runCommand(`playsound note.bell "${target.name}"`)
            }
            sender.sendMessage(`Berhasil mengirim ${itemValue > 1 ? `§a${itemValue} ` : ``}§e${itemName}§r kepada §e${target.name}`)
        }
    )
}