import Foundation
import Capacitor
import SwiftSocket

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(ZebraPrinterPlugin)
public class ZebraPrinterPlugin: CAPPlugin {
    private let implementation = ZebraPrinter()

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }

    @objc func print(_ call: CAPPluginCall) {
    let ip = call.getString("ip") ?? ""
    let port = call.getInt("port") ?? 0
    let zpl = call.getString("zpl") ?? ""
        			        

    let client:TCPClient = TCPClient(address: ip, port: Int32(port))
    switch client.connect(timeout: 10){
        case .success:
            switch client.send(string: zpl) {
                case .success:
                    guard let data = client.read(1024*10)
                    else {
                        client.close()
                        call.resolve([
                                    "value": "Succesfully sent to printer"
                         ])
                        return
                            
                    }
                case .failure(let error):
                    client.close()
                    call.reject(error.localizedDescription)

            }
        case .failure(let error):
            call.reject(error.localizedDescription)
        
    }   
}
}
