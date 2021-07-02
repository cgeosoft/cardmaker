import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ContentText, Deck, Elem, ElemType, PrintParams } from '../../models/all';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  @Input() deck: Deck;
  @Input() printParams: PrintParams;

  @ViewChild('canvas', { static: false }) canvasRef: ElementRef;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  zooms = [25, 50, 85, 100, 125, 150, 200];
  zoom = 100;
  index = 0;
  side = 'front';
  enableDpr = true;
  testHeartImg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAS3SURBVHhe7ZpbaBxVGMfXeqlV1IoXEERBK4JKEzNzzm5CYJwzs3WrL76kD74WH8Ra9MHXBKkogoJSFIQ+FMTLg33wzbsg8UEEseCLJYipleJWk92dmY1a3fH/bT4lJGeyO7uz2ZlxfvCHZHfP933/c5nLmSkVFBQUFBTEp1Pdf3XDMYWn5FO+I970lfzEd+SXniM+xGdv4P/Dnirv79T27eYmsenUartXq2IycMTj0Ank+chDDsT+GDlOItfRwC4bnUplDzcZPQ176k4U8JqvxC+eEn/BdKgTCu3Q9yh0Gb9fWHGN2zhET5pu+S6YexE6t10OUjeHI37C3y+17enbOUTytCzjxsCVx5BsbXMRfcproSMoDofcQmt28qbAkc8hR1vTvqe6tSk5v2pN7OWQwxOWSpes2VJhJL/XJR1AS55juhSXU1COXYGSjyDHWc3vY2l95slvaHly+OFAIBdrb0WXbFBhpFqYDYepE8K5uUvx2TPIMdCoRwpLtGmbM2xjMHw1NYXCPG2C4fXn+oFSHkGOi5rvExDVbt7PduLhPzh1C0bqR33gxPQHS/ddUvqu6Ygb2FZ/hJZ1GUbnXU2wzImOCfDyarhQ2sX2etNQRhVTc9Qjs5PyfFtOsL3todGH+Q80QbItJd/aeOaJJLDkrWiwuiVA1qVk/deavJZtRuO54pA2QB70gHyYbUbTcsRxbeNcSLzCNqPBDxe3NsyHcFpfZJvR4IdLmxvmSEtsMxqcN89rGuZC5I1tRoOj5bKucR6E0/sy24wG6+RbXeM8iLyxzWgwA07pGudBmAGn2GY0WCdP6xrnQeiAJ9hmNG1HTOOHf+sCZFndrTNb3Ms2owmtib1YK7THpg2UVaEDztB9DtuMhm4Y0AEndEGyLHTA82yxN7gdluiEZLeoxiqx0nDMO9heb2jzwFfibX2wDErJl/u6Fd6IVzXvw8EwB5siMUd/I55jvqAPmh1hKT/LduJztlLZgx48rQucBdGVH3lgO4PRcIWJpeDrEqRaSjZ+t8272cbg8FObY93dVV2iFIou5DD6R9nC8NATXpxH39MlS5t4oF7/vJ+LnjjQwwUE/npjsjQKI//Fimtcx2Uni1edvhlrK6mHpMkLtVGNXO5ooJcecJH0m7aAMYp2expWZR+XOVp8Wx5A0tQ8OyDzQVKPw/sF1wc1zISmrqAdVr3tlme5rJ2lOxPGeY2A3PSyBZczHnxlHhxLJ2D2tV3T4jLGB+8fPIpOaGgLHYGw5i/4dvkhLiEd4OrLRnH1zcUmLXT2ucCVFU6bLvwDcoLezdEVnpDqflVMcrp00t1HwChpih9KuBT/gd4f5DTphkYJM+GMzsgAwrW9OJ0Z8/9Cb4ai+K82mYktHFsW6YUtDpstwtnZ61uO+FRnrB+h7Wex3/BKGxdmZq7Baet9ncEo0S0tzL8TWtaVHCbb/GwYV2Eqn8RxYdsXn0k4gF7Emj8ezt1zBTfPB2Sopcz5dYMR5tFBLSXnQ8O4nJvliwXaXnPEk5gNmu12sYbPj8R6oTGL0B6j74rHcOn8XyfAeADNxX54kVW69w+uOATTdP9Q91X5IH/1/6JZLZd3fCOjoKCgoKCAKZX+AU+wKmeqEtVNAAAAAElFTkSuQmCC`;
  showSafeBox = true;

  constructor() { }

  ngOnInit() {
    this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.previewCard();
  }

  previewCard() {
    const card = this.deck.data[this.index];
    this.draw(card, this.zoom);
  }

  rect(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.closePath();
    this.ctx.fill();
  }

  draw(card, zoom = 100) {
    // const dpr = this.enableDpr ? window.devicePixelRatio || 1 : 1;
    const z = zoom / 100; // * window.devicePixelRatio;
    const scale = 96 / this.printParams.dpi;
    console.log(scale);
    const w = this.getPixels(this.deck.width);
    const h = this.getPixels(this.deck.height);

    this.canvas.width = w;
    this.canvas.height = h;

    this.canvas.style.width = `${w * scale * z}px`;
    this.canvas.style.height = `${h * scale * z}px`;

    this.clearCard();
    this.drawSafeBox();

    const s = this.deck[this.side] as Elem[];
    s.forEach(e => {
      this.drawElem(e, card);
    });

    this.ctx.scale(1 / scale, 1 / scale);
  }

  getPixels(mm: number) {
    const dpr = this.enableDpr ? window.devicePixelRatio || 1 : 1;
    return mm * 0.0393701 * this.printParams.dpi * dpr;
  }

  clearCard() {
    this.ctx.fillStyle = this.deck.background || 'white';
    this.rect(0, 0, this.getPixels(this.canvas.width), this.getPixels(this.canvas.height));
  }

  drawElem(elem: Elem, card: any) {
    switch (elem.type) {
      case ElemType.image:
        const ci = elem.content as ContentText;
        const myImage = new Image();
        myImage.src = this.testHeartImg;
        this.ctx.drawImage(
          myImage,
          this.getPixels(elem.position.left),
          this.getPixels(elem.position.top),
          this.getPixels(elem.position.width),
          this.getPixels(elem.position.height),
        );
        if (elem.border) {
          this.ctx.beginPath();
          this.ctx.rect(
            this.getPixels(elem.position.left),
            this.getPixels(elem.position.top),
            this.getPixels(elem.position.width),
            this.getPixels(elem.position.height),
          );
          this.ctx.closePath();
          this.ctx.strokeStyle = elem.border.color;
          this.ctx.lineWidth = this.getPixels(elem.border.size);
          this.ctx.stroke();
        }
        break;
      case ElemType.text:
        const ct = elem.content as ContentText;
        this.ctx.fillStyle = ct.color;
        // this.ctx.textAlign = 'center';
        this.ctx.font = `${this.getPixels(ct.fontSize)}px ${ct.fontFamily}`;
        console.log(this.ctx.font);
        const text = ct.text.startsWith('=') ? card[ct.text.substr(1, ct.text.length - 1)] : ct.text;
        // this.ctx.rotate(elem.position.rotate * Math.PI / 180);
        this.ctx.fillText(text, this.getPixels(elem.position.left), this.getPixels(elem.position.top + elem.position.height));

        if (elem.border) {
          this.ctx.beginPath();
          this.ctx.rect(
            this.getPixels(elem.position.left),
            this.getPixels(elem.position.top),
            this.getPixels(elem.position.width),
            this.getPixels(elem.position.height),
          );
          this.ctx.closePath();
          this.ctx.strokeStyle = elem.border.color;
          this.ctx.lineWidth = this.getPixels(elem.border.size);
          this.ctx.stroke();
        }
        // this.ctx.rotate(elem.position.rotate * -1 * Math.PI / 180);

        break;
    }

    this.ctx.beginPath();
    this.ctx.rect(
      this.getPixels(elem.position.left),
      this.getPixels(elem.position.top),
      this.getPixels(elem.position.width),
      this.getPixels(elem.position.height),
    );
    this.ctx.closePath();
    this.ctx.strokeStyle = 'green';
    this.ctx.lineWidth = this.getPixels(.1);
    this.ctx.stroke();
  }

  drawSafeBox(m = 2) {
    if (!this.showSafeBox) { return; }
    this.ctx.beginPath();
    this.ctx.rect(
      this.getPixels(m),
      this.getPixels(m),
      this.getPixels(this.deck.width - (m * 2)),
      this.getPixels(this.deck.height - (m * 2)),
    );
    this.ctx.closePath();
    this.ctx.strokeStyle = 'blue';
    this.ctx.lineWidth = this.getPixels(.1);
    this.ctx.stroke();
  }
}
