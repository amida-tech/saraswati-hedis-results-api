const mockMemberExportDataString = '{"measureId":"aise-abf90a45-2c91-46a7-bd63-89e64c55cd54-aise-0","measurementType":"aise","memberId":"aise-abf90a45-2c91-46a7-bd63-89e64c55cd54","timeStamp":"2022-05-31T18:40:45.426Z","coverage":[{"status":{"value":"active"},"type":{"coding":[{"system":{"value":"http://terminology.hl7.org/CodeSystem/v3-ActCode"},"code":{"value":"MCPOL"},"display":{"value":"Managed Care Policy"}}]},"subscriber":{"reference":{"value":"Patient/aise-abf90a45-2c91-46a7-bd63-89e64c55cd54"}},"beneficiary":{"reference":{"value":"Patient/aise-abf90a45-2c91-46a7-bd63-89e64c55cd54"}},"relationship":{"coding":[{"code":{"value":"self"}}]},"period":{"start":{"value":"2021-05-30"},"end":{"value":"2023-05-30"}},"payor":[{"reference":{"value":"Organization/1"}}],"id":{"value":"4fb65b03-b48a-4a42-a4a1-253409ba6f7f"}}],"providers":[{"reference":"Organization?identifier=667531","display":"Hollifield Clinics"},{"reference":"Practitioner?identifier=7882499","display":"Nurse Practitioner Sharon Arthurs"}],"aise-abf90a45-2c91-46a7-bd63-89e64c55cd54":{"Initial Population 1":true,"Initial Population 2":true,"Initial Population 3":true,"Initial Population 4":false,"Exclusions 1":true,"Exclusions 2":true,"Exclusions 3":true,"Exclusions 4":true,"Denominator 1":true,"Denominator 2":true,"Denominator 3":true,"Denominator 4":false,"Numerator 1":true,"Numerator 2":true,"Numerator 3":true,"Numerator 4":false,"id":"aise-abf90a45-2c91-46a7-bd63-89e64c55cd54"}}';

const mockMemberExportDataObj = JSON.parse(mockMemberExportDataString);

module.exports = {
  mockMemberExportDataString,
  mockMemberExportDataObj,
};
