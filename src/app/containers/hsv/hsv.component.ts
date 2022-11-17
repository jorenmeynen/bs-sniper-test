import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { HSV, Judgement } from 'src/app/classes/hsv';

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

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.hsv = JSON.parse(window.localStorage.getItem('hsv'));

    this.setInnerHTML(this.hsv);
    console.log("this.hsv:", this.hsv);
    this.setTableRowHover();
  }

  setTableRowHover() {
    // use jquery to add hover highlight rows in table
    // if hovered row has class has "no-padding-bottom", then highlight the next row as well
    // if hovered row has class has "no-padding-top", then highlight the previous row as well

    $(document).ready(function() {
      $("table tr").hover(function() {
        if ($(this).hasClass("no-padding-bottom")) {
          $(this).next().addClass("highlight");
        }
        if ($(this).hasClass("no-padding-top")) {
          $(this).prev().addClass("highlight");
        }
        $(this).addClass("highlight");
      }, function() {
        if ($(this).hasClass("no-padding-bottom")) {
          $(this).next().removeClass("highlight");
        }
        if ($(this).hasClass("no-padding-top")) {
          $(this).prev().removeClass("highlight");
        }
        $(this).removeClass("highlight");
      });
    });
  }

  onFileChangeHSV(event: Event) {
    const input = event.target as HTMLInputElement;

    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent) =>{
        const textFromFileLoaded = fileLoadedEvent.target.result as string;
        this.hsv = JSON.parse(textFromFileLoaded);
        window.localStorage.setItem('hsv', textFromFileLoaded);
        this.setInnerHTML(this.hsv);
    };
    fileReader.readAsText(input.files[0], "UTF-8");

  }

  setInnerHTML(hsv: HSV) {
    for (let judgement of hsv.judgments) {
      const judgement_text = this.setInnerHTMLExampleHSV(judgement);
      // replace %s with the threshold in the judgement
      const low = judgement_text.replace(/%s/g, judgement.threshold.toString());
      // replace %s with the threshold - 1 in the previous judgement, or 115 if it's the first judgement
      const high_score = hsv.judgments.indexOf(judgement) == 0 ? 115 : hsv.judgments[hsv.judgments.indexOf(judgement) - 1].threshold - 1;

      const high = judgement_text.replace(/%s/g, high_score.toString());



      judgement['innerHTML_Example'] = this.sanitizer.bypassSecurityTrustHtml(judgement_text);
      judgement['innerHTML_High'] = this.sanitizer.bypassSecurityTrustHtml(high);

      if (judgement.threshold != 115) {
        judgement['innerHTML_Low'] = this.sanitizer.bypassSecurityTrustHtml(low);
      }
    }
  }

  setInnerHTMLExampleHSV(judgement: Judgement) {
    // replace size tags with span and set font-size
    let text = judgement.text.replace(/<size=(\d+)%>/g, '<span style="font-size: $1%">').replace(/<\/size>/g, '</span>');

    // center text, set color, and set bg to black
    const rgb = `${judgement.color[0] * 255}, ${judgement.color[1] * 255}, ${judgement.color[2] * 255}, ${judgement.color[3]}`
    text = `<div style="text-align: center; color: rgba(${rgb}); background-color: black; padding: 0.5em">${text}</div>`;

    // replace %n with <br>
    text = text.replace(/%n/g, '<br>');

    console.log("judgement:", judgement);
    console.log("text:", text);
    console.log("*************")
    return text;
  }






}
