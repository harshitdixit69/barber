function convert_time2(time) {
    let t = time.split(':')
    let h = parseInt(t[0])
    let m = parseInt(t[1].substring(0, 2))
    let z = t[1].substring(2, 4)
    let rt = (h * 60) + m

    if (z == "pm") {
        if (h != 12) {
            rt = (12 * 60) + rt
        }
    }
    return rt
}

function pretty_time(t) {
    let h = parseInt(t / 60)
    let m = t % 60
    let z = ''

    if (h > 12) {
        h = h % 12
        z = 'pm'
    } else if (h == 12) {
        h = 12
        z = 'pm'
    } else {
        if (h < 12 || h==0)
            z = 'am'
    }

    return h + ':' + m + z
}

module.exports = { pretty_time, convert_time2 }