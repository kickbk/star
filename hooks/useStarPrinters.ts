import { useEffect, useState } from "react";
import {
  InterfaceType,
  StarDeviceDiscoveryManagerFactory,
  StarPrinter,
} from "react-native-star-io10";

export default function useStarPrinters(setStarPrinters: any) {
  // const [starPrinters, setStarPrinters] = useState<StarPrinter[]>([]);

  // Load any resources or data that we need prior to rendering the app
  let printers: StarPrinter[] = [];

  useEffect(() => {
    async function discover(): Promise<void> {
      console.log("Running discover");
      const interfaceTypes = [
        InterfaceType.Lan,
        InterfaceType.Bluetooth,
        InterfaceType.BluetoothLE,
        InterfaceType.Usb,
      ];
      interfaceTypes.map(async (interfaceType) => {
        console.log("interface", interfaceType);
        try {
          // Specify your printer interface types.
          const manager = await StarDeviceDiscoveryManagerFactory.create([
            interfaceType,
          ]);

          // Set discovery time. (option)
          manager.discoveryTime = 10000;

          // Callback for printer found.
          manager.onPrinterFound = (printer: StarPrinter) => {
            console.log("FOUND A PRINTER", printer.information?.model);
            // console.log(printer);
            printers = [...printers, printer];
            setStarPrinters(printers);
            // console.log(printer.information);
          };

          // Callback for discovery finished. (option)
          manager.onDiscoveryFinished = () => {
            console.log(`Discovery finished.`);
          };

          // Start discovery.
          await manager.startDiscovery();

          // Stop discovery.
          // await manager.stopDiscovery()
        } catch (error) {
          // Error.
          console.log(interfaceType, error);
        }
      });
    }
    discover();
  }, []);
}
