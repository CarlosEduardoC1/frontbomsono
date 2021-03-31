import React from 'react';
import ReactToPrint from 'react-to-print';

import ComponentToPrint from './topdf';
export class Impressao {

    constructor(dadosParaImpressao) {
      this.dadosParaImpressao = dadosParaImpressao;
    }  
  
    async PreparaDocumento() {
      const corpoDocumento = this.CriaCorpoDocumento();
      const documento = this.GerarDocumento(corpoDocumento);
      return documento;
    }
  
    CriaCorpoDocumento() {
      const header = [
        { text: 'Nome Produto', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
        { text: 'Quantidade', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
        { text: 'Valor', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      ];
      const body = this.dadosParaImpressao.map((prod) => {
        return [
          { text: prod.nome_cliente, fontSize: 8 },
          { text: prod.qtd, fontSize: 8 },
          { text: prod.total, fontSize: 8 },
        ];
      });
  
      const lineHeader = [
        {
          text:
            '__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
          alignment: 'center',
          fontSize: 5,
          colSpan: 3,
        },
        {},
        {},
      ];
  
      let content = [header, lineHeader];
      content = [...content, ...body];
      return content;
    }
  
    GerarDocumento(corpoDocumento) {
      const documento = {
        pageSize: 'A4',
        pageMargins: [14, 53, 14, 48],
        header: function () {
          return {
              margin: [14, 12, 14, 0],
              layout: 'noBorders',
              table: {
                widths: ['*'],
                body: [                             
                  [
                    { text: 'RELATÓRIO DE VENDAS', style: 'reportName' }
                  ]              
                ],
              },
            };
        },
      content: [
        {
              layout: 'noBorders',
              table: {              
                headerRows: 1,
                widths: [ '*', 55, 55 ],
  
                body: corpoDocumento
              }
            },
      ],
      footer(currentPage, pageCount) {
            return {
              layout: 'noBorders',
              margin: [14, 0, 14, 22],
              table: {
                widths: ['auto'],
                body: [
                  [
                    {
                      text:
                        '_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                      alignment: 'center',
                      fontSize: 5,
                    },
                  ],
                  [
                    [
                      {
                        text: `Página ${currentPage.toString()} de ${pageCount}`,
                        fontSize: 7,
                        alignment: 'right',
                        /* horizontal, vertical */
                        margin: [3, 0],
                      },
                      {
                        text: '© Lojinha de TI',
                        fontSize: 7,
                        alignment: 'center',
                      },
                    ],
                  ],
                ],
              },
            };
          },
      styles: {
        reportName: {
          fontSize: 9,
          bold: true,
          alignment: 'center',
          margin: [0, 4, 0, 0],
        }
      },
  
    };
      return documento;
    }
  }