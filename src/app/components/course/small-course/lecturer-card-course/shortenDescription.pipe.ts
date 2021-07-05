import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'shortenDescription'
})
export class ShortenDescription implements PipeTransform{

    transform(value: any){

        if(value.length >60)
        return value.substr(0,60)+"...";
        else
        return value;
    }
}