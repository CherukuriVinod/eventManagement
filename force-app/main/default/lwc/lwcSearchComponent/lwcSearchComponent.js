import { LightningElement,track,api } from 'lwc';

export default class LwcSearchComponent extends LightningElement {
    @track searchKeyword;
    @api isrequired="false";//Lookup field is required
    @api searchLabel="Search Account";//What label we want to display. On the Contact it is Account.
    @api showLabel = "true";//Either we want to show the label to the input search or not.

    /* Check the isrequired property is true then set the property to true*/
  renderedCallback() {
    if (this.isrequired === "false") return;
    if (this.isrequired === "true") {
      let picklistInfo = this.template.querySelector("lightning-input");
      picklistInfo.required = true;
      this.isrequired = "false";
    }
  }

  handleChange(event) {
    var keyword = event.target.value;
    /* Create & dispatch the event to parent component with the search keyword */
    if (keyword && keyword.length) {
      let searchEvent = new CustomEvent("search", {
        detail: { value: keyword }
      });
      this.dispatchEvent(searchEvent);
    }
  }
}

/*renderedCallBack: if this @api is required attribute that being send by the parent lookup comp is true then we are 
going to we are making the input as true else we are making our input as false.
 */

/*handleChange(event):
It is Getting whatever the input user is typing that input we are getting and then we are sending that
to Parent Lookup Comp.
*/