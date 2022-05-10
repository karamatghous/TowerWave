const db = require("../models");
const CandidateProfile = db.candidateProfile;
const candidateEducation = db.candidateEducation;
const candidateExperience = db.candidateExperience;
const candidateProjects = db.candidateProjects;
const candidateSkills = db.candidateSkills;
const candidateLanguages = db.candidateLanguages;
const userJob = db.postJob;
const user = db.user;
const roles = db.role;
const Op = db.Sequelize.Op;

// Create and Save a new Candidate
exports.createUpdate = async (req, res) => {
  
    CandidateProfile.create(req.body)
      .then(data => {
        res.status(200).json({
          status: 200,
          success: false,
          message: "Created Successfully!",
          data: data
        });
      })
      .catch(err => {
        res.status(500).json({
          status: 500,
          success: false,
          message: err.message || "Some error occurred while creating."
        });
      });
};

exports.updateUserRole = async (req, res) => {

  const newUser = user.findOne({
    where: { id }
  });

  newUser.setRoles(req.body.roles).then(num => {
    if (num == 1) {
      res.status(200).json({
        status: 200,
        success: false,
        message: "Updated Successfully"
      });
    } else {
      res.status(500).json({
        status: 500,
        success: false,
        message: "No changes were made!"
      });
    }
  })
    .catch(err => {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Error updating with id=" + req.userId
      });
    });
};

// exports.updateUserRole = async (req, res) => {
  
//   us.update( {
//     employerId: req.body.employerId,
//     userId: req.body.employerId
//   }, {
//     where: { id: req.body.id },
//   }).then(num => {
//     if (num == 1) {
//       res.status(200).json({
//         status: 200,
//         success: false,
//         message: "Updated Successfully"
//       });
//     } else {
//       res.status(500).json({
//         status: 500,
//         success: false,
//         message: "No changes were made!"
//       });
//     }
//   })
//     .catch(err => {
//       res.status(500).json({
//         status: 500,
//         success: false,
//         message: "Error updating with id=" + req.userId
//       });
//     });
// };

exports.getUserById = async (req, res) => {
  const id = req.query.id;
  const userId = req.userId;

  try {
    const profile = await CandidateProfile.findOne({
      where: { id, userId }
    });

    const education = await candidateEducation.findAll({
      where: { userId }
    });

    const experience = await candidateExperience.findAll({
      where: { userId }
    });

    const projects = await candidateProjects.findAll({
      where: { userId }
    });

    const skills = await candidateSkills.findAll({
      where: { userId }
    });

    const languages = await candidateLanguages.findAll({
      where: { userId }
    });


    if (!profile && !education && !projects && !skills && !languages) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "cannot find user"
      });
    } else {
      res.status(200).json({
        status: 200,
        success: true,
        data: [
          { profile },
          { education },
          { experience },
          { projects },
          { skills },
          { languages },
        ]
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "Something Went wrong while requesting!"
    });
  }

}

exports.getAllUsers = async (req, res) => {
  const client_id = req.body.clientId;
    const profile = await CandidateProfile.findAll({
      where: { client_id },
      include: [userJob,user],
    });

try{
    if (!profile) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "cannot find candidates"
      });
    } else {
      res.status(200).json({
        status: 200,
        success: true,
        data: 
          profile 
        
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "Something Went wrong while requesting!"
    });
  }
}

exports.getUserCandidates = async (req, res) => {
  const client_id = req.body.clientId;
  const userId = req.body.userId;
    const profile = await CandidateProfile.findAll({
      where: { client_id, userId },
      include: [userJob,user],
    });

try{
    if (!profile) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "cannot find candidates"
      });
    } else {
      res.status(200).json({
        status: 200,
        success: true,
        data: 
          profile 
        
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      success: false,
      message: err.message || "Something Went wrong while requesting!"
    });
  }
}

exports.getAllEmployees = async (req, res) => {
  user.findAll({include: [roles]}).then(data => {
    res.status(200).json({
        status: 200,
        success: true,
        data: data
    });
}).catch(err => {
        res.status(500).json({
            status: 500,
            success: false,
            message: err.message || "Something Went wrong while requesting!"
        });
    });
};