const connection = require("./conn.js");
module.exports ={ToAlertSuperVisors: async function(){
    let dbContext = await connection.getDb();
    var supervisor_details = new Map();
    var ALPdatabase = await dbContext.collection('ALP_Database').find({}).toArray();
    var supervisors = [...new Set(ALPdatabase.map(bt => bt["Supervisor Email Address"]))];
    var ALPMeetingDatabase = await dbContext.collection('ALP_Meeting_Database').find({}).toArray();
    supervisors.forEach((supervisor) => {
      supervisor_details.set(supervisor, {"scheduled": 0, "unscheduled": 0});
      var bts = ALPdatabase.filter(record => record["Supervisor Email Address"] === supervisor);
      bts.forEach((bt) => {
        const bt_name = bt["BT Name"];
        var meetings = ALPMeetingDatabase.filter(meet => meet["BT Name​"] === bt_name &&
            meet["Supervisor Email"] === supervisor &&
            meet["Appointment Type"] === "Monthly POD meeting"
        );
        if (meetings.length < 1) {
          supervisor_details.get(supervisor)["unscheduled"] += 1;
        } else {
          supervisor_details.get(supervisor)["scheduled"] += 1;
        }
      });
    });
    const unscheduled_supervisors = [];
    for (const [supervisor, details] of supervisor_details) {
      if (details["unscheduled"] > 0) {
        unscheduled_supervisors.push(supervisor);
      }
    }
    console.log("Supervisors with unscheduled meetings:");
    return { result: unscheduled_supervisors};
  }
}
  