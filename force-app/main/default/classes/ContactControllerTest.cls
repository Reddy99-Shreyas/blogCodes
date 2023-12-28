@isTest
private class ContactControllerTest {
    
    @isTest
    static void testGetContactListForDataTable() {
        // Create test Account and Contact records
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
        
        Contact testContact = new Contact(
            FirstName = 'Test',
            LastName = 'Contact',
            Title = 'Test Title',
            Phone = '1234567890',
            Email = 'test@example.com',
            Picture__c = 'Test Picture URL', // Assuming Picture__c is a String field
            Rank__c = 5, // Assuming Rank__c is a String field representing a numeric value
            AccountId = testAccount.Id
        );
        insert testContact;
        
        // Call the method to test
        Test.startTest();
        List<Contact> result = contactController.getContactListForDataTable();
        Test.stopTest();
        
        // Assert that the result contains the queried contact
        System.assertEquals(1, result.size(), 'Contact list size should be 1');
        Contact queriedContact = result[0];
        System.assertEquals(testContact.Id, queriedContact.Id, 'Contact Id should match');
        // Add more assertions for other fields if necessary
    }
    
    @isTest
    static void testGetContactBasedOnAccount() {
        // Test data setup
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
        
        List<Contact> testContacts = new List<Contact>();
        for(Integer i = 0; i < 5; i++) {
            testContacts.add(new Contact(
                FirstName = 'TestFirstName' + i,
                LastName = 'TestLastName' + i,
                Title = 'TestTitle' + i,
                Phone = '123456789' + i,
                Email = 'test' + i + '@example.com',
                AccountId = testAccount.Id
            ));
        }
        insert testContacts;
        
        // Test the method
        Test.startTest();
        List<Contact> resultContacts = contactController.getContactBasedOnAccount(testAccount.Id);
        Test.stopTest();
        
        // Assertions
        System.assertEquals(5, resultContacts.size(), 'Incorrect number of contacts retrieved');
        // Add more specific assertions based on your use case and expected data
        
        // Clean up test data
        delete testContacts;
        delete testAccount;
    }
}