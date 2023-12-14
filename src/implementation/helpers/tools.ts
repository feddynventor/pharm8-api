
export const capitalizeWords = (string: string | null | undefined) => {
    if (!string) return ""
    return string.replace(/(?:^|\s)\S/g, function(a: string) { return a.toUpperCase(); });
};