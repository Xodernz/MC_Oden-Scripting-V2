import { Player } from "@minecraft/server";
import { itemTransfer } from "./Custom Command/transfer_item";
import { cekTPS } from "./Custom Command/TPS";
import { linkDC } from "./Custom Command/link_discord";


/**
 * 
 * @param {string} input 
 */
export function commandHandler(input, prefix="!") {
    if (!input.startsWith(prefix)) return
    const body = input.slice(prefix.length).trim()

    //REGEX
    const regex = /"([^"]*)"|(\S+)/g
    const token = []
    let match;
    while ((match = regex.exec(body)) !== null) {
        token.push(match[1] ?? match[0])
    }

    const command = token.shift().toLowerCase()
    const args = []

    for (const t of token) {
        args.push(t)
    }

    return {command, args}
}

/**
 * 
 * @param {string} msg 
 * @param {Player} sender 
 * @returns 
 */
export async function isCustomCommand(msg, sender) {
    const listCMD = [
        itemTransfer(msg, sender), //!tf
        cekTPS(msg, sender), // !tps
        await linkDC(msg, sender)
    ]
    if (listCMD.some(n => n === true)) return true
    else return false
}