import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'shortenDescription'
})
export class ShortenDescription implements PipeTransform{

    transform(value: any){

        if(value.length >300)
        return value.substr(0,300)+"...";
        else
        return value;
    }
}