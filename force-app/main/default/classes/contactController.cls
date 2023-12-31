public with sharing class contactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactListForDataTable(){
        List<Contact> conList = [
            SELECT
                Id,
                Name,
                Title,
                Phone,
                Email,
                Picture__c,
                Rank__c,
                AccountId,
                Account.Name
            FROM Contact
            WHERE AccountId != NULL
            WITH USER_MODE
        ];
        return conList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactBasedOnAccount(String accountId){
        List<Contact> conList = [
            SELECT
                Id,
                Name,
                FirstName,
                LastName,
                Title,
                Phone,
                Email,
                AccountId,
                Account.Name,
                LeadSource
            FROM Contact
            WHERE AccountId =: accountId
            WITH USER_MODE
        ];
        return conList;
    }
}