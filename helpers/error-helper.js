exports.throwServerError = (err) => {
    throw new Error(`Greška na serveru! ${err.message || err}`)
};

exports.throwNotFoundError = (entity) => {
    throw new Error(`Greška: ${entity} nije pronađen!`);
};

exports.throwConflictError = (err) => {
    throw new Error(`Posotoji konflikt sa ${err}`);
}