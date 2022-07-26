const dao = require("../config/dao")
const {
    findPayorByQuery, findPractitionersByQuery, findProviderByQuery, findCoverageByQuery,
  } = require("../utilities/filterDrawerUtil")
const filterMembers = async (req, res, next) => {
  const { submeasure, filters, isComposite } = req.body;
    try {
        let Members = isComposite
        ? await dao.findMembers()
        : await dao.findMembers({ measurementType: submeasure });
        
        console.log("");
        console.log("origMembersCount", Members.length);
        
        if(filters.healthcareProviders.length > 0){
            Members = await findProviderByQuery(filters.healthcareProviders, Members);
            console.log("afterhealthcareProvidersCount", Members.length);
        }
        if(filters.healthcareCoverages.length > 0){
            Members = await findCoverageByQuery(filters.healthcareCoverages, Members);
            console.log("afterhealthcareCoverageCount", Members.length);
        }
        if(filters.payors.length > 0){
            Members = await findPayorByQuery(filters.payors, Members);
            console.log("afterPayorCount", Members.length);
        }
        if(filters.healthcarePractitioners.length > 0){
            Members = await findPractitionersByQuery(filters.healthcarePractitioners, Members)
            console.log("afterPractitionerCount", Members.length)
        }
        req.FoundMembers = Members
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = { 
    filterMembers,
}