import { LightningElement,api,track } from 'lwc';
import searchRecords from '@salesforce/apex/CustomSearchController.searchRecords';
export default class CustomLwcLookup extends LightningElement {
    @api objectName = 'Account';
    @api fieldName = 'Name';
    @api iconname = 'standard:record';
    @api label = 'Account';
    @api parentidfield = 'AccountId';

    /* private property */
    @track records; //We are getting records from ApexClass
    @track selectedRecord; //the record that we are selecting.

    hanldeSearch(event) {

        var searchVal = event.detail.value;
        searchRecords({
            objName: this.objectName,
            fieldName: this.fieldName,
            searchKey: searchVal
        })
            .then(data => { //if this is Sucessful we are manipulating the data and recording and getting the data.
                if (data) {
                    let parsedResponse = JSON.parse(data);
                    let searchRecordList = parsedResponse[0];
                    for (let i = 0; i < searchRecordList.length; i++) {
                        let record = searchRecordList[i];
                        record.Name = record[this.fieldName];

                    }
                    this.records = searchRecordList;
                }
            })
            .catch(error => {
                window.console.log(' error ', error);
            });
    }

    handleSelect(event) {
        var selectedVal = event.detail.selRec;
        this.selectedRecord = selectedVal;
        let finalRecEvent = new CustomEvent('select', {
            detail: { selectedRecordId: this.selectedRecord.Id, parentfield: this.parentidfield }
        });
        this.dispatchEvent(finalRecEvent);
    }

    handleRemove() {
        this.selectedRecord = undefined;
        this.records = undefined;
        let finalRecEvent = new CustomEvent('select', {
            detail: { selectedRecordId: undefined, parentfield: this.parentidfield }
        });
        this.dispatchEvent(finalRecEvent);
    }
}

/*
We have 5 @api properties why? because we wanted to know in which Object we want to perform the search,
@api fieldName = 'Name';
What is the field you want to perform the search because name is not manadtory to have in across all the Objects.
For example: In Case Object we don't have any new Name field we have Case Number. In case of work order we don't have any name field.
Sometimes you don't want to search by a Name field, maybe you want to search by a specific field.
That is why we are asking user to provide the field name. 

 @api label = 'Account' we are passing label to search component and search component is dispalying that label.
 This label we are getting from the user iteself.

  @api parentidfield : Why we are using like this..?
  We can easily identify in which parent field we need to put the selected record ID so that at the time of creation
  it will reference to that record.

  hanldeSearch(event): Is calling Apexclass method searchRecords


  for (let i = 0; i < searchRecordList.length; i++) {
                        let record = searchRecordList[i];
                        record.Name = record[this.fieldName];

    We iterating with whatever the record list we got and then inside the record itself we are preparing a name
    property in a Javascript there is a way we can create our field in any list or in any record.
    So what we did is whatever the field we are getting here [this.fieldName]; in @api FieldName from that field
    we are getting the value.

    handleSelect(event): If the user has selected something that means our recordlist comp is firing another event
    named as select and then we are handling handleSelect(event)
    we got whatever the record has been selected, we said that selected record in the variable 'selectedRecord' in
    the @track selectedRecord; and we dispatched this.dispatchEvent event which is alos select event. We said that this is
    the selected record ID and the parentidField.


*/