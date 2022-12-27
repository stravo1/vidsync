import { writable } from "svelte/store";

export const creating = writable(false);
export const joining = writable(false);
export const connected = writable(false);
export const caller = writable(false);
export const dataChannel = writable();
export const messages = writable([]);
export const paused = writable(true);
export const ended = writable(false);
export const time = writable(0);
export const max = writable(0);
export const name = writable("");
export const files = writable(null);
export const subsName = writable("");
