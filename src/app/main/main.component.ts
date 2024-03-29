import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/twilight';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import * as projectJson from '../../data/classic-cards.json';
import { Deck, Project } from '../models/all';

const heartImg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAS3SURBVHhe7ZpbaBxVGMfXeqlV1IoXEERBK4JKEzNzzm5CYJwzs3WrL76kD74WH8Ra9MHXBKkogoJSFIQ+FMTLg33wzbsg8UEEseCLJYipleJWk92dmY1a3fH/bT4lJGeyO7uz2ZlxfvCHZHfP933/c5nLmSkVFBQUFBTEp1Pdf3XDMYWn5FO+I970lfzEd+SXniM+xGdv4P/Dnirv79T27eYmsenUartXq2IycMTj0Ank+chDDsT+GDlOItfRwC4bnUplDzcZPQ176k4U8JqvxC+eEn/BdKgTCu3Q9yh0Gb9fWHGN2zhET5pu+S6YexE6t10OUjeHI37C3y+17enbOUTytCzjxsCVx5BsbXMRfcproSMoDofcQmt28qbAkc8hR1vTvqe6tSk5v2pN7OWQwxOWSpes2VJhJL/XJR1AS55juhSXU1COXYGSjyDHWc3vY2l95slvaHly+OFAIBdrb0WXbFBhpFqYDYepE8K5uUvx2TPIMdCoRwpLtGmbM2xjMHw1NYXCPG2C4fXn+oFSHkGOi5rvExDVbt7PduLhPzh1C0bqR33gxPQHS/ddUvqu6Ygb2FZ/hJZ1GUbnXU2wzImOCfDyarhQ2sX2etNQRhVTc9Qjs5PyfFtOsL3todGH+Q80QbItJd/aeOaJJLDkrWiwuiVA1qVk/deavJZtRuO54pA2QB70gHyYbUbTcsRxbeNcSLzCNqPBDxe3NsyHcFpfZJvR4IdLmxvmSEtsMxqcN89rGuZC5I1tRoOj5bKucR6E0/sy24wG6+RbXeM8iLyxzWgwA07pGudBmAGn2GY0WCdP6xrnQeiAJ9hmNG1HTOOHf+sCZFndrTNb3Ms2owmtib1YK7THpg2UVaEDztB9DtuMhm4Y0AEndEGyLHTA82yxN7gdluiEZLeoxiqx0nDMO9heb2jzwFfibX2wDErJl/u6Fd6IVzXvw8EwB5siMUd/I55jvqAPmh1hKT/LduJztlLZgx48rQucBdGVH3lgO4PRcIWJpeDrEqRaSjZ+t8272cbg8FObY93dVV2iFIou5DD6R9nC8NATXpxH39MlS5t4oF7/vJ+LnjjQwwUE/npjsjQKI//Fimtcx2Uni1edvhlrK6mHpMkLtVGNXO5ooJcecJH0m7aAMYp2expWZR+XOVp8Wx5A0tQ8OyDzQVKPw/sF1wc1zISmrqAdVr3tlme5rJ2lOxPGeY2A3PSyBZczHnxlHhxLJ2D2tV3T4jLGB+8fPIpOaGgLHYGw5i/4dvkhLiEd4OrLRnH1zcUmLXT2ucCVFU6bLvwDcoLezdEVnpDqflVMcrp00t1HwChpih9KuBT/gd4f5DTphkYJM+GMzsgAwrW9OJ0Z8/9Cb4ai+K82mYktHFsW6YUtDpstwtnZ61uO+FRnrB+h7Wex3/BKGxdmZq7Baet9ncEo0S0tzL8TWtaVHCbb/GwYV2Eqn8RxYdsXn0k4gF7Emj8ezt1zBTfPB2Sopcz5dYMR5tFBLSXnQ8O4nJvliwXaXnPEk5gNmu12sYbPj8R6oTGL0B6j74rHcOn8XyfAeADNxX54kVW69w+uOATTdP9Q91X5IH/1/6JZLZd3fCOjoKCgoKCAKZX+AU+wKmeqEtVNAAAAAElFTkSuQmCC`;

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('canvas', {static: false}) canvasRef: ElementRef;
  @ViewChild('pdfv', {static: false}) pdfv: ElementRef;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  activeView = null;
  showSafeBox = true;
  dataStr: string = null;
  previewIndex = 0;
  project: Project;
  deck: Deck = null;
  zoomList = [25, 50, 85, 100, 125, 150, 200];
  zoom = 100;
  side = 'front';
  dpi = 72;

  public aceConfig: AceConfigInterface = {
    mode: 'json',
    theme: 'twilight',
    readOnly: false
  };
  enableDpr = false;

  constructor() { }

  ngOnInit() {
    this.project = projectJson['default'];
    this.deck = this.project.decks[0];
  }

  // generatePdf() {
  //   const cards = [];
  //   const showSafeBox = this.showSafeBox;
  //   // this.showSafeBox = false;
  //   this.deck.data.forEach((d, i) => {
  //     // this.draw(d);
  //     const data = this.canvas.toDataURL();
  //     cards.push(data);
  //   });
  //   this.showSafeBox = showSafeBox;

  //   const docDefinition = this.getDocDefinition(cards);
  //   const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //   pdfDocGenerator.getDataUrl((dataUrl) => {
  //     this.pdfv.nativeElement.src = dataUrl;
  //   });
  // }

  // getDocDefinition(cards) {

  //   const scale = 72 / this.project.print.dpi;
  //   const body = [];
  //   for (let i = 0; i < cards.length; i = i + 4) {
  //     const row = [];

  //     row.push({ width: this.getPixels(this.deck.width) * scale, image: cards[i] });

  //     if (cards[i + 1]) {
  //       row.push({ width: this.getPixels(this.deck.width) * scale, image: cards[i + 1] || '' });
  //     } else {
  //       row.push('');
  //     }

  //     if (cards[i + 2]) {
  //       row.push({ width: this.getPixels(this.deck.width) * scale, image: cards[i + 2] || '' });
  //     } else {
  //       row.push('');
  //     }

  //     if (cards[i + 3]) {
  //       row.push({ width: this.getPixels(this.deck.width) * scale, image: cards[i + 3] || '' });
  //     } else {
  //       row.push('');
  //     }

  //     body.push(row);
  //   }

  //   const dd = {
  //     content: [
  //       {
  //         table: {
  //           body: body
  //         },
  //         layout: {
  //           hLineWidth: function (i, node) { return 1; },
  //           vLineWidth: function (i, node) { return 1; },
  //           paddingLeft: function (i, node) { return 0; },
  //           paddingRight: function (i, node) { return 2; },
  //           paddingTop: function (i, node) { return 0; },
  //           paddingBottom: function (i, node) { return 2; },
  //         }
  //       },
  //     ],
  //     pageSize: 'A4',
  //     pageOrientation: 'landscape',
  //     pageMargins: [18, 18, 18, 18]
  //   };

  //   console.log(dd);

  //   return dd;
  // }
}
