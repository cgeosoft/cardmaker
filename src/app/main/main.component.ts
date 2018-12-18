import { Project, Deck, Elem, ElemType, ContentText } from './../models/all';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import * as projectJson from '../../data/classic-cards.json';
import { AceConfigInterface } from 'ngx-ace-wrapper';

import 'brace';
import 'brace/mode/json';
import 'brace/theme/twilight';

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

  activeView = null;
  showSafeBox = true;
  dataStr: string = null;
  previewIndex = 0;
  project: Project;
  deck: Deck = null;
  zoomList = [25, 50, 85, 100, 125, 150, 200];
  zoom = 100;
  side = 'front';
  enableDpr = true;

  public aceConfig: AceConfigInterface = {
    mode: 'json',
    theme: 'twilight',
    readOnly: false
  };

  constructor() { }

  ngOnInit() {
    this.project = projectJson['default'];
    this.deck = this.project.decks[0];
    this.selectView('TEMPLATE');
  }

  selectView(view: string) {
    this.activeView = view;
    switch (view) {
      case 'TEMPLATE':
        setTimeout(() => {
          this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
          this.ctx = this.canvas.getContext('2d');
          this.enableDpr = false;
          this.previewCard();
        });
        break;
      case 'DATASET':
        this.dataStr = JSON.stringify(this.deck.data, ' ', 2);
        break;
      case 'PDF':
        this.enableDpr = false;
        this.generatePdf();
        break;

    }
  }

  previewCard() {
    const card = this.deck.data[this.previewIndex];
    this.draw(card, this.zoom);
  }

  generatePdf() {
    const cards = [];
    const showSafeBox = this.showSafeBox;
    this.showSafeBox = false;
    this.deck.data.forEach((d, i) => {
      this.draw(d);
      const data = this.canvas.toDataURL();
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

  draw(card, zoom = 100) {
    const z = zoom / 100 * window.devicePixelRatio;
    const w = this.getPixelFromMM(this.deck.width);
    const h = this.getPixelFromMM(this.deck.height);

    this.canvas.width = w;
    this.canvas.height = h;

    this.canvas.style.width = `${w / this.project.print.dpi * 72 * z}px`;
    this.canvas.style.height = `${h / this.project.print.dpi * 72 * z}px`;

    // this.ctx.scale(.2, .2);

    this.clearCard();
    this.drawSafeBox();

    const s = this.deck[this.side] as Elem[];
    s.forEach(e => {
      this.drawElem(e, card);
    });

  }

  getPixelFromMM(mm: number) {
    const dpr = this.enableDpr ? window.devicePixelRatio : 1;
    return mm * 0.0393701 * this.project.print.dpi * dpr;
  }

  clearCard() {
    this.ctx.fillStyle = this.deck.background || 'white';
    this.rect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawElem(elem: Elem, card: any) {
    switch (elem.type) {
      case ElemType.image:
        break;
      case ElemType.text:
        const c = elem.content as ContentText;
        this.ctx.fillStyle = c.color;
        // this.ctx.textAlign = 'center';
        this.ctx.font = c.font;
        const text = c.text.startsWith('=') ? card[c.text.substr(1, c.text.length - 1)] : c.text;
        this.ctx.fillText(text, this.getPixelFromMM(elem.position.left), this.getPixelFromMM(elem.position.top + elem.position.height));

        if (elem.border) {
          this.ctx.beginPath();
          this.ctx.rect(
            this.getPixelFromMM(elem.position.left),
            this.getPixelFromMM(elem.position.top),
            this.getPixelFromMM(elem.position.width),
            this.getPixelFromMM(elem.position.height),
          );
          this.ctx.closePath();
          this.ctx.strokeStyle = elem.border.color;
          this.ctx.lineWidth = elem.border.size;
          this.ctx.stroke();
        }

        break;
    }
  }

  drawSafeBox(m = 2) {
    if (!this.showSafeBox) { return; }
    this.ctx.beginPath();
    this.ctx.rect(
      this.getPixelFromMM(m),
      this.getPixelFromMM(m),
      this.canvas.width - this.getPixelFromMM(m * 2),
      this.canvas.height - this.getPixelFromMM(m * 2),
    );
    this.ctx.closePath();
    this.ctx.strokeStyle = 'blue';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }
}
