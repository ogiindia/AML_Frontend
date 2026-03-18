import { convertHASHData } from "@ais/crypto";

export async function hashString(input) {
    return await convertHASHData(input);
}