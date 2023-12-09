export function controllaCF(cf: string): Promise<void> {

    let validi, i, s, set1, set2, setpari, setdisp;

    cf = cf.toUpperCase();

    if (cf.length != 16) return Promise.reject("Il codice fiscale non è lungo 16 caratteri");

    validi = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (i = 0; i < 16; i++) {
        if (validi.indexOf(cf.charAt(i)) == -1)
            return Promise.reject("Il codice fiscale contiene dei caratteri non validi");
    }

    set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";

    setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";

    s = 0;

    for (i = 1; i <= 13; i += 2)
        s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));

    for (i = 0; i <= 14; i += 2)
        s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));

    if (s % 26 != cf.charCodeAt(15) - 'A'.charCodeAt(0))
        return Promise.reject("Il codice fiscale non è corretto");

    return Promise.resolve();

}