import { LightningElement,api } from 'lwc';

export default class LwcRecordList extends LightningElement {

     /* Public Property to pass the single record & iconname. 
Public Prop: We can set from our Parent Comp.
@api rec; this means which record we are going to display every single record every time.
     */
     @api rec;
     @api iconname = "standard:account";
     @api parentidfield;
   
     handleSelect() {
        let selectEvent = new CustomEvent("select", {
            detail: {
            selRec: this.rec,
            parent: this.parentidfield
            }
        });
        this.dispatchEvent(selectEvent);
     }
   
     handleRemove() {
       let selectEvent = new CustomEvent("select", {
         detail: {
           selRec: undefined,
           parent: this.parentidfield
        }
       });
       this.dispatchEvent(selectEvent);
   }
}

/*
We have two events handleSelect and handleRemove. Both these events are sending select event.
handleSelect: We are sending that this record has been selected

handleRemove: We are saying that the record whatever we selected has been removed, that is why we are sending 
undefined so that Parent LookupDemo can easily identify that the record that was selected earlier has been removed.

*/