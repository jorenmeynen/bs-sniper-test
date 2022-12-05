
// import { input_id, input_id_again, input_buttons } from "../backend/form_content.js";
// import { getCSVData } from "../backend/getRelevantData.js";

export default (req, res) => {
  console.log(req.body);
  if (req.method === "GET") {
    console.log("GET");
    res.send(200);
  }
}



// // --- < To be removed > ---
// Router.route("/:ss_id").get((req, res) => {
//   const ss_id = req.params.ss_id;
//   respondAllScoresJSON(res, ss_id);
// });
// Router.route("/:ss_id/form").get((req, res) => {
//   const ss_id = req.params.ss_id;
//   getFormContent(res, ss_id);
// });
// Router.route("/:ss_id/form/json").get((req, res) => {
//   const ss_id = req.params.ss_id;
//   respondAllScoresJSON(res, ss_id);
// });
// Router.route("/:ss_id/form/csv").get((req, res) => {
//   const ss_id = req.params.ss_id;
//   downloadCSV(res, ss_id);
// });
// // --- </ To be removed > ---



// async function downloadCSV(res, ss_id) {
//   try {
//     const res_player_data = await getPlayerProfile(ss_id);
//     if (res_player_data.status !== 200) throw res_player_data;

//     const score_list = await getAllScoresById(ss_id, res_player_data.data);
//     const csv_content = getCSVData(score_list);
//     const now = new Date().toISOString();
//     const file_name = `ss-data-${res_player_data.data.name}-${now}.csv`;

//     res.attachment(file_name).send(csv_content);
//   }
//   catch (error) { handleError(error, res) }

//   res.end();
// }

// async function getFormContent(res, ss_id) {
//   const response_player_data = await getPlayerProfile(ss_id);

//   var content = "";
//   if (response_player_data.status === 404) {
//     content += `<h1>ID not found, try again.</h1>`;
//     content += input_id_again(ss_id);
//   } else {
//     content += `<h1>${response_player_data.data.name}</h1>`;
//     content += input_buttons(ss_id);
//   }

//   res.setHeader("Content-Type", "text/html");
//   res.send(content);
// }