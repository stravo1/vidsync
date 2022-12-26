import { writable } from "svelte/store";

export const creating = writable(false);
export const joining = writable(false);
export const connected = writable(false);
export const caller = writable(false);
export const dataChannel = writable();
export const messages = writable([]);
