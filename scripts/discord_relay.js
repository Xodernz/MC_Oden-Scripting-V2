import { Player, system, world } from "@minecraft/server";
import { http, HttpHeader, HttpRequest } from "@minecraft/server-net";
import { generateServerID } from "./Custom Command/link_discord";

export const ip = `http://localhost`
export const port = `3000`

export let serverID = undefined

export function setServerID() {
    system.run(() => {
        serverID = world.getDynamicProperty("servID")
        if (!serverID) {
            const newServerID = generateServerID()
            serverID = newServerID
            world.setDynamicProperty("servID", newServerID)
        }
    })
}
// ========================= MSG POST =========================
/**
 * 
 * @param {Player} sender 
 * @param {string} message 
 * @param {string} rank
 */
export async function messagePost(sender, message, rank = undefined) {
    const req = new HttpRequest(`${ip}:${port}/toDC`)
    req.method = `Post`
    req.headers = [new HttpHeader('Content-Type', 'application/json')]
    req.body = JSON.stringify({
        ID: serverID,
        content: {
            name: sender.name,
            message: message,
            rank: rank
        }
    })
    try {
        await http.request(req)
    } catch (e) {
        return
    }
}

// ========================= MSG GET =========================
export async function messageGet() {
    const req = new HttpRequest(`${ip}:${port}/toMC`)
    req.method = `Get`
    try {
        const res = await http.request(req)
        if (!res?.body) return

        /**
         * @type {{serverDest: string, content: {author: string, message: string}}[]}
         */
        const content = JSON.parse(res.body)
        const contentIsi = content.filter(n => n.serverDest === serverID)
        if (contentIsi.length > 0) {
            contentIsi.forEach(n => {
                world.sendMessage(`[§9Discord§r] ${n.content.author}: ${n.content.message}`)
            })
        }
    } catch (e) {
        return
    }
}

// ========================= PLAYER JOIN =========================
export async function plyrJoinAnnounce(playerName) {
    const req = new HttpRequest(`${ip}:${port}/plyrJoin`)
    req.method = `Post`
    req.headers = [new HttpHeader('Content-Type', 'application/json')]
    req.body = JSON.stringify({
        ID: serverID,
        joinName: playerName
    })
    try {
        await http.request(req)
    } catch (e) {}
}

// ========================= PLAYER LEAVE =========================
export async function plyrLeaveAnnounce(playerName) {
    const req = new HttpRequest(`${ip}:${port}/plyrLeave`)
    req.method = `Post`
    req.headers = [new HttpHeader('Content-Type', 'application/json')]
    req.body = JSON.stringify({
        ID: serverID,
        leaveName: playerName
    })
    try {
        await http.request(req)
    } catch (e) {}
}