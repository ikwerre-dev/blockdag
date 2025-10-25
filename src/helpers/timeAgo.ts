function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: [number, string][] = [
        [60, 'second'],
        [60 * 60, 'minute'],
        [60 * 60 * 24, 'hour'],
        [60 * 60 * 24 * 7, 'day'],
        [60 * 60 * 24 * 30, 'week'],
        [60 * 60 * 24 * 365, 'month'],
        [Infinity, 'year'],
    ];

    const interval = intervals.find(([limit]) => seconds < limit) || [Infinity, 'year'];
    let divisor = 1;

    if (interval[1] === 'minute') divisor = 60;
    else if (interval[1] === 'hour') divisor = 3600;
    else if (interval[1] === 'day') divisor = 86400;
    else if (interval[1] === 'week') divisor = 604800;
    else if (interval[1] === 'month') divisor = 2592000;
    else if (interval[1] === 'year') divisor = 31536000;

    const count = Math.floor(seconds / divisor);
    const label = count === 1 ? interval[1] : `${interval[1]}s`;
    return `${count} ${label} ago`;
}

export default timeAgo;