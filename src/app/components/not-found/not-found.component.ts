import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements AfterViewInit{
ngAfterViewInit(): void {
  this.h1.nativeElement.classList.add('scale')
  setTimeout(()=>{
    this.h1.nativeElement.classList.remove('scale')
  this.h1.nativeElement.classList.add('returnScale')
  },1000)
}

@ViewChild('scale', {static: false}) private h1!: ElementRef<HTMLDivElement>;


}
