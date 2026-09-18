import { env } from '$env/dynamic/private';
import PocketBase from 'pocketbase';

export function createPocketBase(): PocketBase {
	return new PocketBase(env.POCKETBASE_URL ?? 'http://127.0.0.1:8089');
}
