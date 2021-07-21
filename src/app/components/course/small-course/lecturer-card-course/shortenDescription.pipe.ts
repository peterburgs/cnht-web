import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'shortenDescription'
})
export class ShortenDescription implements PipeTransform{

    transform(value: any){

        if(value.length >150)
        return value.substr(0,150)+"...";
        else
        return value;
    }
}