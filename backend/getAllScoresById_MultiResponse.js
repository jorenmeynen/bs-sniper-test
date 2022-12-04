// const BASE_URL = "https://scoresaber.com/api/player";
// import axios from "axios";
// import { promise as fastq } from "fastq";

// async function worker(item) {
//     return await new Promise((resolve, reject) => {
//         resolve(item);
//     });
// }

// export async function getAllScoresById_MultiResponse(res, player_id, player_data) {
//     const player_name = player_data.name;
//     const total_songs_played = player_data.scoreStats.totalPlayCount;
//     const items_per_page = 100;

//     const total_pages = Math.ceil(total_songs_played / items_per_page);
//     console.log(`Getting ${player_name}, ${total_songs_played} plays in ${total_pages} pages`);

//     const tasks = [];
//     let concurrency = 5;
//     const queue = fastq(worker, concurrency);
//     for (let i = 1; i <= total_pages; i++) {
//         tasks.push(queue.push(
//             axios.get(`${BASE_URL}/${player_id}/scores?sort=recent&page=${i}&limit=${items_per_page}`)
//         ));
//     }

//     // await Promise.all(tasks);

    
// //   res.setHeader("Content-Type", "application/json");

//     const results = [];
//     for (let result of tasks) {
//         handleResponse(res, await result)
//     }
//     console.log(results);
    

//     // while (new_urls.length !== 0) {
//     //   var failed_urls = [];
//     //   await Promise.allSettled(new_urls).then((responses) => {
//     //     for (const res of responses) {
//     //       if (res.status === "fulfilled") {
//     //         score_list.push(...res.value.data.playerScores);
//     //         continue;
//     //       }

//     //       if (["ETIMEDOUT", "ECONNRESET"].includes(res.reason.code)) {
//     //         failed_urls.push(res.reason.config.url);
//     //         continue;
//     //       }

//     //       if (res.reason.response.status === 429) {
//     //         failed_urls.push(res.reason.config.url);
//     //         continue;
//     //       }

//     //       if (res.reason.response.status === 404)
//     //         continue;

//     //       console.log(`${res.reason.config.url} with status ${res.reason.response.status}`);
//     //     }
//     //   });
//     //   new_urls = failed_urls.map((url) => axios.get(url));

//     //   if (failed_urls.length !== 0)
//     //     console.log(`retrying`, failed_urls);
//     // }

//     res.end()
//     // console.log(`Got ${player_name}, ${score_list.length} plays`);

//     // return score_list;
// }

// function handleResponse(resp, result) {
//     console.log(result)
//     if (result.status === 200) {
//         resp.json(result.data.playerScores)
//         return
//     }

//     // if (["ETIMEDOUT", "ECONNRESET"].includes(res.reason.code)) {
//     // failed_urls.push(res.reason.config.url);
//     // continue;
//     // }

//     if (result.reason.response.status === 429) {
//         console.log("hit request limit")
//     // failed_urls.push(res.reason.config.url);
//     // continue;
//     }

//     if (result.reason.response.status === 404)
//         console.log("page not found")
// }