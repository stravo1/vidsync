import { writable } from "svelte/store";
/* auth */
export const loggedIn = writable(false);
export const loaded = writable(false);
export const authObj = writable(null);
export const user = writable(null);

/* room n connection */
export const creating = writable(false);
export const waiting = writable(false);
export const joining = writable(false);
export const connected = writable(false);
export const peerName = writable(null);
export const caller = writable(false);
export const dataChannel = writable();
export const messages = writable([]);

/* player info */
export const paused = writable(true);
export const ended = writable(false);
export const time = writable(0);
export const max = writable(0);
export const name = writable("");
export const files = writable(null);
export const subsName = writable("");
