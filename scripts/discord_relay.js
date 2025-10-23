import { Player, world } from "@minecraft/server";
import { http, HttpHeader, HttpRequest } from "@minecraft/server-net";

const ip = `http://localhost`
const port = `3000`
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
    req.body = JSON.stringify({ name: sender.name, message: message, rank: rank })
    try {
        await http.request(req)
    } catch (e) {
        return
    }
}

export async function messageGet() {
    const req = new HttpRequest(`${ip}:${port}/toMC`)
    req.method = `Get`
    try {
        const res = await http.request(req)
        if (!res?.body) return

        /**
         * @type {object[]}
         */
        const content = JSON.parse(res.body)
        if (content.length > 0) {
            content.forEach(n => {
                world.sendMessage(`[§9DISCORD§r] ${n.author}: ${n.message}`)
            })
        }
    } catch (e) {
        return
    }
}