export function input_id() {
  const content = `
      <form action="/" method="POST">
        <label for="ss_id">Enter ScoreSaber ID: </label>
        <input type="text" name="ss_id">
        <input type="submit" value="Continue"/>
      </form>`;
  return content;
}

export function input_id_again(player_id) {
  const content = `
      <form action="/" method="POST">
        <label for="ss_id">Enter ScoreSaber ID: </label>
        <input type="text" name="ss_id" value="${player_id}">
        <input type="submit" value="Continue"/>
      </form>`;
  return content;
}

export function input_buttons(player_id) {
  const content = `
      <form action="../${player_id}/form/json" method="get">
        <input type="submit" value="View JSON file for development"/>
      </form>
      <form action="../${player_id}/form/csv" method="get">
        <input type="submit" value="Download CSV file for importing into spreadsheet"/>
      </form>`;
  return content;
}
