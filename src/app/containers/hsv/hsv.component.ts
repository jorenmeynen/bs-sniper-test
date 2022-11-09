import { Component, OnInit } from '@angular/core';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { HSV } from 'src/app/classes/hsv';

@Component({
  selector: 'app-hsv',
  templateUrl: './hsv.component.html',
  styleUrls: ['./hsv.component.scss']
})
export class HsvComponent implements OnInit {

  loading: boolean = false; // Flag variable
  hsv: HSV = null; // Variable to store file

  faIcons = {
    faUpload: faUpload,
  }

  constructor() { }

  ngOnInit(): void {
    this.hsv = JSON.parse(window.localStorage.getItem('hsv'));
  }

  onFileChangeHSV(event: Event) {
    const input = event.target as HTMLInputElement;

    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent) =>{
        const textFromFileLoaded = fileLoadedEvent.target.result as string;
        this.hsv = JSON.parse(textFromFileLoaded);
        window.localStorage.setItem('hsv', textFromFileLoaded);
    };
    fileReader.readAsText(input.files[0], "UTF-8");

  }

}
