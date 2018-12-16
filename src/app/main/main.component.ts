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
  offsetX;
  offsetY;
  WIDTH;
  HEIGHT;
  config = {};
  dataset = [{
    text1: 'lorem'
  }, {
    text1: 'ispum'
  }];

  docDefinition = {
    content: 'This is an sample PDF printed with pdfMake'
  };

  constructor() { }


  ngOnInit() {
    this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.BB = this.canvas.getBoundingClientRect();
    this.offsetX = this.BB.left;
    this.offsetY = this.BB.top;
    this.WIDTH = this.canvas.width;
    this.HEIGHT = this.canvas.height;
  }

  generate() {

    this.dataset.forEach((d, i) => {
      const data = this.draw(d);
      const x = document.createElement('IMG');
      // x.src = data;
      document.body.appendChild(x);

      const k = document.createElement('div');
      k.innerHTML = data;
      // document.body.appendChild(k)
    });

    const pdfDocGenerator = pdfMake.createPdf(this.docDefinition);
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.pdfv.nativeElement.src = dataUrl;
    });
  }

  ngOnAfterViewInit(): void {
  }

  clear() {
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
  }

  rect(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.closePath();
    this.ctx.fill();
  }

  draw(card) {
    this.clear();
    this.ctx.fillStyle = 'red';
    this.rect(0, 0, this.WIDTH, this.HEIGHT);
    this.ctx.fillStyle = 'white';

    this.ctx.textAlign = 'center';
    this.ctx.fillText(card.text1, this.canvas.width / 2, this.canvas.height / 2);
    return this.canvas.toDataURL();
  }

}
