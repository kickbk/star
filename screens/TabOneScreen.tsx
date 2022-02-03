import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";
import { StarPrinter, StarXpandCommand } from "react-native-star-io10";

import { Text, View } from "../components/Themed";
import useStarPrinters from "../hooks/useStarPrinters";
import { RootTabScreenProps } from "../types";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  // const starPrinters = useStarPrinters();
  const [hasError, setHasError] = useState<boolean | undefined>();
  const [paperEmpty, setPaperEmpty] = useState<boolean | undefined>();
  const [paperNearEmpty, setPaperNearEmpty] = useState<boolean | undefined>();
  const [coverOpen, setCoverOpen] = useState<boolean | undefined>();
  const [drawerOpenCloseSignal, setDrawerOpenCloseSignal] = useState<
    boolean | undefined
  >();
  const [starPrinters, setStarPrinters] = useState<StarPrinter[]>([]);
  useStarPrinters(setStarPrinters);

  const onPressGetStatusButton = async (starPrinter: StarPrinter) => {
    if (!starPrinters) {
      return;
    }

    try {
      await starPrinter.open();
      const status = await starPrinter.getStatus();
      setHasError(status.hasError);
      setPaperEmpty(status.paperEmpty);
      setPaperNearEmpty(status.paperNearEmpty);
      setCoverOpen(status.coverOpen);
      setDrawerOpenCloseSignal(status.drawerOpenCloseSignal);
    } catch (error) {
      console.log(`Error: ${String(error)}`);
    } finally {
      await starPrinter.close();
      await starPrinter.dispose();
    }
  };

  const onPressPrintButton = async (starPrinter: StarPrinter) => {
    try {
      // Connect to the printer.
      await starPrinter.open();

      // create printing data. (Please refer to 'Create Printing data')
      const builder = new StarXpandCommand.StarXpandCommandBuilder();
      builder.addDocument(
        new StarXpandCommand.DocumentBuilder().addPrinter(
          new StarXpandCommand.PrinterBuilder()
            // Fetching an image, even from the same folder, return "Invalid source"
            // .actionPrintImage(
            //   new StarXpandCommand.Printer.ImageParameter("icon.png", 406)
            // )
            .styleInternationalCharacter(
              StarXpandCommand.Printer.InternationalCharacterType.Usa
            )
            .styleCharacterSpace(0)
            .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
            .actionPrintText(
              "Star Clothing Boutique\n" +
                "123 Star Road\n" +
                "City, State 12345\n" +
                "\n"
            )
            .styleAlignment(StarXpandCommand.Printer.Alignment.Left)
            .actionPrintText(
              "Date:MM/DD/YYYY    Time:HH:MM PM\n" +
                "--------------------------------\n" +
                "\n"
            )
            .actionPrintText(
              "SKU         Description    Total\n" +
                "300678566   PLAIN T-SHIRT  10.99\n" +
                "300692003   BLACK DENIM    29.99\n" +
                "300651148   BLUE DENIM     29.99\n" +
                "300642980   STRIPED DRESS  49.99\n" +
                "300638471   BLACK BOOTS    35.99\n" +
                "\n" +
                "Subtotal                  156.95\n" +
                "Tax                         0.00\n" +
                "--------------------------------\n"
            )
            .actionPrintText("Total     ")
            .add(
              new StarXpandCommand.PrinterBuilder()
                .styleMagnification(
                  new StarXpandCommand.MagnificationParameter(2, 2)
                )
                .actionPrintText("   $156.95\n")
            )
            .actionPrintText(
              "--------------------------------\n" +
                "\n" +
                "Charge\n" +
                "156.95\n" +
                "Visa XXXX-XXXX-XXXX-0123\n" +
                "\n"
            )
            .add(
              new StarXpandCommand.PrinterBuilder()
                .styleInvert(true)
                .actionPrintText("Refunds and Exchanges\n")
            )
            .actionPrintText("Within ")
            .add(
              new StarXpandCommand.PrinterBuilder()
                .styleUnderLine(true)
                .actionPrintText("30 days")
            )
            .actionPrintText(" with receipt\n")
            .actionPrintText("And tags attached\n" + "\n")
            .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
            .actionPrintBarcode(
              new StarXpandCommand.Printer.BarcodeParameter(
                "0123456",
                StarXpandCommand.Printer.BarcodeSymbology.Jan8
              )
                .setBarDots(3)
                .setBarRatioLevel(
                  StarXpandCommand.Printer.BarcodeBarRatioLevel.Level0
                )
                .setHeight(5)
                .setPrintHri(true)
            )
            .actionFeedLine(1)
            .actionPrintQRCode(
              new StarXpandCommand.Printer.QRCodeParameter("Hello World.\n")
                .setModel(StarXpandCommand.Printer.QRCodeModel.Model2)
                .setLevel(StarXpandCommand.Printer.QRCodeLevel.L)
                .setCellSize(8)
            )
            .actionCut(StarXpandCommand.Printer.CutType.Partial)
        )
      );
      const commands = await builder.getCommands();

      // Print.
      await starPrinter.print(commands);
    } catch (error) {
      // Error.
      console.log(error);
    } finally {
      // Disconnect from the printer and dispose object.
      await starPrinter.close();
      await starPrinter.dispose();
    }
  };

  return (
    <View style={styles.container}>
      {starPrinters?.length ? (
        starPrinters.map((starPrinter, id) => {
          return (
            <View key={id} style={{ padding: 20 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "blue",
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 20,
                }}
              >
                <Text>Model: {starPrinter.information?._model}</Text>
                <Text>Emulation: {starPrinter.information?._emulation}</Text>
              </View>
              <Button
                title="Get Printer Status"
                onPress={() => onPressGetStatusButton(starPrinter)}
              />
              {hasError !== undefined && (
                <View>
                  <Text>hasError: {String(hasError)}</Text>
                  <Text>paperEmpty: {String(paperEmpty)}</Text>
                  <Text>paperNearEmpty: {String(paperNearEmpty)}</Text>
                  <Text>coverOpen: {String(coverOpen)}</Text>
                  <Text>
                    drawerOpenCloseSignal: {String(drawerOpenCloseSignal)}
                  </Text>
                </View>
              )}
              <Button
                title="Print"
                onPress={() => onPressPrintButton(starPrinter)}
              />
            </View>
          );
        })
      ) : (
        <Text>No Printers</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
