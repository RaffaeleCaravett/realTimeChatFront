import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit{

  @ViewChild('hiddenDiv', {static: false}) private hiddenDiv!: ElementRef<HTMLDivElement>;
  // @ViewChild('scaleDiv', {static: false}) private scaleDiv!: ElementRef<HTMLDivElement>;
isHiddenDivScrolledIntoView!: boolean;

images:any[]=[
  {
    title:"Single Chat",
    description:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    image:'assets/home/message1.png'
  },
  {
    title:"Group chats",
    description:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    image:'assets/home/message2.webp'
  },
  {
    title:"Chat requests",
    description:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    image:'assets/home/message3.jpg'
  }
]

constructor(private toastr:ToastrService){}
  ngAfterViewInit(): void {
this.toastr.show('Welcome here')
}

@HostListener('window:scroll', ['$event'])
isScrolledIntoView(){
  if (this.hiddenDiv){
    const rect = this.hiddenDiv.nativeElement.getBoundingClientRect();
    const topShown = rect.top >= 0;
    const bottomShown = rect.bottom <= window.innerHeight;
    this.isHiddenDivScrolledIntoView = topShown && bottomShown;
if(this.isHiddenDivScrolledIntoView){
this.hiddenDiv.nativeElement.classList.add('return')
// this.scaleDiv.nativeElement.classList.add('returnScale')
}else{
  this.hiddenDiv.nativeElement.classList.remove('return')
  // this.scaleDiv.nativeElement.classList.remove('returnScale')
}
  }
}

}
