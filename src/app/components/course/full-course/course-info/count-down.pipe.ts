import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name:'countdown',
    pure:true
})
export class CountdownPipe implements PipeTransform{
    transform(text: string, args: number){
        let maxLength = args || 0;
        let length = text.length;

        return (maxLength - length);
    }
}