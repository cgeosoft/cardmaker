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
    text1: 'ispum'
  }];

  template = {
    width: 63.5,
    height: 88.9,
    bgColor: 'green',
    showSafeBox: true,
  };

  datasetStr;

  dpr = window.devicePixelRatio || 1;
  bsr;

  docDefinition = {
    content: []
  };

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

    }, 1 * 1000);
  }

  preview() {
    const card = this.dataset[this.previewIndex];
    this.draw(card);
  }

  generate() {
    this.docDefinition.content = [];
    this.dataset.forEach((d, i) => {
      const data = this.draw(d);
      this.docDefinition.content.push({
        image: data, width: 200
      });
      const x = document.createElement('IMG');
      // x.src = data;
      document.body.appendChild(x);

      // const k = document.createElement('div');
      // k.innerHTML = data;
      // document.body.appendChild(k)
    });

    const pdfDocGenerator = pdfMake.createPdf(this.docDefinition);
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.pdfv.nativeElement.src = dataUrl;
    });
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
    this.ctx.fillText(card.text1, this.canvas.width / 2, this.canvas.height / 2);
    return this.canvas.toDataURL();
  }

  getPixelFromMM(mm: number) {
    return mm * 72 * 0.0393701 * this.dpr;
  }

}
