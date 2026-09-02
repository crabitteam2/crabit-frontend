import { parseKrw, purposeError } from "@/lib/forms/wish-validation";
export {
  PURPOSE_MAX_LENGTH,
  normalizePurpose,
} from "@/lib/forms/wish-validation";
export const isValidPurpose = (value: string) =>
  purposeError(value) === undefined;
export const stripAmountSeparators = (value: string) => value.replace(/,/g, "");
export const isValidTargetAmount = (value: string) => parseKrw(value) !== null;
export const toTargetAmount = (value: string) => parseKrw(value) ?? 0;
