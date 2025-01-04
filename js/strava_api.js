async function request_activities(res, num) {
    const activities_link = `https://www.strava.com/api/v3/athlete/activities?&access_token=${res.access_token}&page=1&per_page=${num}`;
    const response = await fetch(activities_link).then((res) => res.json());
    return response;
}

async function request_streams(res) {
    const streams_link = `https://www.strava.com/api/v3/athlete/activities?&access_token=${res.access_token}`
}

async function reAuthorize(num) {
    const response = await fetch("https://www.strava.com/oauth/token", {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: '121694',
            client_secret: '80fef8e3ea40f7f4fa1ec5d604179d2d7a30618a',
            refresh_token:'2306266d00d134976bd2404461811977300817e4',
            grant_type: 'refresh_token'
        })
    }).then((res) => res.json()).then((res) => request_activities(res, num));
    return await response;
}

async function get_activities(num) {
    await reAuthorize(num).then((res) => {
        localStorage.setItem("activities", JSON.stringify(res));
    });
}
