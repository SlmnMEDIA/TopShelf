module.exports = function() {
  console.log('creating roles...');
  let Roles = require('../api/roles/roles.model');
  // let populateGlobalRoles = require('../components/roles');

  let basicRoles = [];

  let basic = {
    role: 'basic',
    permissions: {
      editContent: false,
      publishContent: false,
      deleteContent: false,
      manageMedia: false,
      restrictAccess: false,
      manageExtensions: false,
      moderateComments: false,
      manageUsers: false,
      manageRoles: false,
      manageRecruitment: false,
      manageRecruitmentThreads: false,
      changeSiteSettings: false,
      importExportData: false,
      deleteSite: false,
      allPrivilages: false
    }
  };

  let level1 = {
    role: 'level 1',
    permissions: {
      editContent: true,
      publishContent: false,
      deleteContent: false,
      manageMedia: false,
      restrictAccess: false,
      manageExtensions: false,
      moderateComments: false,
      manageUsers: false,
      manageRoles: false,
      manageRecruitment: false,
      manageRecruitmentThreads: false,
      changeSiteSettings: false,
      importExportData: false,
      deleteSite: false,
      allPrivilages: false
    }
  };

  let level2 = {
    role: 'level 2',
    permissions: {
      editContent: true,
      publishContent: true,
      deleteContent: false,
      manageMedia: true,
      restrictAccess: false,
      manageExtensions: false,
      moderateComments: false,
      manageUsers: false,
      manageRoles: false,
      manageRecruitment: false,
      manageRecruitmentThreads: false,
      changeSiteSettings: false,
      importExportData: false,
      deleteSite: false,
      allPrivilages: false
    }
  };

  let level3 = {
    role: 'level 3',
    permissions: {
      editContent: true,
      publishContent: true,
      deleteContent: true,
      manageMedia: true,
      restrictAccess: true,
      manageExtensions: true,
      moderateComments: true,
      manageUsers: false,
      manageRoles: false,
      manageRecruitment: false,
      manageRecruitmentThreads: false,
      changeSiteSettings: false,
      importExportData: false,
      deleteSite: false,
      allPrivilages: false
    }
  };

  let level4 = {
    role: 'level 4',
    permissions: {
      editContent: true,
      publishContent: true,
      deleteContent: true,
      manageMedia: true,
      restrictAccess: true,
      manageExtensions: true,
      moderateComments: true,
      manageUsers: true,
      manageRoles: true,
      manageRecruitment: false,
      manageRecruitmentThreads: false,
      changeSiteSettings: false,
      importExportData: false,
      deleteSite: false,
      allPrivilages: false
    }
  };

  let level5 = {
    role: 'level 5',
    permissions: {
      editContent: true,
      publishContent: true,
      deleteContent: true,
      manageMedia: true,
      restrictAccess: true,
      manageExtensions: true,
      moderateComments: true,
      manageUsers: true,
      manageRoles: true,
      manageRecruitment: true,
      manageRecruitmentThreads: true,
      changeSiteSettings: true,
      importExportData: true,
      deleteSite: false,
      allPrivilages: false
    }
  };

  let admin = {
    role: 'admin',
    permissions: {
      editContent: true,
      publishContent: true,
      deleteContent: true,
      manageMedia: true,
      restrictAccess: true,
      manageExtensions: true,
      moderateComments: true,
      manageUsers: true,
      manageRoles: true,
      manageRecruitment: true,
      manageRecruitmentThreads: true,
      changeSiteSettings: true,
      importExportData: true,
      deleteSite: true,
      allPrivilages: true
    }
  };

  basicRoles.push(basic, level1, level2, level3, level4, level5, admin);

  // Roles.remove({}, function(err, roles) {
  //   if(err) { return handleError(err); }
  //   console.log('deleted roles');
  // });

  Roles.find(function(err, roles) {
    if (err) {
      return handleError(err);
    }
    if (roles.length === 0) {
      Roles.create(basicRoles, function(roles) {
        if (err) {
          return handleError(err);
        }
        roles = getArguments(arguments);
        // populateGlobalRoles(roles);
        console.log('roles initialized');
      });
    } else {
      // populateGlobalRoles(roles);
    }
  });

  function handleError(err) {
    return console.log('Initializing data error: ', err);
  }

  function getArguments(args) {
    // Since mongoose returns created items as list of params we must iterate through them
    let allFound = [];
    for (let i = 1; i < args.length; ++i) {
      allFound.push(args[i]);
    }
    return allFound;
  }
};
