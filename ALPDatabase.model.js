var ALPDatabaseModelSchema = {
  _id: {
    $oid: String
  },
  btName: String,
  crId: String,
  emailAddress: String,
  region: String,
  supervisorName: String,
  supervisorCrId: String,
  supervisorEmailAddress: String
};

module.exports = ALPDatabaseModelSchema;

