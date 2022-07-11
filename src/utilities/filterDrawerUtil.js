const dao = require('../config/dao')

const findPayorByQuery = async (subMeasure, payor, isComposite) => {
    const  Members = isComposite ? await dao.findMembers() : await dao.findMembers({ measurementType: subMeasure });
    const foundMemberMatch = [];
    for(let i = 0; i < Members.length; i++){
        const foundPatientCoverage = Members[i].coverage;
        if(foundPatientCoverage && foundPatientCoverage.length > 0){
          const foundPayors = foundPatientCoverage[0].payor[0]['reference']["value"];
          const lowercaseItem = foundPayors.toLowerCase()
          if(payor.length === 1){
            if(lowercaseItem === payor[0].toLowerCase()){
                foundMemberMatch.push(Members[i]);
            }
          } else {
            payor.forEach((payer)=>{
                if(lowercaseItem === payer.toLowerCase()){
                  foundMemberMatch.push(Members[i]);
                }
            })
          }
        } else {
          const foundPatientPayor = Members[i][Members[i].memberId]['Member Coverage'][0].payor[0]['reference']["value"];
          const lowercaseItem = foundPatientPayor.toLowerCase()
          
          if(payor.length === 1){
            if(foundPatientPayor && lowercaseItem == payor[0].toLowerCase()){
                foundMemberMatch.push(Members[i]);
            }
          } else {
            payor.forEach((payer)=>{
              if(foundPatientPayor && lowercaseItem == payer.toLowerCase()){
                foundMemberMatch.push(Members[i]);
              }
            })
          }

        }
    }
    
    if(foundMemberMatch.length > 0 ){
     return foundMemberMatch;
    } else {
    return foundMemberMatch;
    }
}
const findPractitionersByQuery = async (subMeasure, practitioners, isComposite) => {
    const  Members = isComposite ? await dao.findMembers() : await dao.findMembers({ measurementType: subMeasure });
    const foundMemberMatch = [];
    for(let i = 0; i < Members.length; i++){
        const foundhealthcareProviderOptions = Members[i].providers;
        if(foundhealthcareProviderOptions && foundhealthcareProviderOptions.length > 0){
            foundhealthcareProviderOptions.forEach((provider) => {
                const foundPractitionersValue = provider.display
                const lowercaseItem = foundPractitionersValue.toLowerCase()

                if(practitioners.length === 1){
                    if(lowercaseItem === practitioners[0].toLowerCase()){
                        foundMemberMatch.push(Members[i])
                    }
                } else {
                    practitioners.forEach((practitioner)=>{
                        if(lowercaseItem === practitioner.toLowerCase()){
                            const filteredPractitioner = foundMemberMatch.filter((prac) => prac._id === Members[i]._id)
                            if(filteredPractitioner.length < 1){
                                  foundMemberMatch.push(Members[i]);
                            }
                        }
                    })
                }
                
            })

        } else {
            // const foundPractitioner = Members[i][Members[i].memberId]
            // // ['Member Coverage'][0].relationship.coding;
            // // .payor[0]['reference']["value"];
            // if(foundPractitioner){
            //     console.log(foundPractitioner)
            // }

            // FIX MEEEEEEEE

        }
    }
    if(foundMemberMatch.length > 0 ){
     return foundMemberMatch;
    } else {
    return foundMemberMatch;
    }
}
const findProviderByQuery = async (subMeasure, providers, isComposite) => {
    const  Members = isComposite ? await dao.findMembers() : await dao.findMembers({ measurementType: subMeasure });
    const foundMemberMatch = [];
    for(let i = 0; i < Members.length; i++){
        const foundhealthcareProviderOptions = Members[i].providers;
        if(foundhealthcareProviderOptions && foundhealthcareProviderOptions.length > 0){
            foundhealthcareProviderOptions.forEach((provider) => {
                const foundPractitionersValue = provider.display
                const lowercaseItem = foundPractitionersValue.toLowerCase()

                if(providers.length === 1){
                    if(lowercaseItem === providers[0].toLowerCase()){
                        foundMemberMatch.push(Members[i])
                    }
                } else {
                    providers.forEach((providerFound)=>{
                        if(lowercaseItem === providerFound.toLowerCase()){
                            const filteredPractitioner = foundMemberMatch.filter((prac) => prac._id === Members[i]._id)
                            if(filteredPractitioner.length < 1){
                                  foundMemberMatch.push(Members[i]);
                            }
                        }
                    })
                }
                
            })

        } else {
            // const foundPractitioner = Members[i][Members[i].memberId]
            // // ['Member Coverage'][0].relationship.coding;
            // // .payor[0]['reference']["value"];
            // if(foundPractitioner){
            //     console.log(foundPractitioner)
            // }
            
            // FIX MEEEEEEEE
            console.log(Members[i])

        }
    }
    if(foundMemberMatch.length > 0 ){
     return foundMemberMatch;
    } else {
    return foundMemberMatch;
    }
}
const findCoverageByQuery = async (subMeasure, coverages, isComposite) => {
    const  Members = isComposite ? await dao.findMembers() : await dao.findMembers({ measurementType: subMeasure });
    const foundMemberMatch = [];
    for(let i = 0; i < Members.length; i++){
        const foundPatientCoverage = Members[i].coverage;
        if(foundPatientCoverage && foundPatientCoverage.length > 0){
          const foundCoverage = foundPatientCoverage[0].type.coding;
          const coverageFound = foundCoverage[0].display.value
          const lowercaseItem = coverageFound.toLowerCase()

              if(coverages.length === 1){
                if(lowercaseItem === coverages[0].toLowerCase()){
                    foundMemberMatch.push(Members[i]);
                }
              } else {
                coverages.forEach((cover)=>{
                    if(lowercaseItem === cover.toLowerCase()){
                      foundMemberMatch.push(Members[i]);
                    }
                })
              }
        } else {
          const foundPatientCoverage = Members[i][Members[i].memberId]['Member Coverage'][0].type.coding[0].display.value
          const lowercaseItem = foundPatientCoverage.toLowerCase()
          if(coverages.length === 1){
            if(foundPatientCoverage && lowercaseItem == coverages[0].toLowerCase()){
                foundMemberMatch.push(Members[i]);
            }
          } else {
            coverages.forEach((cover)=>{
              if(foundPatientCoverage && lowercaseItem == cover.toLowerCase()){
                foundMemberMatch.push(Members[i]);
              }
            })
          }
        }
    }
    
    if(foundMemberMatch.length > 0 ){
     return foundMemberMatch;
    } else {
    return foundMemberMatch;
    }
}
module.exports = { findPayorByQuery, findPractitionersByQuery, findProviderByQuery, findCoverageByQuery }