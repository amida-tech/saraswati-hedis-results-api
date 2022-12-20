function getDifference(newArray, oldArray) {
  return newArray.filter((element) => !oldArray.includes(element));
}

function userChangeFinder(oldPref, newPref, companyWidePreferences) {
  const timeStamp = Date.now();
  const UpdatedUser = {};
  // PREVIOUS PROFILE UNEDITABLE  VVVVVV
  // eslint-disable-next-line no-underscore-dangle
  UpdatedUser._id = oldPref._id;
  UpdatedUser.email = oldPref.email;
  UpdatedUser.role = oldPref.role;
  UpdatedUser.companyName = oldPref.companyName;
  UpdatedUser.companyPreferences = oldPref.companyPreferences;
  UpdatedUser.active = oldPref.active;
  UpdatedUser.created_on = oldPref.created_on;
  UpdatedUser.updated_on = timeStamp;
  UpdatedUser.lastLogin = oldPref.lastLogin;
  // PREVIOUS PROFILE UNEDITABLE  ^^^^^^^

  // Editable items for Users - First Name
  let firstName = '';
  if (newPref.firstName === oldPref.firstName) {
    firstName = oldPref.firstName;
  } else if (newPref.firstName === '') {
    firstName = oldPref.firstName;
  } else {
    firstName = newPref.firstName;
  }
  UpdatedUser.firstName = firstName;

  // Editable items for Users - Last Name
  let lastName = '';
  if (newPref.lastName === oldPref.lastName) {
    lastName = oldPref.lastName;
  } else if (newPref.lastName === '') {
    lastName = oldPref.lastName;
  } else {
    lastName = newPref.lastName;
  }
  UpdatedUser.lastName = lastName;

  const userChoices = [];
  const userPreferences = {};
  const foundErrors = [];
  const newReportsAccess = {};
  const reportsAccessErrors = {};
  const newCustomFilters = {};
  const customFiltersErrors = {};
  // sorting user options to find the type of Element and also determine if a change occured
  Object.keys(oldPref.userPreferences).forEach((key) => {
    if (typeof oldPref.userPreferences[key] !== 'object') {
      if (oldPref.userPreferences[key] !== newPref.userPreferences[key]) {
        userChoices.push({
          name: key,
          changed: true,
          type: typeof oldPref.userPreferences[key],
        });
      } else {
        userChoices.push({
          name: key,
          changed: false,
          type: typeof oldPref.userPreferences[key],
        });
      }
    }
    if (typeof oldPref.userPreferences[key] === 'object') {
      if (
        JSON.stringify(oldPref.userPreferences[key])
          !== JSON.stringify(newPref.userPreferences[key])) {
        userChoices.push({
          name: key,
          changed: true,
          type: typeof oldPref.userPreferences[key],
        });
      } else {
        userChoices.push({
          name: key,
          changed: false,
          type: typeof oldPref.userPreferences[key],
        });
      }
    }
  });
  if (userChoices.length > 0) {
    // unchanged userPreferences saves the old preferences as the update
    userChoices.forEach((userChoice) => {
      const { name, changed, type } = userChoice;
      const OldSettings = oldPref.userPreferences[name];
      const NewSettings = newPref.userPreferences[name];
      const CompanySettings = companyWidePreferences[name];

      if (changed !== false) {
        //  Advance user changes that need Company compliance to change
        //  Array Check to check difference
        //  Although this can be caught before it gets here on front end
        //  by only giving company options for user choose from.
        if (Array.isArray(NewSettings)) {
          // This Gets Difference between the User Pref and Company Pref function down below
          const DifferenceFilter = getDifference(NewSettings, CompanySettings);
          if (DifferenceFilter.length > 0) {
            // This Pushes Illegal changes to Error folder
            foundErrors.push({ [name]: DifferenceFilter });
          } else {
            // Changes aligned with company oversight
            userPreferences[name] = NewSettings;
          }
        } else {
          if (name === 'reportsAccess') {
            const reportsAccessNames = Object.keys(NewSettings);
            reportsAccessNames.forEach((reportsAccessSettingsName) => {
              const CompanyReportsAccessSettings = CompanySettings[reportsAccessSettingsName];
              const UserReportsAccessSettings = NewSettings[reportsAccessSettingsName];
              if (CompanyReportsAccessSettings === false && UserReportsAccessSettings === true) {
                // non compliantt company changes befomes an error
                reportsAccessErrors[name] = UserReportsAccessSettings;
              } else {
                // compliantt company changes befomes new setting
                newReportsAccess[reportsAccessSettingsName] = UserReportsAccessSettings;
              }
            });
          }
          if (name === 'customFilters') {
            const customFiltersNames = Object.keys(NewSettings);
            customFiltersNames.forEach((customFiltersSettingsName) => {
              const CompanyCustomFiltersSettings = CompanySettings[customFiltersSettingsName];
              const UserCustomFiltersSettings = NewSettings[customFiltersSettingsName];
              // This Gets Difference between the User Pref and Company Pref function down below
              const DifferenceFilter = getDifference(
                UserCustomFiltersSettings,
                CompanyCustomFiltersSettings,
              );
              if (DifferenceFilter.length > 0) {
                // This Pushes Illegal changes to Error folder
                customFiltersErrors[customFiltersSettingsName] = DifferenceFilter;
              } else {
                // Changes aligned with company oversight
                newCustomFilters[customFiltersSettingsName] = UserCustomFiltersSettings;
              }
            });
          }
          if (type === 'boolean') {
            if (CompanySettings === false && NewSettings === true) {
              foundErrors.push({ [name]: NewSettings });
            } else {
              userPreferences[name] = NewSettings;
            }
          }
          // Basic user changes that dont need company oversight we should expand this later
          if (name === 'darkLightMode' || name === 'timezone' || name === 'profilePicture') {
            userPreferences[name] = NewSettings;
          }
        }
      }
      userPreferences[name] = OldSettings;
    });
  }
  if (Object.keys(reportsAccessErrors).length > 0) {
    foundErrors.push(reportsAccessErrors);
  }
  if (Object.keys(customFiltersErrors).length > 0) {
    foundErrors.push(customFiltersErrors);
  }
  UpdatedUser.userPreferences = userPreferences;
  UpdatedUser.userPreferences.reportsAccess = newReportsAccess;
  UpdatedUser.userPreferences.customFilters = newCustomFilters;

  return { UpdatedUser, foundErrors };
}

module.exports = { userChangeFinder };