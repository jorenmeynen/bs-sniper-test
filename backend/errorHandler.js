export function handleError(error, res) {
    if (error.status === 404) res.sendStatus(404);
    else if (error.status === 403) res.status(403).send(error.data);
    else if (error.status === 422) res.status(422).send(error.data);
    else if (error.status === 500) res.status(500).send(error.data);
    else {
      console.error(error);
      res.status(error.status).send(error.data);
    }
}