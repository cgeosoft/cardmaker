import { Component, Input, OnInit } from '@angular/core';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/twilight';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Deck, PrintParams } from '../../models/all';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() deck: Deck;
  @Input() printParams: PrintParams;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  tab = 'template';
  showSafeBox = true;
  dataStr: string = null;
  previewIndex = 0;
  zoom = 100;
  side = 'front';

  aceConfig: AceConfigInterface = {
    mode: 'json',
    // theme: 'twilight',
    readOnly: false
  };
  enableDpr = false;

  constructor() { }

  ngOnInit() {
    this.dataStr = JSON.stringify(this.deck.data, null, 2);
  }

  parseData() {
    this.deck.data = JSON.parse(this.dataStr);
  }
}
