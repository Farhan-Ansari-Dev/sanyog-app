const https = require('https');

https.get('https://www.sanyogconformity.com', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
        const matches = data.match(hexRegex) || [];
        const counts = {};
        matches.forEach(color => {
            color = color.toLowerCase();
            if (color.length === 4) {
               color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
            }
            counts[color] = (counts[color] || 0) + 1;
        });
        const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 10);
        console.log("Top colors:", sorted);
    });
}).on('error', (err) => {
    console.error(err);
});
