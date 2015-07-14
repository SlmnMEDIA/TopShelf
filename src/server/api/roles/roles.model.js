import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let RolesSchema = new Schema({
  role: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  permissions: {
    editContent: {
      type: Boolean,
      default: false
    },
    publishContent: {
      type: Boolean,
      default: false
    },
    deleteContent: {
      type: Boolean,
      default: false
    },
    manageMedia: {
      type: Boolean,
      default: false
    },
    // restrictAccess: {
    //   type: Boolean,
    //    default: false
    // },
    manageExtensions: {
      type: Boolean,
      default: false
    },
    moderateComments: {
      type: Boolean,
      default: false
    },
    manageUsers: {
      type: Boolean,
      default: false
    },
    manageRoles: {
      type: Boolean,
      default: false
    },
    manageRecruitment: {
      type: Boolean,
      default: false
    },
    manageRecruitmentThreads: {
      type: Boolean,
      default: false
    },
    changeSiteSettings: {
      type: Boolean,
      default: false
    },
    importExportData: {
      type: Boolean,
      default: false
    },
    // deleteSite: {
    //   type: Boolean,
    //    default: false
    // },
    allPrivilages: {
      type: Boolean,
      default: false
    }
  }
});

module.exports = mongoose.model('Roles', RolesSchema);
