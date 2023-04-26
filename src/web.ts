import { WebPlugin } from '@capacitor/core';

import type { ZebraPrinterPlugin } from './definitions';

export class ZebraPrinterWeb extends WebPlugin implements ZebraPrinterPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  async print(options: { ip: string, port: number, zpl: string, timeout?: number }): Promise<{ value: string }> {
    const controller = new AbortController();

    var request = new Request(`http://${options.ip}:${options.port}`, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      body: options.zpl,
      signal: controller.signal
    });

    if (options.timeout && options.timeout > 0) {

      return Promise.race([
        fetch(request),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), options.timeout),
        ),
      ]).then(res => {
        console.log('res:', res);
        return {value: "print succesfully executed", res: res}
      }).catch(err => {
  
        console.log('err:', err);
        controller.abort();

        throw Error(err);
      });
    } else {
      return await fetch(request)
        // .then(handleErrors)
        .then(() => {
          return { value: "print succesfully executed" }
        })
        .catch((error) => {
          throw Error(error);
        });
    }

  }
}
