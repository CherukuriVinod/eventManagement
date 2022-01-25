import { LightningElement,track } from 'lwc';
import upcomingEvents from "@salesforce/apex/EventDetailsService.upcomingEvents";

const columns = [
    {
        label: "Event Name",
        fieldName: "detailsPage",
        type: "url",
        wrapText: "true",
        cellAttributes: {
            iconName: "standard:event",
            iconPosition: "left"
          },
        typeAttributes: {
          label: {
            fieldName: "Name__c"
          }
        }
    },
    
    {
        label: "Event Organizer",
        fieldName: "EVNT_ORG",
        wrapText: "true",
        cellAttributes: {
          iconName: "standard:user",
          iconPosition: "left"
        }
    },
    {
        label: "Location",
        fieldName: "Location",
        type: "text",
        cellAttributes: {
          iconName: "standard:address",
          iconPosition: "left"
        }
    },
    {
        label: "Start Date-Time",
        fieldName: "Start_DateTime__c",
        type: "date",
        wrapText: true,
        cellAttributes: {
            iconName: "standard:date_time",
            iconPosition: "left"
          },
          typeAttributes:{
          day: "2-digit",  
          month: 'long',
          year: 'numeric',  
          hour: '2-digit',  
          minute: '2-digit',    
          hour12: true
        }
      },
    {
      label: "End Date-Time",
      fieldName: "End_Date_Time__c",
      type: "date",
      wrapText: true,
      cellAttributes: {
          iconName: "standard:date_time",
          iconPosition: "left"
      },
      typeAttributes:{
        day: "2-digit",  
        month: 'long',
        year: 'numeric',  
        hour: '2-digit',  
        minute: '2-digit',    
        hour12: true
      }
    }
  ];
export default class EventList extends LightningElement {
    columnsList = columns;
    error;
    startdattime;
    @track result;
    @track recordsToDisplay;

    connectedCallback(){
        this.upcomingEventsFromApex();
    }
    upcomingEventsFromApex(){
        upcomingEvents()
        .then((data)=>{
            window.console.log("event list ", data);
            data.forEach((record) => {
                record.detailsPage =
                    "https://" + window.location.host + "/" + record.Id;
                record.EVNT_ORG = record.Event_Organizer__r.Name;
                if(record.Location__c){
                    record.Location=record.Location__r.Name;
                }else {
                    record.Location ="This is Virtual Event";
                }
            });

            this.result=data;
            this.recordsToDisplay = data;
            this.error=undefined;
        })
        .catch((err)=>{
            window.console.log(err);
            this.error=JSON.stringify(err);
            this.result=undefined;
        });
    }

    handleSearch(event) {
        let keyword = event.detail.value;
    
        let filteredEvents = this.result.filter((record, index, arrayobject) => {
          return record.Name__c.toLowerCase().includes(keyword.toLowerCase()); 
        });
        if (keyword && keyword.length >= 2) {
          this.recordsToDisplay = filteredEvents;
        } else {
          this.recordsToDisplay = this.result;
        }
    
    }
    handleStartDate(event) {
        let valuedatetime = event.target.value;
    
        let filteredEvents = this.result.filter((record, index, arrayobject) => {
          return record.Start_DateTime__c >= valuedatetime;
        });
        this.recordsToDisplay = filteredEvents;
      }

      handleLocationSearch(event) {
        let keyword = event.detail.value;
    
        let filteredEvents = this.result.filter((record, index, arrayobject) => {
          return record.Location.toLowerCase().includes(keyword.toLowerCase());
        });
        if (keyword && keyword.length >= 2) {
          this.recordsToDisplay = filteredEvents;
        } else {
          this.recordsToDisplay = this.result;
        }
    }
}