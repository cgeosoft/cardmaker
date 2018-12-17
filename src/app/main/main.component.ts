import { Project, Deck } from './../models/all';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import * as projectJson from '../../data/classic-cards.json';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('pdfv') pdfv: ElementRef;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  activeView = 'TEMPLATE';

  showSafeBox = true;

  dataStr: string = null;

  previewIndex = 0;

  project: Project;

  deck: Deck = null;

  constructor() { }

  ngOnInit() {

    this.project = projectJson['default'];
    this.deck = this.project.decks[0];

    setTimeout(() => {

      this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
      this.ctx = this.canvas.getContext('2d');

      this.canvas.height = this.getPixelFromMM(this.deck.height);
      this.canvas.width = this.getPixelFromMM(this.deck.width);

      this.dataStr = JSON.stringify(this.deck.data, [''], 2);
      this.generatePdf();
      this.previewCard();

    }, 1 * 1000);
  }

  previewCard() {
    const card = this.deck.data[this.previewIndex];
    this.draw(card);
  }

  generatePdf() {
    const cards = [];
    const showSafeBox = this.showSafeBox;
    this.showSafeBox = false;
    this.deck.data.forEach((d, i) => {
      const data = this.draw(d);
      cards.push(data);
    });
    this.showSafeBox = showSafeBox;

    const docDefinition = this.getDocDefinition(cards);
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.pdfv.nativeElement.src = dataUrl;
    });
  }

  getDocDefinition(cards) {
    const body = [];
    for (let i = 0; i < cards.length; i = i + 4) {
      const row = [];

      row.push({ image: cards[i] });

      if (cards[i + 1]) {
        row.push({ image: cards[i + 1] || '' });
      } else {
        row.push('');
      }

      if (cards[i + 2]) {
        row.push({ image: cards[i + 2] || '' });
      } else {
        row.push('');
      }

      if (cards[i + 3]) {
        row.push({ image: cards[i + 3] || '' });
      } else {
        row.push('');
      }

      body.push(row);
    }

    const dd = {
      content: [
        {
          table: {
            body: body
          },
          layout: {
            hLineWidth: function (i, node) { return 0; },
            vLineWidth: function (i, node) { return 0; },
            paddingLeft: function (i, node) { return 0; },
            paddingRight: function (i, node) { return 2; },
            paddingTop: function (i, node) { return 0; },
            paddingBottom: function (i, node) { return 2; },
          }
        },
      ],
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [18, 18, 18, 18]
    };

    console.log(dd);

    return dd;
  }

  ngOnAfterViewInit(): void {
  }

  parseData() {
    this.deck.data = JSON.parse(this.dataStr);
  }

  rect(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.closePath();
    this.ctx.fill();
  }

  draw(card) {
    this.ctx.fillStyle = this.deck.background || 'white';
    this.rect(0, 0, this.getPixelFromMM(this.deck.width), this.getPixelFromMM(this.deck.height));

    if (this.showSafeBox) {
      this.ctx.beginPath();
      this.ctx.rect(
        this.getPixelFromMM(5),
        this.getPixelFromMM(5),
        this.getPixelFromMM(this.deck.width - 10),
        this.getPixelFromMM(this.deck.height - 10),
      );
      this.ctx.closePath();
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    this.ctx.fillStyle = 'black';
    this.ctx.textAlign = 'center';
    this.ctx.font = '20px arial';
    this.ctx.fillText(card.symbol, this.canvas.width / 2, this.canvas.height / 2);
    return this.canvas.toDataURL();
  }

  getPixelFromMM(mm: number) {
    return mm * 0.0393701 * this.project.print.dpi;
  }

}
