import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
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
  BB: any;
  config = {};
  dataset = [{
    text1: 'lorem'
  }, {
    text1: 'sit'
  }, {
    text1: 'amet'
  }, {
    text1: 'ipsum'
  }, {
    text1: 'lorem2'
  }, {
    text1: 'sit2'
  }, {
    text1: 'amet2'
  }, {
    text1: 'ipsum2'
  }];

  template = {
    dpi: 72,
    width: 63.5,
    height: 88.9,
    bgColor: 'lightgrey',
    showSafeBox: true,
  };

  datasetStr;

  dpr = window.devicePixelRatio || 1;
  bsr;

  previewIndex = 0;

  constructor() { }


  ngOnInit() {
    this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(this.dpr, this.dpr);
    this.BB = this.canvas.getBoundingClientRect();
    this.datasetStr = JSON.stringify(this.dataset);

    this.canvas.height = this.template.height * 20;
    this.canvas.width = this.template.width * 20;

    setTimeout(() => {
      this.preview();
     this. generate();
    }, 1 * 1000);
  }

  preview() {
    const card = this.dataset[this.previewIndex];
    this.draw(card);
  }

  generate() {
    const cards = [];
    const showSafeBox = this.template.showSafeBox;
    this.template.showSafeBox = false;
    this.dataset.forEach((d, i) => {
      const data = this.draw(d);
      cards.push(data);
    });
    this.template.showSafeBox = showSafeBox;

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
            paddingLeft: function(i, node) { return 0; },
            paddingRight: function(i, node) { return 2; },
            paddingTop: function(i, node) { return 0; },
            paddingBottom: function(i, node) { return 2; },
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
    this.dataset = JSON.parse(this.datasetStr);
  }

  rect(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.closePath();
    this.ctx.fill();
  }

  draw(card) {
    this.ctx.fillStyle = this.template.bgColor || 'white';
    this.rect(0, 0, this.getPixelFromMM(this.template.width), this.getPixelFromMM(this.template.height));

    if (this.template.showSafeBox) {
      this.ctx.beginPath();
      this.ctx.rect(
        this.getPixelFromMM(5),
        this.getPixelFromMM(5),
        this.getPixelFromMM(this.template.width - 10),
        this.getPixelFromMM(this.template.height - 10),
      );
      this.ctx.closePath();
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    this.ctx.fillStyle = 'black';
    this.ctx.textAlign = 'center';
    this.ctx.font = '20px arial';
    this.ctx.fillText(card.text1, this.canvas.width / 2, this.canvas.height / 2);
    return this.canvas.toDataURL();
  }

  getPixelFromMM(mm: number) {
    return mm * 0.0393701 * this.template.dpi * this.dpr;
  }

}
