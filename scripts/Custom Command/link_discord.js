import { http, HttpHeader, HttpRequest, HttpRequestMethod } from "@minecraft/server-net";
import { commandHandler } from "../command_handler";
import { ip, port, serverID } from "../discord_relay";
import { Player } from "@minecraft/server";

/**
 * 
 * @param {string} message 
 * @param {Player} sender 
 * @returns 
 */
export async function linkDC(message, sender) {
    const cmd = commandHandler(message)
    if (cmd?.command !== "link") return
    if (cmd.args.length !== 1) return true
    if (!sender.hasTag("odenScript:admin")) {
        sender.sendMessage("Kamu bukan admin!")
        return true
    }

    const code = cmd.args[0]

    const req = new HttpRequest(`${ip}:${port}/verify`)
    req.method = "Post"
    req.headers = [new HttpHeader('Content-Type', 'application/json')]
    req.body = JSON.stringify({token: code, serverID: serverID})
    try {
        const res = await http.request(req)
        if (res.status === 200) {
            sender.sendMessage("Berhasil..!!!")
        } else {
            sender.sendMessage("Token tidak valid!")
        }
    } catch (e) {}
    return true
}

export function generateServerID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === `x` ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}


