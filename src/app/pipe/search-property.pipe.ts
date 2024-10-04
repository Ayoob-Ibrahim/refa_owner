import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, Event } from '@angular/router';

@Pipe({
    name: 'searchproperty'
})
export class searchpropertypipe implements PipeTransform {
    pageType: string;
    constructor(private router: Router, private route: ActivatedRoute) {
        this.pageType = this.router.url.includes('property-approval') ? 'property-approval' : 'rent-request';
    }
    retrunObj = {
        'property-approval': ['details', 'address', 'rate'],
        'rent-request': ['propertydetails', 'propertyaddress', 'property_rate'],
    }



    transform(value: any, args?: any): any {
        if (!args) {
            return value;
        }
        return value.filter((value: any) => {
            return (value[this.retrunObj[this.pageType][0]].toLocaleLowerCase().includes(args))
                || (value[this.retrunObj[this.pageType][1]].toLocaleLowerCase().includes(args))
                || (value[this.retrunObj[this.pageType][2]].toLocaleLowerCase().includes(args));

        })

    }
}