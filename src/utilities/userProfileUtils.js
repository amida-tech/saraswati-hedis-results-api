function getDifference(newArray, oldArray) {
  return newArray.filter((element) => !oldArray.includes(element));
}
function verifySimpleFeature(newPre, oldPre, field) {
  let changes = '';
  if (newPre[field] === oldPre[field]) {
    changes = oldPre[field];
  } else if (newPre[field] === '') {
    changes = oldPre[field];
  } else {
    changes = newPre[field];
  }
  return changes;
}
function adjustmentFinder(oldPref, newPref) {
  const userPreferencesChange = [];
  const userSettingsChange = [];
  Object.keys(oldPref.userPreferences).forEach((key) => {
    const specificSelection = oldPref.userPreferences[key];
    const newSpecificSelection = newPref.userPreferences[key];
    if (specificSelection !== newSpecificSelection) {
      userPreferencesChange.push({
        name: key,
        changed: true,
        type: Array.isArray(specificSelection) ? 'array' : typeof specificSelection,
      });
    } else {
      userPreferencesChange.push({
        name: key,
        changed: false,
        type: Array.isArray(specificSelection) ? 'array' : typeof specificSelection,
      });
    }
  });
  Object.keys(oldPref.userSettings).forEach((key) => {
    const specificSelection = oldPref.userSettings[key];
    const newSpecificSelection = newPref.userSettings[key];
    const ObjSelection = typeof specificSelection === 'object';
    const ArraySelection = Array.isArray(specificSelection);

    if (ObjSelection && ArraySelection) {
      if (
        JSON.stringify(specificSelection)
          !== JSON.stringify(newSpecificSelection)) {
        userSettingsChange.push({
          name: key,
          changed: true,
          type: Array.isArray(specificSelection) ? 'array' : typeof specificSelection,
        });
      } else {
        userSettingsChange.push({
          name: key,
          changed: false,
          type: Array.isArray(specificSelection) ? 'array' : typeof specificSelection,
        });
      }
    } else if (ObjSelection && ArraySelection === false) {
      if (
        JSON.stringify(specificSelection)
        !== JSON.stringify(newSpecificSelection)) {
        userSettingsChange.push({
          name: key,
          changed: true,
          type: Array.isArray(specificSelection) ? 'array' : typeof specificSelection,
        });
      } else {
        userSettingsChange.push({
          name: key,
          changed: false,
          type: Array.isArray(specificSelection) ? 'array' : typeof specificSelection,
        });
      }
    }
  });
  return { userPreferencesChange, userSettingsChange };
}

function userPrefAdjuster({
  userPreferencesChange,
  oldPref,
  newPref,
}) {
  const userPrefrencesObj = {};
  userPreferencesChange.forEach((userChoice) => {
    const { name, changed } = userChoice;
    const OldSettings = oldPref[name];
    const NewSettings = newPref[name];
    if (changed) {
      userPrefrencesObj[name] = NewSettings;
    } else {
      userPrefrencesObj[name] = OldSettings;
    }
  });
  return userPrefrencesObj;
}
function userSettingAdjuster({
  userSettingsChange,
  oldPref,
  newPref,
  companyWidePreferences,
}) {
  const userSettings = {};
  const errorsFound = [];
  userSettings.profileFeatures = {};
  userSettings.profileFeatures.healthcareTypes = {};
  userSettings.profileFeatures.reportsAccess = {};
  userSettingsChange.forEach((userChoice) => {
    const { name, changed, type } = userChoice;
    const OldSettings = oldPref[name];
    const NewSettings = newPref[name];
    const CompanySettings = companyWidePreferences[name];
    if (changed) {
      if (type === 'array') {
        const choicesInQuestion = getDifference(NewSettings, OldSettings);
        const companyDifference = getDifference(choicesInQuestion, CompanySettings);
        if (companyDifference.length > 0) {
          companyDifference.forEach((diff) => {
            errorsFound.push({ [name]: diff });
          });
        } else {
          userSettings[name] = NewSettings;
        }
      }
      if (type === 'object') {
        if (name === 'filters') {
          const filtersNames = Object.keys(NewSettings);
          filtersNames.forEach((filtersSettingsName) => {
            if (filtersSettingsName === 'filterClassification') {
              const companyChoice = CompanySettings[filtersSettingsName];
              const newChoice = NewSettings[filtersSettingsName];
              if (newChoice === companyChoice) {
                userSettings.filters = {};
                userSettings.filters[filtersSettingsName] = companyChoice;
              } else {
                errorsFound.push({ [name]: newChoice });
              }
            }
            if (filtersSettingsName === 'filterNames') {
              const companyChoice = CompanySettings[filtersSettingsName];
              const newChoice = NewSettings[filtersSettingsName];
              const oldChoice = OldSettings[filtersSettingsName];
              const choicesInQuestion = getDifference(newChoice, oldChoice);
              const companyDifference = getDifference(choicesInQuestion, companyChoice);
              if (companyDifference.length > 0) {
                companyDifference.forEach((diff) => {
                  errorsFound.push({ [filtersSettingsName]: diff });
                });
              } else {
                userSettings[name][filtersSettingsName] = companyChoice;
              }
            }
          });
        }
        if (name === 'profileFeatures') {
          const profileFeaturesNames = Object.keys(NewSettings);
          profileFeaturesNames.forEach((pfName) => {
            const companyChoice = CompanySettings[pfName];
            const newChoice = NewSettings[pfName];
            if (pfName === 'healthcareTypes' || pfName === 'reportsAccess') {
              Object.keys(newChoice).forEach((feature) => {
                const selectCompanyFeature = companyChoice[feature];
                const usersNewPrefrence = newChoice[feature];
                if (selectCompanyFeature === false && usersNewPrefrence) {
                  errorsFound.push({ [feature]: usersNewPrefrence });
                } else {
                  if (pfName === 'healthcareTypes') {
                    userSettings.profileFeatures.healthcareTypes[feature] = usersNewPrefrence;
                  }
                  userSettings.profileFeatures.reportsAccess[feature] = usersNewPrefrence;
                }
              });
            }
            if (pfName !== 'healthcareTypes' || pfName !== 'reportsAccess') {
              if (companyChoice === false && newChoice) {
                errorsFound.push({ [pfName]: newChoice });
              } else {
                userSettings.profileFeatures[pfName] = newChoice;
              }
            }
          });
        }
      }
    } else {
      userSettings[name] = OldSettings;
    }
  });
  return { userSettings, errorsFound };
}
function userChangeFinder(oldPref, newPref, companyWidePreferences) {
  const timeStamp = new Date(Date.now());
  const UpdatedUser = {};
  // PREVIOUS PROFILE UNEDITABLE  VVVVVV
  // eslint-disable-next-line no-underscore-dangle
  UpdatedUser._id = oldPref._id;
  UpdatedUser.email = oldPref.email;
  UpdatedUser.role = oldPref.role;
  UpdatedUser.region = oldPref.region;
  UpdatedUser.userGroup = oldPref.userGroup;
  UpdatedUser.companyName = oldPref.companyName;
  UpdatedUser.companyPreferences = oldPref.companyPreferences;
  UpdatedUser.active = oldPref.active;
  UpdatedUser.created_on = oldPref.created_on;
  UpdatedUser.lastUpdated = timeStamp;
  UpdatedUser.lastLogin = oldPref.lastLogin;
  // PREVIOUS PROFILE UNEDITABLE  ^^^^^^^

  UpdatedUser.userGroup = oldPref.userGroup;
  // Editable items for Users - First Name
  UpdatedUser.firstName = verifySimpleFeature(newPref, oldPref, 'firstName');
  // Editable items for Users - Last Name
  UpdatedUser.lastName = verifySimpleFeature(newPref, oldPref, 'lastName');
  // Editable items for Users - Picture
  UpdatedUser.picture = verifySimpleFeature(newPref, oldPref, 'picture');

  // sorting user options to find the type of Element and also determine if a change occured
  const { userPreferencesChange, userSettingsChange } = adjustmentFinder(oldPref, newPref);
  const userPreferences = userPrefAdjuster({
    userPreferencesChange,
    oldPref: oldPref.userPreferences,
    newPref: newPref.userPreferences,
  });
  const { userSettings, errorsFound } = userSettingAdjuster({
    userSettingsChange,
    oldPref: oldPref.userSettings,
    newPref: newPref.userSettings,
    companyWidePreferences: companyWidePreferences.companySettings,
  });
  UpdatedUser.userPreferences = userPreferences;
  UpdatedUser.userSettings = userSettings;
  return { UpdatedUser, errorsFound };
}

module.exports = { userChangeFinder };
